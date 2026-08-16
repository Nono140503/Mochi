import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { useMochiStore, MochiMood } from "../store/mochiStore";
import MochiBody from "../components/MochiBody";
import { sendToMochi, extractMood, transcribeAudio, speakMochiText } from "../lib/api";

import MirrorHeader from "../components/mirror/MirrorHeader";
import MirrorReflectionCard from "../components/mirror/MirrorReflectionCard";
import MirrorHistoryList from "../components/mirror/MirrorHistoryList";
import MirrorInputBar from "../components/mirror/MirrorInputBar";
import MirrorVoiceModal from "../components/mirror/MirrorVoiceModal";

const VALID_MOODS: MochiMood[] = [
  "neutral",
  "happy",
  "loved",
  "content",
  "calm",
  "sad",
  "deeply_sad",
  "anxious",
  "overwhelmed",
  "angry",
  "annoyed",
  "lonely",
  "tired",
  "burnt_out",
  "scared",
  "numb",
  "hopeful",
  "excited",
  "grateful",
  "proud",
  "at_peace",
  "wilting",
  "glowing",
  "curled",
  "blooming",
];

async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function Mirror() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ChatGPT-style Live Voice Mode Modal
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [liveTranscript, setLiveTranscript] = useState("");

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const { mood, baseColor, userName, setMood, history } = useMochiStore();

  useEffect(() => {
    return () => {
      Speech.stop();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  const speakText = async (text: string, onFinish?: () => void) => {
    if (!text) return;
    setIsSpeaking(true);
    if (voiceModeActive) setVoiceStatus("speaking");

    await speakMochiText(
      text,
      () => {
        setIsSpeaking(false);
        if (voiceModeActive) setVoiceStatus("idle");
        if (onFinish) onFinish();
      },
      soundRef
    );
  };

  // Open ChatGPT-style Voice Mode
  const openVoiceMode = async () => {
    setVoiceModeActive(true);
    setVoiceStatus("speaking");
    const greeting = `Hi ${userName || "friend"}! I'm right here with you. Would you like to tell me how you're feeling today?`;
    speakText(greeting, () => {
      startRecording();
    });
  };

  const closeVoiceMode = () => {
    Speech.stop();
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(() => {});
      recordingRef.current = null;
    }
    setIsRecording(false);
    setVoiceModeActive(false);
    setVoiceStatus("idle");
  };

  // Start Audio Recording
  const startRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }

      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Microphone permission is required for voice conversation.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      Speech.stop();
      setIsSpeaking(false);

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      if (voiceModeActive) setVoiceStatus("listening");
    } catch (err) {
      console.warn("Failed to start audio recording:", err);
      setIsRecording(false);
      if (voiceModeActive) setVoiceStatus("idle");
    }
  };

  // Stop Recording & Transcribe
  const stopRecording = async () => {
    const rec = recordingRef.current;
    recordingRef.current = null;

    setIsRecording(false);
    if (voiceModeActive) setVoiceStatus("processing");
    setLoading(true);

    if (!rec) {
      setLoading(false);
      return;
    }

    try {
      const status = await rec.getStatusAsync();
      if (status.canRecord || status.isRecording) {
        await rec.stopAndUnloadAsync();
      }
      const uri = rec.getURI();

      if (uri) {
        const base64Audio = await uriToBase64(uri);
        const transcribedText = await transcribeAudio(base64Audio);

        if (transcribedText) {
          setInput(transcribedText);
          setLiveTranscript(transcribedText);
          await processUserSpeech(transcribedText);
        }
      }
    } catch (err) {
      console.warn("Transcribe audio exception:", err);
    } finally {
      setLoading(false);
    }
  };

  const processUserSpeech = async (spokenText: string) => {
    if (!spokenText.trim()) return;
    setReply("");
    try {
      const raw = await sendToMochi("mirror", [
        { role: "user", content: spokenText.trim() },
      ]);
      const { reply: cleanReply, mood: taggedMood } = extractMood(raw);
      setReply(cleanReply);

      const nextMood = VALID_MOODS.includes(taggedMood as MochiMood)
        ? (taggedMood as MochiMood)
        : "neutral";
      await setMood(nextMood, spokenText.trim(), "mirror");

      speakText(cleanReply);
    } catch (e) {
      console.warn("Voice process error:", e);
      setReply("I'm right here listening to you. Tell me more?");
    }
  };

  const handleShare = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setReply("");
    Speech.stop();

    try {
      const raw = await sendToMochi("mirror", [
        { role: "user", content: input.trim() },
      ]);
      const { reply: cleanReply, mood: taggedMood } = extractMood(raw);
      setReply(cleanReply);

      speakText(cleanReply);

      const nextMood = VALID_MOODS.includes(taggedMood as MochiMood)
        ? (taggedMood as MochiMood)
        : "neutral";
      await setMood(nextMood, input.trim(), "mirror");
    } catch (e: any) {
      setReply("Mochi couldn't quite hear that. Try again?");
      console.warn(e);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <MirrorHeader onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.mochiWrap}>
            <MochiBody mood={mood} baseColor={baseColor} size={200} />
            <Text style={styles.moodLabel}>
              Mochi feels <Text style={styles.moodValue}>{mood}</Text>
            </Text>
          </View>

          <Pressable style={styles.voiceBannerBtn} onPress={openVoiceMode}>
            <FontAwesome name="microphone" size={18} color="#fff" />
            <Text style={styles.voiceBannerText}>Start Live Voice Conversation</Text>
          </Pressable>

          <MirrorReflectionCard
            reply={reply}
            isSpeaking={isSpeaking}
            onToggleSpeech={() => (isSpeaking ? Speech.stop() : speakText(reply))}
          />

          {!reply && <MirrorHistoryList history={history} />}
        </ScrollView>
      </KeyboardAvoidingView>

      <MirrorInputBar
        input={input}
        setInput={setInput}
        loading={loading}
        isRecording={isRecording}
        onSend={handleShare}
      />

      <MirrorVoiceModal
        visible={voiceModeActive}
        mood={mood}
        baseColor={baseColor}
        voiceStatus={voiceStatus}
        liveTranscript={liveTranscript}
        isRecording={isRecording}
        onClose={closeVoiceMode}
        onToggleRecording={() => (isRecording ? stopRecording() : startRecording())}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mochiWrap: {
    alignItems: "center",
    marginVertical: 16,
  },
  moodLabel: {
    fontSize: 16,
    color: "#5A5A5A",
    marginTop: 12,
  },
  moodValue: {
    fontWeight: "700",
    color: "#7D7AF2",
    textTransform: "capitalize",
  },
  voiceBannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7D7AF2",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  voiceBannerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
