import { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import MochiBody from "../components/MochiBody";
import BottomNav from "../components/BottomNav";
import { useMochiStore, HistoryItem, MochiMood } from "../store/mochiStore";

type TimeFrame = "today" | "week" | "month" | "all";

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  loved: "💖",
  content: "😌",
  calm: "🌿",
  sad: "💙",
  deeply_sad: "🌧️",
  anxious: "😰",
  overwhelmed: "😵‍💫",
  angry: "😡",
  annoyed: "😤",
  lonely: "😞",
  tired: "😴",
  burnt_out: "🍂",
  scared: "😦",
  numb: "😶",
  hopeful: "🤩",
  excited: "😝",
  grateful: "🥹",
  proud: "🏆",
  at_peace: "🧘",
  wilting: "🥀",
  glowing: "✨",
  curled: "💤",
  blooming: "🌸",
  neutral: "😐",
};

export default function Memories() {
  const history = useMochiStore((s) => s.history);
  const streak = useMochiStore((s) => s.streak);
  const baseColor = useMochiStore((s) => s.baseColor);
  const userName = useMochiStore((s) => s.userName) || "Friend";

  const [timeframe, setTimeframe] = useState<TimeFrame>("week");
  const [selectedMode, setSelectedMode] = useState<"all" | "mirror" | "beside" | "rehearsal">("all");

  // Sample data fallback if user has no entries yet, sorted newest first
  const displayHistory: HistoryItem[] = useMemo(() => {
    const list: HistoryItem[] = history && history.length > 0 ? history : [
      {
        id: "m1",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        mood: "content" as MochiMood,
        note: "Completed 25-minute Beside focus session",
        mode: "beside",
      },
      {
        id: "m2",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        mood: "sad" as MochiMood,
        note: "i am sad - Mochi felt blue with you",
        mode: "mirror",
      },
      {
        id: "m3",
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        mood: "hopeful" as MochiMood,
        note: "Rehearsed tough conversation about rent boundaries.",
        mode: "rehearsal",
      },
    ];
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [history]);

  // Filter history by selected timeframe and mode
  const filteredHistory = useMemo(() => {
    const now = new Date();
    return displayHistory.filter((item) => {
      const itemDate = new Date(item.date);
      const diffMs = now.getTime() - itemDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      let matchesTime = true;
      if (timeframe === "today") matchesTime = diffDays <= 1;
      else if (timeframe === "week") matchesTime = diffDays <= 7;
      else if (timeframe === "month") matchesTime = diffDays <= 30;

      let matchesMode = true;
      if (selectedMode !== "all") {
        matchesMode = item.mode === selectedMode || (!item.mode && selectedMode === "mirror");
      }

      return matchesTime && matchesMode;
    });
  }, [displayHistory, timeframe, selectedMode]);

  // Count moods & calculate top emotion
  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredHistory.forEach((item) => {
      counts[item.mood] = (counts[item.mood] || 0) + 1;
    });
    return counts;
  }, [filteredHistory]);

  const topMood = useMemo(() => {
    let top = "content";
    let max = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > max) {
        max = count;
        top = mood;
      }
    });
    return top as MochiMood;
  }, [moodCounts]);

  // Dynamic AI Recommendation based on top emotion over timeframe
  const recommendation = useMemo(() => {
    if (["overwhelmed", "anxious", "scared", "burnt_out"].includes(topMood)) {
      return {
        title: "Mochi's Calm & Reset Recommendation 🌿",
        text: `Hey ${userName}, Mochi noticed you've been feeling a bit ${topMood.replace("_", " ")} recently. Recommendation: Schedule 15-minute Beside You focus sessions with Lofi tunes, turn on Do Not Disturb, and take a 5-minute stretch break between tasks!`,
      };
    }
    if (["sad", "deeply_sad", "lonely", "numb", "tired"].includes(topMood)) {
      return {
        title: "Mochi's Gentle Comfort Recommendation 💙",
        text: `Hey ${userName}, you've been carrying heavy emotions lately. Mochi recommends quick daily Mirror voice check-ins to let your feelings out safely without any judgment.`,
      };
    }
    return {
      title: "Mochi's Energy & Growth Recommendation ✨",
      text: `Hey ${userName}, your emotional energy is feeling grounded and ${topMood}! Recommendation: Rehearse upcoming difficult conversations in Rehearsal Mode to keep building your communication confidence!`,
    };
  }, [topMood, userName]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header with FontAwesome Brain Icon */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <FontAwesome5 name="brain" size={22} color="#3A3A3A" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Memories & Insights</Text>
        </View>
        <Text style={styles.sub}>Every feeling, focus session, and milestone shared with Mochi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Summary Card with Mochi */}
        <View style={styles.topCard}>
          <View style={styles.topCardRow}>
            <View style={{ marginRight: 12 }}>
              <MochiBody mood={topMood} baseColor={baseColor} size={80} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.topCardTitle}>Mochi's Memory Journal</Text>
              <Text style={styles.topCardSub}>
                Tracking your emotional growth and focus history over time.
              </Text>
            </View>
          </View>
        </View>

        {/* Timeframe Selector Tabs with FontAwesome Colored Icons */}
        <View style={styles.tabsRow}>
          {(["today", "week", "month", "all"] as TimeFrame[]).map((tab) => {
            const isActive = timeframe === tab;
            const config: Record<
              TimeFrame,
              { label: string; icon: string; color: string }
            > = {
              today: { label: "Today", icon: "sun-o", color: "#FFA000" },
              week: { label: "Week", icon: "calendar", color: "#7D7AF2" },
              month: { label: "Month", icon: "calendar-check-o", color: "#FF6B8B" },
              all: { label: "All", icon: "book", color: "#4A90E2" },
            };
            const item = config[tab];

            return (
              <Pressable
                key={tab}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setTimeframe(tab)}
              >
                <View style={styles.tabChipInner}>
                  <FontAwesome
                    name={item.icon as any}
                    size={13}
                    color={isActive ? "#fff" : item.color}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                    {item.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

       

        {/* AI Recommendations Card */}
        <View style={styles.recomCard}>
          <View style={styles.recomHeader}>
            <FontAwesome name="lightbulb-o" size={16} color="#7D7AF2" />
            <Text style={styles.recomTitle}>{recommendation.title}</Text>
          </View>
          <Text style={styles.recomText}>{recommendation.text}</Text>
        </View>

        {/* Stats Row with Custom Icons */}
        <View style={styles.statsRow}>
          {/* Memories Logged with Purple Brain Icon */}
          <View style={styles.statBox}>
            <View style={styles.statValRow}>
              <FontAwesome5 name="brain" size={16} color="#7D7AF2" style={{ marginRight: 6 }} />
              <Text style={styles.statNumber}>{filteredHistory.length}</Text>
            </View>
            <Text style={styles.statLabel}>Memories Logged</Text>
          </View>

          {/* Streak with Fire PNG Asset */}
          <View style={styles.statBox}>
            <View style={styles.statValRow}>
              <Text style={styles.statNumber}>{streak}</Text>
              <Image
                source={require("../assets/images/fire.png")}
                style={styles.flameStatIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          {/* Top Mood with Smile Icon */}
          <View style={styles.statBox}>
            <View style={styles.statValRow}>
              <Text style={styles.statNumber}>{MOOD_EMOJIS[topMood] || "🌸"}</Text>
            </View>
            <Text style={styles.statLabel}>Top Mood</Text>
          </View>
        </View>

        {/* Memory History Timeline Feed */}
        <Text style={styles.sectionHeader}>Memory Feed</Text>
         {/* Mode Filter Selector Chips */}
        <View style={styles.modeFilterRow}>
          {[
            { id: "all", label: "All Feed" },
            { id: "mirror", label: "Mirror" },
            { id: "beside", label: "Beside You" },
            { id: "rehearsal", label: "Rehearsal" },
          ].map((m) => {
            const isActive = selectedMode === m.id;
            return (
              <Pressable
                key={m.id}
                style={[styles.modeFilterChip, isActive && styles.modeFilterChipActive]}
                onPress={() => setSelectedMode(m.id as any)}
              >
                <Text style={[styles.modeFilterText, isActive && styles.modeFilterTextActive]}>
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filteredHistory.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No memories logged for this period!</Text>
            <Text style={styles.emptySub}>
              Share how you feel in Mirror Mode or complete a Beside focus session to add to your timeline!
            </Text>
          </View>
        ) : (
          filteredHistory.map((item, idx) => {
            const d = new Date(item.date);
            const dateStr = d.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const emoji = item.mode === "beside" ? "💻" : (MOOD_EMOJIS[item.mood] || "✨");
            const modeIcon =
              item.mode === "rehearsal" ? "comments" : item.mode === "beside" ? "laptop" : "heart";
            const modeLabel =
              item.mode === "rehearsal" ? "Rehearsal" : item.mode === "beside" ? "Beside You" : "Check-in";

            return (
              <View key={item.id || idx} style={styles.memoryCard}>
                <View style={styles.memoryCardHeader}>
                  <View style={styles.memoryBadge}>
                    <FontAwesome name={modeIcon} size={12} color="#7D7AF2" />
                    <Text style={styles.memoryBadgeText}>{modeLabel}</Text>
                  </View>
                  <Text style={styles.memoryDate}>{dateStr}</Text>
                </View>

                <View style={styles.memoryBodyRow}>
                  <Text style={styles.memoryEmoji}>{emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memoryMoodLabel}>
                      {item.mode === "beside" ? (
                        <Text style={{ fontWeight: "800", color: "#7D7AF2" }}>Beside You Focus Session</Text>
                      ) : item.mode === "rehearsal" ? (
                        <Text style={{ fontWeight: "800", color: "#7D7AF2" }}>Rehearsed Conversation</Text>
                      ) : (
                        <>
                          Felt <Text style={{ fontWeight: "700" }}>{item.mood.replace("_", " ")}</Text>
                        </>
                      )}
                    </Text>
                    {item.note ? <Text style={styles.memoryNote}>"{item.note}"</Text> : null}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { fontFamily: "BubblegumSans_400Regular", fontSize: 26, color: "#3A3A3A" },
  sub: { fontSize: 13, color: "#8A8A8A", marginTop: 2 },
  scrollContent: { padding: 20, paddingBottom: 100 },

  topCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  topCardRow: { flexDirection: "row", alignItems: "center" },
  topCardTitle: { fontSize: 17, fontWeight: "800", color: "#3A3A3A", marginBottom: 4 },
  topCardSub: { fontSize: 13, color: "#7A7A7A", lineHeight: 18 },

  tabsRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  tabChip: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  tabChipActive: { backgroundColor: "#7D7AF2", borderColor: "#7D7AF2" },
  tabChipInner: { flexDirection: "row", alignItems: "center" },
  tabChipText: { fontSize: 13, fontWeight: "600", color: "#6A6A6A" },
  tabChipTextActive: { color: "#fff", fontWeight: "700" },

  modeFilterRow: { flexDirection: "row", gap: 6, marginBottom: 16 },
  modeFilterChip: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  modeFilterChipActive: { backgroundColor: "#F0EAFF", borderColor: "#7D7AF2" },
  modeFilterText: { fontSize: 11, fontWeight: "600", color: "#8A8A8A" },
  modeFilterTextActive: { color: "#7D7AF2", fontWeight: "800" },

  recomCard: {
    backgroundColor: "#F0EAFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2D8FD",
  },
  recomHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  recomTitle: { fontSize: 14, fontWeight: "700", color: "#4A3A8A" },
  recomText: { fontSize: 13, color: "#5A4A9A", lineHeight: 19 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  statValRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  statNumber: { fontSize: 20, fontWeight: "800", color: "#3A3A3A" },
  flameStatIcon: { width: 20, height: 20, marginLeft: 4 },
  statLabel: { fontSize: 11, color: "#8A8A8A", fontWeight: "600", marginTop: 2 },

  sectionHeader: { fontSize: 17, fontWeight: "800", color: "#3A3A3A", marginBottom: 12 },

  emptyCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  emptyEmoji: { fontSize: 44, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#3A3A3A" },
  emptySub: { fontSize: 13, color: "#8A8A8A", textAlign: "center", marginTop: 6, lineHeight: 18 },

  memoryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  memoryCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  memoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0EAFF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  memoryBadgeText: { fontSize: 12, fontWeight: "600", color: "#7D7AF2" },
  memoryDate: { fontSize: 12, color: "#9A9A9A" },

  memoryBodyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  memoryEmoji: { fontSize: 28 },
  memoryMoodLabel: { fontSize: 14, color: "#3A3A3A" },
  memoryNote: { fontSize: 13, color: "#7A7A7A", fontStyle: "italic", marginTop: 2 },
});
