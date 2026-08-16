import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

interface MemoriesAiRecommendationProps {
  title: string;
  text: string;
}

export default function MemoriesAiRecommendation({
  title,
  text,
}: MemoriesAiRecommendationProps) {
  return (
    <View style={styles.recomCard}>
      <View style={styles.topBadgeRow}>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI INSIGHTS</Text>
        </View>
      </View>

      <View style={styles.recomHeader}>
        <FontAwesome name="lightbulb-o" size={18} color="#7D7AF2" />
        <Text style={styles.recomTitle}>{title}</Text>
      </View>
      <Text style={styles.recomText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  recomCard: {
    backgroundColor: "#F0EAFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#DCD0FF",
  },
  topBadgeRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2D8FD",
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#7D7AF2",
    letterSpacing: 0.8,
  },
  recomHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  recomTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4A3A8A",
  },
  recomText: {
    fontSize: 13,
    color: "#5A4A9A",
    lineHeight: 19,
  },
});
