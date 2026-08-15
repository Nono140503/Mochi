import { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import MochiBody from "../components/MochiBody";
import { sendToMochi, ChatMessage } from "../lib/api";
import { useMochiStore, MochiMood } from "../store/mochiStore";

export default function Rehearsal() {
  const router = useRouter();
  const baseColor = useMochiStore((s) => s.baseColor);
  const currentMood = useMochiStore((s) => s.mood);
  const [setupDone, setSetupDone] = useState(false);
  const [personaDescription, setPersonaDescription] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [mochiMood, setMochiMood] = useState<MochiMood>("curled");

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
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Mochi had a moment. Tap send or try restarting rehearsal." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendToMochi("rehearsal", next);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Couldn't send that turn. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndRehearsal = () => {
    setLoading(false);
    setFinished(true);
    // Mochi visibly returns from roleplay posture ('curled') back to default ('glowing' -> 'neutral')
    setMochiMood("glowing");
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
      <View style={styles.setupContainer}>
        <MochiBody mood="curled" baseColor={baseColor} size={170} />
        <Text style={styles.setupTitle}>Rehearsal Mode</Text>
        <Text style={styles.setupLabel}>
          Who do you need to practice talking to, and what's the situation?
        </Text>
        <TextInput
          style={styles.setupInput}
          placeholder="e.g. My roommate, about splitting rent unfairly. She gets defensive fast."
          placeholderTextColor="#B0A9C7"
          value={personaDescription}
          onChangeText={setPersonaDescription}
          multiline
        />
        <Pressable style={styles.startBtn} onPress={startRehearsal}>
          <Text style={styles.startBtnText}>Start rehearsal</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header bar showing Mochi avatar, roleplay persona, and End Session button */}
      <View style={styles.chatHeader}>
        <View style={styles.mochiHeaderWrap}>
          <MochiBody mood={mochiMood} baseColor={baseColor} size={70} />
        </View>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Roleplaying Persona</Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {personaDescription}
          </Text>
        </View>
        {!finished && (
          <Pressable style={styles.endBtn} onPress={handleEndRehearsal}>
            <Text style={styles.endBtnText}>End</Text>
          </Pressable>
        )}
      </View>

      {finished ? (
        <View style={styles.debriefContainer}>
          <Text style={styles.debriefTitle}>Rehearsal Complete ✨</Text>
          <Text style={styles.debriefText}>
            Mochi returned to its calm self. You did great stepping into that conversation!
          </Text>
          <View style={styles.debriefActions}>
            <Pressable style={styles.actionBtnSecondary} onPress={handleReset}>
              <Text style={styles.actionBtnSecondaryText}>Practice another</Text>
            </Pressable>
            <Pressable style={styles.actionBtnPrimary} onPress={() => router.push("/" as any)}>
              <Text style={styles.actionBtnPrimaryText}>Return Home</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: 16 }}>
            {messages
              .filter((m) => !m.content.startsWith("[SETUP"))
              .map((m, i) => (
                <View
                  key={i}
                  style={[
                    styles.bubble,
                    m.role === "user" ? styles.userBubble : styles.mochiBubble,
                  ]}
                >
                  <Text style={m.role === "user" ? styles.userText : styles.mochiText}>
                    {m.content}
                  </Text>
                </View>
              ))}
            {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Your response..."
              placeholderTextColor="#B0A9C7"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={send}
            />
            <Pressable
              style={[styles.sendBtn, loading && { opacity: 0.5 }]}
              onPress={send}
              disabled={loading}
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  setupContainer: { flex: 1, alignItems: "center", padding: 24, paddingTop: 30, gap: 14 },
  setupTitle: { fontSize: 22, fontWeight: "700", color: "#3A3A3A" },
  setupLabel: { fontSize: 15, textAlign: "center", color: "#6A6A6A", lineHeight: 20 },
  setupInput: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    minHeight: 100,
    fontSize: 15,
    color: "#2A2A2A",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  startBtn: {
    backgroundColor: "#B79CFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  startBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFF5EA",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  mochiHeaderWrap: { marginRight: 8 },
  headerTitleWrap: { flex: 1 },
  headerTitle: { fontSize: 14, fontWeight: "700", color: "#3A3A3A" },
  headerSub: { fontSize: 12, color: "#8A8A8A" },
  endBtn: {
    backgroundColor: "#FFC2D1",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  endBtnText: { color: "#6A2A3A", fontWeight: "600", fontSize: 13 },

  chatScroll: { flex: 1 },
  bubble: { borderRadius: 16, padding: 12, marginBottom: 10, maxWidth: "80%" },
  userBubble: { backgroundColor: "#B79CFF", alignSelf: "flex-end" },
  mochiBubble: { backgroundColor: "#fff", alignSelf: "flex-start" },
  userText: { color: "#fff", fontSize: 15, lineHeight: 20 },
  mochiText: { color: "#2A2A2A", fontSize: 15, lineHeight: 20 },

  debriefContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    gap: 16,
  },
  debriefTitle: { fontSize: 22, fontWeight: "700", color: "#3A3A3A" },
  debriefText: {
    fontSize: 15,
    color: "#6A6A6A",
    textAlign: "center",
    lineHeight: 22,
  },
  debriefActions: { flexDirection: "row", gap: 12, marginTop: 12 },
  actionBtnSecondary: {
    backgroundColor: "#EAE5F8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  actionBtnSecondaryText: { color: "#5A4A8A", fontWeight: "600" },
  actionBtnPrimary: {
    backgroundColor: "#B79CFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  actionBtnPrimaryText: { color: "#fff", fontWeight: "600" },

  inputRow: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "#FFF8F0",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.04)",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2A2A2A",
  },
  sendBtn: {
    backgroundColor: "#B79CFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  sendText: { color: "#fff", fontWeight: "600" },
});
