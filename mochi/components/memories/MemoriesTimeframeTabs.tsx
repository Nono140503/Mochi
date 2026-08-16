import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export type TimeFrame = "today" | "week" | "month" | "all";

interface MemoriesTimeframeTabsProps {
  timeframe: TimeFrame;
  setTimeframe: (tf: TimeFrame) => void;
}

export default function MemoriesTimeframeTabs({
  timeframe,
  setTimeframe,
}: MemoriesTimeframeTabsProps) {
  const tabs: { id: TimeFrame; label: string; icon: keyof typeof FontAwesome.glyphMap }[] = [
    { id: "today", label: "Today", icon: "sun-o" },
    { id: "week", label: "Week", icon: "calendar" },
    { id: "month", label: "Month", icon: "calendar-check-o" },
    { id: "all", label: "All", icon: "history" },
  ];

  return (
    <View style={styles.tabsRow}>
      {tabs.map((item) => {
        const isActive = timeframe === item.id;
        return (
          <Pressable
            key={item.id}
            style={[styles.tabChip, isActive && styles.tabChipActive]}
            onPress={() => setTimeframe(item.id)}
          >
            <View style={styles.tabChipInner}>
              <FontAwesome
                name={item.icon}
                size={12}
                color={isActive ? "#fff" : "#7D7AF2"}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                {item.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: { flexDirection: "row", gap: 6, marginBottom: 16 },
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
  tabChipText: { fontSize: 12, fontWeight: "600", color: "#6A6A6A" },
  tabChipTextActive: { color: "#fff", fontWeight: "700" },
});
