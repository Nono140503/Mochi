import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface StreaksHeroCardProps {
  streak: number;
}

export default function StreaksHeroCard({ streak }: StreaksHeroCardProps) {
  return (
    <View style={styles.streakHero}>
      <Image
        source={require("../../assets/images/fire.png")}
        style={styles.heroFlameIcon}
        resizeMode="contain"
      />
      <Text style={styles.heroCount}>{streak}</Text>
      <Text style={styles.heroLabel}>Session Focus Streak</Text>
      <Text style={styles.heroSub}>
        You're building a daily habit of emotional self-care with Mochi!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  streakHero: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  heroFlameIcon: { width: 64, height: 64, marginBottom: 4 },
  heroCount: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 48,
    color: "#7D7AF2",
    marginVertical: 2,
  },
  heroLabel: { fontSize: 16, fontWeight: "700", color: "#3A3A3A" },
  heroSub: { fontSize: 13, color: "#8A8A8A", textAlign: "center", marginTop: 6, lineHeight: 18 },
});
