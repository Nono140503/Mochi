import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export interface BadgeItem {
  title: string;
  desc: string;
  unlocked: boolean;
  image: any;
}

interface StreaksBadgesGridProps {
  badges: BadgeItem[];
}

export default function StreaksBadgesGrid({ badges }: StreaksBadgesGridProps) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Achievement Badges</Text>
      <View style={styles.badgeGrid}>
        {badges.map((badge) => (
          <View
            key={badge.title}
            style={[
              styles.badgeCard,
              !badge.unlocked && styles.badgeLocked,
            ]}
          >
            <Image
              source={badge.image}
              style={styles.badgeImage}
              resizeMode="contain"
            />
            <Text style={styles.badgeTitle}>{badge.title}</Text>
            <Text style={styles.badgeDesc}>{badge.desc}</Text>
            <Text style={styles.badgeStatus}>
              {badge.unlocked ? "UNLOCKED ✨" : "LOCKED 🔒"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 20,
    color: "#3A3A3A",
    marginTop: 12,
    marginBottom: 12,
  },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  badgeCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  badgeLocked: { opacity: 0.5 },
  badgeImage: { width: 44, height: 44, marginBottom: 8 },
  badgeTitle: { fontSize: 14, fontWeight: "700", color: "#3A3A3A", textAlign: "center" },
  badgeDesc: { fontSize: 11, color: "#8A8A8A", textAlign: "center", marginTop: 2, marginBottom: 8 },
  badgeStatus: { fontSize: 10, fontWeight: "800", color: "#7D7AF2" },
});
