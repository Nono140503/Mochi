import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MochiBody from "../MochiBody";

export const PASTEL_PRESETS = [
  { name: "Lavender", hex: "#C9B8FF" },
  { name: "Blush Pink", hex: "#FFC2D1" },
  { name: "Soft Mint", hex: "#B8E6D5" },
  { name: "Butter Yellow", hex: "#FFE3A3" },
  { name: "Sky Blue", hex: "#B8D8FF" },
  { name: "Peach", hex: "#FFCBA4" },
];

interface SettingsColorCustomizerCardProps {
  baseColor: string;
  setBaseColor: (hex: string) => void;
}

export default function SettingsColorCustomizerCard({
  baseColor,
  setBaseColor,
}: SettingsColorCustomizerCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Mochi's Default Color</Text>
      <Text style={styles.sectionSub}>
        Choose Mochi's baseline color. When neutral, Mochi will rest in this shade!
      </Text>

      <View style={styles.mochiPreview}>
        <MochiBody mood="neutral" baseColor={baseColor} size={140} />
      </View>

      <View style={styles.swatchGrid}>
        {PASTEL_PRESETS.map((preset) => (
          <Pressable
            key={preset.hex}
            style={[
              styles.swatchItem,
              preset.hex === baseColor && styles.swatchSelected,
            ]}
            onPress={() => setBaseColor(preset.hex)}
          >
            <View
              style={[styles.colorCircle, { backgroundColor: preset.hex }]}
            />
            <Text style={styles.swatchName}>{preset.name}</Text>
          </Pressable>
        ))}
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
  sectionSub: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 14,
  },
  mochiPreview: { alignItems: "center", marginVertical: 10 },
  swatchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 10,
  },
  swatchItem: {
    width: "30%",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: {
    borderColor: "#7D7AF2",
    backgroundColor: "#F2EEFF",
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 6,
  },
  swatchName: { fontSize: 12, fontWeight: "600", color: "#3A3A3A" },
});
