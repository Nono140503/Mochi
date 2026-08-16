import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HistoryItem } from "../../store/mochiStore";

interface MirrorHistoryListProps {
  history: HistoryItem[];
}

export default function MirrorHistoryList({ history }: MirrorHistoryListProps) {
  if (!history || history.length === 0) return null;

  const recentItems = history.slice(-3).reverse();

  return (
    <View style={styles.historySection}>
      <Text style={styles.historyTitle}>Recent Check-ins</Text>
      {recentItems.map((item, idx) => (
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
  );
}

const styles = StyleSheet.create({
  historySection: {
    marginTop: 10,
    marginBottom: 20,
  },
  historyTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 20,
    color: "#3A3A3A",
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0E8DD",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  historyMood: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7D7AF2",
  },
  historyDate: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  historyNote: {
    fontSize: 14,
    color: "#5A5A5A",
    lineHeight: 20,
  },
});
