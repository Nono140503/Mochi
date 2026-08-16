import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MochiBody from "../MochiBody";
import { MochiMood } from "../../store/mochiStore";

interface MemoriesTopCardProps {
  userName?: string;
  topMood: MochiMood;
  baseColor: string;
}

export default function MemoriesTopCard({
  topMood,
  baseColor,
}: MemoriesTopCardProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
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
});
