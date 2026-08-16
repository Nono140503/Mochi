import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { useMochiStore, MochiMood } from "../store/mochiStore";
import MochiBody from "../components/MochiBody";
import { sendToMochi, extractMood, transcribeAudio, synthesizeVoice, speakMochiText } from "../lib/api";

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
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Speech.Voice | null>(null);

  // ChatGPT-style Live Voice Mode Modal
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [liveTranscript, setLiveTranscript] = useState("");

  const recordingRef = useRef<Audio.Recording | null>(null);
  const { mood, baseColor, userName, setMood, history } = useMochiStore();

  useEffect(() => {
    // Select warm natural voice from device
    Speech.getAvailableVoicesAsync().then((voices) => {
      if (!voices || voices.length === 0) return;
      const enVoices = voices.filter((v) => v.language?.startsWith("en"));
      const sweetVoice =
        enVoices.find(
          (v) =>
            v.name.includes("Samantha") ||
            v.name.includes("Karen") ||
            v.name.includes("Siri") ||
            v.name.includes("Google") ||
            v.quality === "Enhanced"
        ) || enVoices[0];
      if (sweetVoice) setSelectedVoice(sweetVoice);
    });

    return () => {
      Speech.stop();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  const soundRef = useRef<Audio.Sound | null>(null);

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

  // Start Real Microphone Audio Recording with safety checks
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

  // Safe Stop Recording
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
      await setMood(nextMood, spokenText.trim());

      // Speak Mochi's reflection aloud!
      speakText(cleanReply, () => {
        // Continuous hands-free conversation in Voice Mode!
        if (voiceModeActive) {
          setTimeout(() => {
            startRecording();
          }, 800);
        }
      });
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
      await setMood(nextMood, input.trim());
    } catch (e: any) {
      setReply("Mochi couldn't quite hear that. Try again?");
      console.warn(e);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Quick Launch ChatGPT Voice Conversation Button */}
        

        <View style={styles.mochiWrap}>
          <MochiBody mood={mood} baseColor={baseColor} size={200} />
          <Text style={styles.moodLabel}>
            Mochi feels <Text style={styles.moodValue}>{mood}</Text>
          </Text>
        </View>
        <Pressable style={styles.voiceBannerBtn} onPress={openVoiceMode}>
          <FontAwesome name="microphone" size={18} color="#fff" />
          <Text style={styles.voiceBannerText}>Start Live Voice Conversation ✨</Text>
        </Pressable>

        {reply ? (
          <View style={styles.replyCard}>
            <View style={styles.replyHeader}>
              <Text style={styles.replyTitle}>Mochi's Reflection</Text>
              <Pressable
                style={styles.audioBtn}
                onPress={() => (isSpeaking ? Speech.stop() : speakText(reply))}
              >
                <FontAwesome
                  name={isSpeaking ? "stop-circle" : "volume-up"}
                  size={14}
                  color="#7D7AF2"
                />
                <Text style={styles.audioBtnText}>{isSpeaking ? " Speaking..." : " Listen"}</Text>
              </Pressable>
            </View>
            <Text style={styles.reply}>{reply}</Text>
          </View>
        ) : history.length > 0 ? (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Recent Check-ins</Text>
            {history
              .slice(-3)
              .reverse()
              .map((item, idx) => (
                <View key={idx} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyMood}>[[mood:{item.mood}]]</Text>
                    <Text style={styles.historyDate}>
                      {new Date(item.date).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                  {item.note ? <Text style={styles.historyNote}>{item.note}</Text> : null}
                </View>
              ))}
          </View>
        ) : null}
      </ScrollView>

      {/* Input Row at bottom */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={isRecording ? "Listening to your voice..." : "How are you, really?"}
            placeholderTextColor={isRecording ? "#7D7AF2" : "#B0A9C7"}
            value={input}
            onChangeText={setInput}
            multiline
          />

         

          {/* Send Share Button with FontAwesome Paper Plane */}
          <Pressable
            style={[styles.sendBtn, (loading || !input.trim()) && { opacity: 0.5 }]}
            onPress={handleShare}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <FontAwesome name="paper-plane" size={16} color="#fff" />
            )}
          </Pressable>
        </View>
      </View>

      {/* CHATGPT ADVANCED VOICE MODE MODAL */}
      <Modal visible={voiceModeActive} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.voiceModalContainer}>
          <ScrollView
            contentContainerStyle={styles.voiceModalScroll}
            showsVerticalScrollIndicator={false}
          >
            <Pressable style={styles.closeVoiceModalBtn} onPress={closeVoiceMode}>
              <FontAwesome name="times" size={20} color="#3A3A3A" />
            </Pressable>

            <View style={styles.voiceMochiWrap}>
              <MochiBody mood={mood} baseColor={baseColor} size={230} />
            </View>

            <Text style={styles.voiceStatusTitle}>
              {voiceStatus === "listening"
                ? "Mochi is listening..."
                : voiceStatus === "speaking"
                ? "Mochi is speaking..."
                : voiceStatus === "processing"
                ? "Thinking..."
                : "Tap Mic to Talk"}
            </Text>

            {liveTranscript ? (
              <Text style={styles.liveTranscriptText}>"{liveTranscript}"</Text>
            ) : null}

            {reply ? <Text style={styles.voiceReplyText}>{reply}</Text> : null}

            {/* Huge Interactive FontAwesome Mic Control */}
            <View style={styles.voiceControls}>
              <Pressable
                style={[
                  styles.hugeMicBtn,
                  isRecording && styles.hugeMicBtnActive,
                  voiceStatus === "speaking" && styles.hugeMicBtnSpeaking,
                ]}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <FontAwesome
                  name={isRecording ? "stop" : voiceStatus === "speaking" ? "volume-up" : "microphone"}
                  size={36}
                  color="#fff"
                />
              </Pressable>

              <Text style={styles.voiceHintText}>
                {isRecording ? "Tap to finish speaking" : "Tap mic to talk to Mochi"}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { alignItems: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  voiceBannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 10,
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  voiceBannerText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  mochiWrap: { alignItems: "center", marginVertical: 40 },
  moodLabel: { marginTop: 8, fontSize: 14, color: "#8A8A8A" },
  moodValue: { fontWeight: "700", color: "#3A3A3A" },
  replyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    width: "100%",
    marginTop: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  replyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  replyTitle: { fontSize: 13, fontWeight: "700", color: "#7D7AF2", textTransform: "uppercase" },
  audioBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF8F0", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, gap: 4 },
  audioBtnText: { fontSize: 12, fontWeight: "600", color: "#7D7AF2" },
  reply: {
    fontSize: 16,
    color: "#3A3A3A",
    lineHeight: 23,
  },
  historySection: { width: "100%", marginTop: 20, gap: 10 },
  historyTitle: { fontSize: 14, fontWeight: "700", color: "#8A8A8A", marginBottom: 4 },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  historyHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  historyMood: { fontSize: 13, fontWeight: "600", color: "#7D7AF2" },
  historyDate: { fontSize: 12, color: "#A0A0A0" },
  historyNote: { fontSize: 14, color: "#4A4A4A" },

  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF8F0",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 15,
    color: "#2A2A2A",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAE0FA",
  },
  micBtnActive: {
    backgroundColor: "#FF6B8B",
    borderColor: "#FF6B8B",
  },
  sendBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#7D7AF2",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  // Voice Conversation Modal Styles
  voiceModalContainer: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  voiceModalScroll: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  closeVoiceModalBtn: {
    alignSelf: "flex-end",
    padding: 12,
  },
  voiceMochiWrap: {
    marginVertical: 20,
  },
  voiceStatusTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#3A3A3A",
    textAlign: "center",
  },
  liveTranscriptText: {
    fontSize: 14,
    color: "#8A8A8A",
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  voiceReplyText: {
    fontSize: 17,
    color: "#3A3A3A",
    textAlign: "center",
    lineHeight: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  voiceControls: {
    alignItems: "center",
    gap: 12,
    marginBottom: 30,
  },
  hugeMicBtn: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#7D7AF2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  hugeMicBtnActive: {
    backgroundColor: "#FF6B8B",
    shadowColor: "#FF6B8B",
  },
  hugeMicBtnSpeaking: {
    backgroundColor: "#B8E6D5",
    shadowColor: "#B8E6D5",
  },
  voiceHintText: {
    fontSize: 14,
    color: "#8A8A8A",
    fontWeight: "500",
  },
});
