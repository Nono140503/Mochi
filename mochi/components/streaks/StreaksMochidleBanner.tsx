import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface StreaksMochidleBannerProps {
  onPress: () => void;
}

export default function StreaksMochidleBanner({ onPress }: StreaksMochidleBannerProps) {
  return (
    <Pressable style={styles.mochidleBanner} onPress={onPress}>
      <View style={styles.mochidleBannerContent}>
        <Text style={styles.mochidleBannerTitle}>Play Daily Mochidle</Text>
        <Text style={styles.mochidleBannerSub}>
          Guess wellness words & win Special Mochi character prizes!
        </Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mochidleBanner: {
    backgroundColor: "#7D7AF2",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  mochidleBannerContent: { flex: 1, marginRight: 10 },
  mochidleBannerTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  mochidleBannerSub: { fontSize: 12, color: "rgba(255,255,255,0.9)", marginTop: 2 },
});
