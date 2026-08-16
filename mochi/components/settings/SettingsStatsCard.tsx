import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SettingsStatsCardProps {
  streak: number;
}

export default function SettingsStatsCard({ streak }: SettingsStatsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Focus & Companion Stats</Text>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Current Focus Streak</Text>
        <Text style={styles.statValue}>{streak} 🔥</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 20,
    color: "#3A3A3A",
    marginBottom: 4,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statLabel: { fontSize: 14, color: "#5A5A5A" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#7D7AF2" },
});
