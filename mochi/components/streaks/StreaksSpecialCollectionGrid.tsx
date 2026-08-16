import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MochiBody, { SPECIAL_MOCHI_CHARACTERS, SpecialOutfit } from "../MochiBody";

interface StreaksSpecialCollectionGridProps {
  unlockedMochis: SpecialOutfit[];
  baseColor: string;
}

export default function StreaksSpecialCollectionGrid({
  unlockedMochis,
  baseColor,
}: StreaksSpecialCollectionGridProps) {
  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Special Mochi Collection 🌟</Text>
        <Text style={styles.collectionCount}>
          {unlockedMochis.length} / {SPECIAL_MOCHI_CHARACTERS.length} Unlocked
        </Text>
      </View>

      <View style={styles.collectionGrid}>
        {SPECIAL_MOCHI_CHARACTERS.map((char) => {
          const isUnlocked = unlockedMochis.includes(char.id);
          return (
            <View
              key={char.id}
              style={[
                styles.mochiCollectionCard,
                !isUnlocked && styles.mochiCollectionLocked,
              ]}
            >
              <View style={styles.mochiAvatarWrap}>
                <MochiBody
                  mood="neutral"
                  baseColor={baseColor}
                  size={110}
                  specialOutfit={char.id}
                />
              </View>
              <Text style={styles.mochiCharName}>{char.name}</Text>
              <Text style={styles.mochiCharTitle}>{char.title}</Text>
              <Text style={styles.mochiCharDesc}>{char.description}</Text>

              <View
                style={[
                  styles.unlockedTag,
                  !isUnlocked && styles.lockedTag,
                ]}
              >
                <Text style={[styles.unlockedTagText, !isUnlocked && styles.lockedTagText]}>
                  {isUnlocked ? "UNLOCKED" : "LOCKED"}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 20,
    color: "#3A3A3A",
  },
  collectionCount: { fontSize: 12, fontWeight: "700", color: "#7D7AF2" },

  collectionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  mochiCollectionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  mochiCollectionLocked: { opacity: 0.5 },
  mochiAvatarWrap: { marginBottom: 4, height: 110, justifyContent: "center", alignItems: "center" },
  mochiCharName: { fontSize: 14, fontWeight: "800", color: "#3A3A3A", textAlign: "center" },
  mochiCharTitle: { fontSize: 11, fontWeight: "600", color: "#7D7AF2", textAlign: "center", marginTop: 2 },
  mochiCharDesc: { fontSize: 10, color: "#8A8A8A", textAlign: "center", marginTop: 4, marginBottom: 8, lineHeight: 14 },
  unlockedTag: { backgroundColor: "#F3E8FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  lockedTag: { backgroundColor: "#F1F5F9" },
  unlockedTagText: { fontSize: 10, fontWeight: "800", color: "#7D7AF2" },
  lockedTagText: { color: "#64748B" },
});
