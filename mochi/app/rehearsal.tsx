import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../components/MochiBody";
import { sendToMochi, ChatMessage, transcribeAudio, speakMochiText, extractMood } from "../lib/api";
import { useMochiStore, MochiMood } from "../store/mochiStore";

import RehearsalSetupView from "../components/rehearsal/RehearsalSetupView";
import RehearsalHeader from "../components/rehearsal/RehearsalHeader";
import RehearsalMessageList from "../components/rehearsal/RehearsalMessageList";
import RehearsalInputBar from "../components/rehearsal/RehearsalInputBar";
import RehearsalFinishedCard from "../components/rehearsal/RehearsalFinishedCard";
import RehearsalVoiceModal from "../components/rehearsal/RehearsalVoiceModal";

export default function Rehearsal() {
  const router = useRouter();
  const baseColor = useMochiStore((s) => s.baseColor);
  const bumpStreak = useMochiStore((s) => s.bumpStreak);
  const saveRehearsalSession = useMochiStore((s) => s.saveRehearsalSession);

  const [setupDone, setSetupDone] = useState(false);
  const [personaDescription, setPersonaDescription] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [mochiMood, setMochiMood] = useState<MochiMood>("curled");

  // Voice Chat States
  const [isRecording, setIsRecording] = useState(false);
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [liveTranscript, setLiveTranscript] = useState("");

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      Speech.stop();
      if (soundRef.current) soundRef.current.unloadAsync().catch(() => {});
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  const speakText = async (text: string, onFinish?: () => void) => {
    if (!text) return;
    if (voiceModeActive) setVoiceStatus("speaking");

    await speakMochiText(
      text,
      () => {
        if (voiceModeActive) setVoiceStatus("idle");
        if (onFinish) onFinish();
      },
      soundRef
    );
  };

  const startRehearsal = () => {
    if (!personaDescription.trim()) return;
    setMessages([
      {
        role: "user",
        content: `[SETUP - do not reply to this line directly, just adopt the persona] The person I need to practice talking to: ${personaDescription.trim()}. Start the conversation naturally as they would.`,
      },
    ]);
    setSetupDone(true);
    setFinished(false);
    setMochiMood("curled");
    sendFirstTurn(personaDescription.trim());
  };

  const sendFirstTurn = async (persona: string) => {
    setLoading(true);
    try {
      const reply = await sendToMochi("rehearsal", [
        {
          role: "user",
          content: `The person I need to practice talking to: ${persona}. Start the conversation naturally as they would, in character.`,
        },
      ]);
      const { reply: cleanReply, mood: parsedMood } = extractMood(reply);
      setMessages((m) => [...m, { role: "assistant", content: cleanReply }]);
      if (parsedMood) setMochiMood(parsedMood as MochiMood);
      speakText(cleanReply);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Mochi had a moment. Tap send or try restarting rehearsal." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const send = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: textToSend.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendToMochi("rehearsal", next);
      const { reply: cleanReply, mood: parsedMood } = extractMood(reply);
      setMessages((m) => [...m, { role: "assistant", content: cleanReply }]);
      setLiveTranscript(cleanReply);

      if (parsedMood) setMochiMood(parsedMood as MochiMood);

      // Speak reply out loud with continuous loop in Voice Mode
      speakText(cleanReply, () => {
        if (voiceModeActive && !finished) {
          setTimeout(() => {
            startRecordingInVoiceMode();
          }, 800);
        }
      });
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Couldn't send that turn. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Microphone Controls
  const startRecordingInVoiceMode = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setVoiceStatus("listening");
    } catch (err) {
      console.warn("Failed to start recording:", err);
      setVoiceStatus("idle");
    }
  };

  const stopRecordingInVoiceMode = async () => {
    if (!recordingRef.current) return;
    const rec = recordingRef.current;
    recordingRef.current = null;
    setIsRecording(false);
    setVoiceStatus("processing");

    try {
      const status = await rec.getStatusAsync();
      if (status.canRecord) {
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        if (uri) {
          const response = await fetch(uri);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64Audio = reader.result?.toString().split(",")[1];
            const transcribedText = await transcribeAudio(base64Audio);
            if (transcribedText) {
              await send(transcribedText);
            } else {
              setVoiceStatus("idle");
            }
          };
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to transcribe:", err);
    }
    setVoiceStatus("idle");
  };

  const openVoiceMode = async () => {
    setVoiceModeActive(true);
    setLiveTranscript("Roleplay practice mode... Say something to your practice partner!");
    await startRecordingInVoiceMode();
  };

  const closeVoiceMode = async () => {
    setVoiceModeActive(false);
    Speech.stop();
    if (soundRef.current) soundRef.current.unloadAsync().catch(() => {});
    if (recordingRef.current) {
      const rec = recordingRef.current;
      recordingRef.current = null;
      rec.stopAndUnloadAsync().catch(() => {});
    }
    setIsRecording(false);
    setVoiceStatus("idle");
  };

  const handleEndRehearsal = () => {
    setLoading(false);
    setFinished(true);
    setMochiMood("glowing");
    bumpStreak();
    saveRehearsalSession(personaDescription, `Rehearsed hard conversation with: ${personaDescription || "partner"}`);
    setTimeout(() => {
      setMochiMood("neutral");
    }, 1500);
  };

  const handleReset = () => {
    setSetupDone(false);
    setPersonaDescription("");
    setMessages([]);
    setInput("");
    setFinished(false);
    setMochiMood("curled");
  };

  if (!setupDone) {
    return (
      <RehearsalSetupView
        baseColor={baseColor}
        personaDescription={personaDescription}
        setPersonaDescription={setPersonaDescription}
        onStart={startRehearsal}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RehearsalHeader onBack={() => router.back()} onReset={handleReset} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.mochiWrap}>
          <MochiBody mood={mochiMood} baseColor={baseColor} size={140} />
        </View>

        <Pressable style={styles.voiceBannerBtn} onPress={openVoiceMode}>
          <FontAwesome name="microphone" size={16} color="#fff" />
          <Text style={styles.voiceBannerText}>Start Live Voice Rehearsal ✨</Text>
        </Pressable>

        <RehearsalMessageList messages={messages} loading={loading} />

        {!finished ? (
          <RehearsalInputBar
            input={input}
            setInput={setInput}
            isRecording={isRecording}
            onSend={() => send()}
            onToggleRecording={isRecording ? stopRecordingInVoiceMode : startRecordingInVoiceMode}
            onEndRehearsal={handleEndRehearsal}
          />
        ) : (
          <RehearsalFinishedCard onRestart={handleReset} />
        )}
      </KeyboardAvoidingView>

      <RehearsalVoiceModal
        visible={voiceModeActive}
        mochiMood={mochiMood}
        baseColor={baseColor}
        voiceStatus={voiceStatus}
        liveTranscript={liveTranscript}
        isRecording={isRecording}
        onClose={closeVoiceMode}
        onToggleRecording={isRecording ? stopRecordingInVoiceMode : startRecordingInVoiceMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  mochiWrap: {
    alignItems: "center",
    marginVertical: 10,
  },
  voiceBannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7D7AF2",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 8,
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  voiceBannerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
