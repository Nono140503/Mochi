import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../components/MochiBody";
import { sendToMochi, ChatMessage, transcribeAudio, synthesizeVoice, speakMochiText, extractMood } from "../lib/api";
import { useMochiStore, MochiMood } from "../store/mochiStore";

export default function Rehearsal() {
  const router = useRouter();
  const baseColor = useMochiStore((s) => s.baseColor);
  const bumpStreak = useMochiStore((s) => s.bumpStreak);
  const setMood = useMochiStore((s) => s.setMood);

  const [setupDone, setSetupDone] = useState(false);
  const [personaDescription, setPersonaDescription] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [mochiMood, setMochiMood] = useState<MochiMood>("curled");

  // Voice Chat States
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    setIsTranscribing(true);

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
            setIsTranscribing(false);
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
    setIsTranscribing(false);
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
    setMood("glowing", `Rehearsed hard conversation with: ${personaDescription || "partner"}`, "rehearsal");
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
      <SafeAreaView style={styles.setupContainer}>
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <FontAwesome name="arrow-left" size={18} color="#3A3A3A" />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.setupScroll}>
          <MochiBody mood="curled" baseColor={baseColor} size={170} />
          <Text style={styles.setupTitle}>Rehearsal Mode</Text>
          <Text style={styles.setupLabel}>
            Who do you need to practice talking to, and what's the situation? Describe the person's personality
          </Text>
          <TextInput
            style={styles.setupInput}
            placeholder="e.g. My roommate, about splitting rent unfairly. She gets defensive fast."
            placeholderTextColor="#B0A9C7"
            value={personaDescription}
            onChangeText={setPersonaDescription}
            multiline
            numberOfLines={4}
          />
          <Pressable style={styles.startBtn} onPress={startRehearsal}>
            <Text style={styles.startBtnText}>Start Rehearsal 🎭</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={18} color="#3A3A3A" />
        </Pressable>
        <Text style={styles.headerTitle}>Rehearsal Mode</Text>
        <Pressable style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetBtnText}>New</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.mochiWrap}>
          <MochiBody mood={mochiMood} baseColor={baseColor} size={140} />
        </View>

        {/* Live Voice Conversation Launcher Banner */}
        <Pressable style={styles.voiceBannerBtn} onPress={openVoiceMode}>
          <FontAwesome name="microphone" size={16} color="#fff" />
          <Text style={styles.voiceBannerText}>Start Live Voice Rehearsal ✨</Text>
        </Pressable>

        <ScrollView contentContainerStyle={styles.chatScroll}>
          {messages.map((m, i) => {
            if (m.content.startsWith("[SETUP")) return null;
            const isUser = m.role === "user";
            return (
              <View
                key={i}
                style={[
                  styles.msgBubble,
                  isUser ? styles.msgUser : styles.msgAssistant,
                ]}
              >
                <Text style={isUser ? styles.msgTextUser : styles.msgTextAssistant}>
                  {m.content}
                </Text>
              </View>
            );
          })}
          {loading && (
            <View style={styles.loadingBubble}>
              <ActivityIndicator color="#7D7AF2" />
              <Text style={styles.loadingText}>Roleplay partner is thinking...</Text>
            </View>
          )}
        </ScrollView>

        {!finished ? (
          <View style={styles.footer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Say what you'd say..."
                placeholderTextColor="#B0A9C7"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => send()}
              />
              <Pressable
                style={[styles.micBtn, isRecording && styles.micBtnActive]}
                onPress={isRecording ? stopRecordingInVoiceMode : startRecordingInVoiceMode}
              >
                <FontAwesome name={isRecording ? "stop" : "microphone"} size={16} color="#fff" />
              </Pressable>
              <Pressable style={styles.sendBtn} onPress={() => send()}>
                <FontAwesome name="paper-plane" size={16} color="#fff" />
              </Pressable>
            </View>
            <Pressable style={styles.endBtn} onPress={handleEndRehearsal}>
              <Text style={styles.endBtnText}>End Rehearsal & Reflect</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.finishedCard}>
            <Text style={styles.finishedTitle}>Great practice session! 🌟</Text>
            <Text style={styles.finishedSub}>
              How did that feel? Rehearsing tough conversations builds emotional confidence.
            </Text>
            <Pressable style={styles.startBtn} onPress={handleReset}>
              <Text style={styles.startBtnText}>Practice Another Conversation</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* ChatGPT-style Live Voice Mode Modal */}
      <Modal visible={voiceModeActive} animationType="slide" transparent>
        <View style={styles.voiceModalContainer}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.voiceModalScroll}
              showsVerticalScrollIndicator={false}
            >
              <Pressable style={styles.closeVoiceBtn} onPress={closeVoiceMode}>
                <FontAwesome name="times" size={20} color="#fff" />
              </Pressable>

              <View style={styles.voiceModalMochi}>
                <MochiBody mood={mochiMood} baseColor={baseColor} size={220} />
              </View>

              <Text style={styles.voiceStatusTitle}>
                {voiceStatus === "listening" && "Listening to you... "}
                {voiceStatus === "processing" && "Roleplay partner thinking..."}
                {voiceStatus === "speaking" && "Roleplay partner responding..."}
                {voiceStatus === "idle" && "Ready for next turn ✨"}
              </Text>

              <View style={styles.transcriptCard}>
                <Text style={styles.transcriptText}>{liveTranscript}</Text>
              </View>

              <View style={styles.voiceControlsRow}>
                {isRecording ? (
                  <Pressable style={styles.voiceStopBtn} onPress={stopRecordingInVoiceMode}>
                    <FontAwesome name="stop" size={24} color="#fff" />
                  </Pressable>
                ) : (
                  <Pressable style={styles.voiceMicBtn} onPress={startRecordingInVoiceMode}>
                    <FontAwesome name="microphone" size={28} color="#fff" />
                  </Pressable>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  setupContainer: { flex: 1, backgroundColor: "#FFF8F0" },
  topNav: { paddingHorizontal: 20, paddingTop: 10 },
  setupScroll: { alignItems: "center", padding: 24, paddingTop: 20 },
  setupTitle: { fontFamily: "BubblegumSans_400Regular", fontSize: 28, color: "#3A3A3A", marginTop: 12 },
  setupLabel: { fontSize: 15, color: "#6A6A7A", textAlign: "center", marginTop: 8, marginBottom: 20, lineHeight: 22 },
  setupInput: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: "#3A3A3A",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  startBtn: {
    width: "100%",
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontFamily: "BubblegumSans_400Regular", fontSize: 22, color: "#3A3A3A" },
  resetBtn: { padding: 6 },
  resetBtnText: { fontSize: 14, fontWeight: "600", color: "#7D7AF2" },

  mochiWrap: { alignItems: "center", marginVertical: 4 },
  voiceBannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7D7AF2",
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 10,
  },
  voiceBannerText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  chatScroll: { paddingHorizontal: 20, paddingBottom: 10 },
  msgBubble: { borderRadius: 18, padding: 14, marginVertical: 6, maxWidth: "85%" },
  msgUser: { backgroundColor: "#7D7AF2", alignSelf: "flex-end" },
  msgAssistant: { backgroundColor: "#fff", alignSelf: "flex-start" },
  msgTextUser: { color: "#fff", fontSize: 15, lineHeight: 21 },
  msgTextAssistant: { color: "#3A3A3A", fontSize: 15, lineHeight: 21 },
  loadingBubble: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12 },
  loadingText: { fontSize: 13, color: "#8A8A8A" },

  footer: { padding: 16, backgroundColor: "#FFF8F0" },
  inputRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#3A3A3A",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7D7AF2",
    justifyContent: "center",
    alignItems: "center",
  },
  micBtnActive: { backgroundColor: "#FF4D4D" },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7D7AF2",
    justifyContent: "center",
    alignItems: "center",
  },
  endBtn: { alignItems: "center", marginTop: 10, paddingVertical: 8 },
  endBtnText: { fontSize: 13, fontWeight: "600", color: "#FF6B8B" },

  finishedCard: { padding: 24, alignItems: "center", backgroundColor: "#fff", margin: 20, borderRadius: 20 },
  finishedTitle: { fontSize: 18, fontWeight: "700", color: "#3A3A3A", marginBottom: 6 },
  finishedSub: { fontSize: 13, color: "#8A8A8A", textAlign: "center", marginBottom: 16 },

  // Voice Modal
  voiceModalContainer: { flex: 1, backgroundColor: "rgba(20, 18, 38, 0.96)" },
  voiceModalScroll: { alignItems: "center", padding: 24, paddingBottom: 40 },
  closeVoiceBtn: { alignSelf: "flex-end", padding: 12 },
  voiceModalMochi: { marginTop: 20 },
  voiceStatusTitle: { color: "#fff", fontSize: 18, fontWeight: "700", textAlign: "center", marginVertical: 10 },
  transcriptCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 18, padding: 18, width: "100%", marginVertical: 10 },
  transcriptText: { color: "#fff", fontSize: 15, textAlign: "center", lineHeight: 22 },
  voiceControlsRow: { flexDirection: "row", gap: 20, marginBottom: 30 },
  voiceMicBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#7D7AF2", justifyContent: "center", alignItems: "center" },
  voiceStopBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#FF4D4D", justifyContent: "center", alignItems: "center" },
});
