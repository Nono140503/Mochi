import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface MemoriesStatsRowProps {
  memoriesCount: number;
  streak: number;
  topMoodEmoji: string;
}

export default function MemoriesStatsRow({
  memoriesCount,
  streak,
  topMoodEmoji,
}: MemoriesStatsRowProps) {
  return (
    <View style={styles.statsRow}>
      {/* Memories Logged */}
      <View style={styles.statBox}>
        <View style={styles.statValRow}>
          <FontAwesome5 name="brain" size={16} color="#7D7AF2" style={{ marginRight: 6 }} />
          <Text style={styles.statNumber}>{memoriesCount}</Text>
        </View>
        <Text style={styles.statLabel}>Memories Logged</Text>
      </View>

      {/* Streak */}
      <View style={styles.statBox}>
        <View style={styles.statValRow}>
          <Text style={styles.statNumber}>{streak}</Text>
          <Image
            source={require("../../assets/images/fire.png")}
            style={styles.flameStatIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>

      {/* Top Mood */}
      <View style={styles.statBox}>
        <View style={styles.statValRow}>
          <Text style={styles.statNumber}>{topMoodEmoji}</Text>
        </View>
        <Text style={styles.statLabel}>Top Mood</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
