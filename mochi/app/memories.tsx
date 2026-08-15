import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMochiStore } from "../store/mochiStore";
import BottomNav from "../components/BottomNav";

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😄",
  loved: "🥰",
  content: "🌸",
  calm: "😌",
  sad: "💙",
  deeply_sad: "😭",
  anxious: "😰",
  overwhelmed: "😵‍💫",
  angry: "😡",
  annoyed: "😤",
  lonely: "😔",
  tired: "😴",
  burnt_out: "🫠",
  scared: "😨",
  numb: "🤍",
  hopeful: "🌱",
  excited: "✨",
  grateful: "🥹",
  proud: "🌷",
  at_peace: "🧘",
};

export default function Memories() {
  const history = useMochiStore((s) => s.history);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>💭 Memories & History</Text>
        <Text style={styles.sub}>Every feeling you've shared with Mochi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {history.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>☁️</Text>
            <Text style={styles.emptyTitle}>No memories yet</Text>
            <Text style={styles.emptySub}>
              Share how you feel in Mirror Mode to start building your emotional journal!
            </Text>
          </View>
        ) : (
          history
            .slice()
            .reverse()
            .map((entry, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.moodBadge}>
                    {MOOD_EMOJIS[entry.mood] || "🌸"} [[mood:{entry.mood}]]
                  </Text>
                  <Text style={styles.dateText}>
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                {entry.note ? (
                  <Text style={styles.noteText}>"{entry.note}"</Text>
                ) : null}
              </View>
            ))
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  title: { fontFamily: "BubblegumSans_400Regular", fontSize: 26, color: "#3A3A3A" },
  sub: { fontSize: 13, color: "#8A8A8A", marginTop: 2 },
  scrollContent: { padding: 20, gap: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  moodBadge: { fontSize: 14, fontWeight: "700", color: "#7D7AF2" },
  dateText: { fontSize: 12, color: "#A0A0A0" },
  noteText: { fontSize: 15, color: "#2A2A2A", fontStyle: "italic", marginBottom: 8 },
  reflectionBox: {
    backgroundColor: "#F8F5FF",
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  reflectionTitle: { fontSize: 12, fontWeight: "700", color: "#7D7AF2", marginBottom: 2 },
  reflectionText: { fontSize: 13, color: "#4A4A4A", lineHeight: 18 },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    marginTop: 40,
  },
  emptyEmoji: { fontSize: 44, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#3A3A3A" },
  emptySub: { fontSize: 13, color: "#8A8A8A", textAlign: "center", marginTop: 6, lineHeight: 18 },
});
