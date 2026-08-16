import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HistoryItem } from "../../store/mochiStore";

export const MOOD_EMOJIS: Record<string, string> = {
  happy: "😄",
  loved: "🥰",
  content: "🌸",
  calm: "😌",
  sad: "😢",
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

interface HomeLastCheckInCardProps {
  lastCheckIn: HistoryItem | null;
}

export default function HomeLastCheckInCard({
  lastCheckIn,
}: HomeLastCheckInCardProps) {
  if (!lastCheckIn) {
    return (
      <View style={styles.checkInCard}>
        <Text style={styles.cardHeaderTitle}>YOUR LAST CHECK-IN</Text>
        <View style={styles.checkInContent}>
          <Text style={styles.checkInEmoji}>🌸</Text>
          <View style={styles.checkInTextWrap}>
            <Text style={styles.checkInNote}>"No check-in yet today"</Text>
            <Text style={styles.checkInMoodLabel}>Tap Mirror below to talk with Mochi!</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.checkInCard}>
      <Text style={styles.cardHeaderTitle}>YOUR LAST CHECK-IN</Text>
      <View style={styles.checkInContent}>
        <Text style={styles.checkInEmoji}>
          {MOOD_EMOJIS[lastCheckIn.mood] || "🌸"}
        </Text>
        <View style={styles.checkInTextWrap}>
          <Text style={styles.checkInNote}>
            "{lastCheckIn.note || "Took a check-in moment"}"
          </Text>
          <Text style={styles.checkInMoodLabel}>
            Mochi felt <Text style={{ fontWeight: "700" }}>{lastCheckIn.mood}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkInCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAE5F8",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7A7A8A",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  checkInContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkInEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  checkInTextWrap: {
    flex: 1,
  },
  checkInNote: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3A3A3A",
    fontStyle: "italic",
    lineHeight: 19,
  },
  checkInMoodLabel: {
    fontSize: 12,
    color: "#7D7AF2",
    marginTop: 2,
  },
});
