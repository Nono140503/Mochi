import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { HistoryItem } from "../../store/mochiStore";

export const MOOD_EMOJIS: Record<string, string> = {
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

export type ModeFilter = "all" | "mirror" | "beside" | "rehearsal";

interface MemoriesTimelineFeedProps {
  filteredHistory: HistoryItem[];
  selectedMode: ModeFilter;
  setSelectedMode: (mode: ModeFilter) => void;
}

export default function MemoriesTimelineFeed({
  filteredHistory,
  selectedMode,
  setSelectedMode,
}: MemoriesTimelineFeedProps) {
  const modeFilters: { id: ModeFilter; label: string }[] = [
    { id: "all", label: "All Feed" },
    { id: "mirror", label: "Mirror" },
    { id: "beside", label: "Beside You" },
    { id: "rehearsal", label: "Rehearsal" },
  ];

  return (
    <View>
      <Text style={styles.sectionHeader}>Memory Feed</Text>

      {/* Mode Filter Selector Chips */}
      <View style={styles.modeFilterRow}>
        {modeFilters.map((m) => {
          const isActive = selectedMode === m.id;
          return (
            <Pressable
              key={m.id}
              style={[styles.modeFilterChip, isActive && styles.modeFilterChipActive]}
              onPress={() => setSelectedMode(m.id)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { fontSize: 17, fontWeight: "800", color: "#3A3A3A", marginBottom: 12 },
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

  emptyCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
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
