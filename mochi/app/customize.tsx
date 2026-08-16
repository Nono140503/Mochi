import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMochiStore } from "../store/mochiStore";
import MochiBody from "../components/MochiBody";

type ColorOption = {
  hex: string;
  name: string;
  vibe: string;
};

const COLOR_OPTIONS: ColorOption[] = [
  { hex: "#C9B8FF", name: "Lavender", vibe: "Calm & Gentle" },
  { hex: "#FFC2D1", name: "Blush Pink", vibe: "Warm & Caring" },
  { hex: "#B8E6D5", name: "Fresh Mint", vibe: "Peaceful & Grounded" },
  { hex: "#FFE3A3", name: "Butter Yellow", vibe: "Sunny & Hopeful" },
  { hex: "#B8D8FF", name: "Sky Blue", vibe: "Serene & Clear" },
  { hex: "#FFCBA4", name: "Peach", vibe: "Cozy & Comforting" },
];

export default function CustomizeMochi() {
  const router = useRouter();
  const userName = useMochiStore((s) => s.userName);
  const baseColor = useMochiStore((s) => s.baseColor);
  const completeCustomization = useMochiStore((s) => s.completeCustomization);

  const [selectedColor, setSelectedColor] = useState(baseColor);
  const currentOption =
    COLOR_OPTIONS.find((c) => c.hex === selectedColor) || COLOR_OPTIONS[0];

  const handleFinish = async () => {
    await completeCustomization(selectedColor);
    router.replace("/" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Mochi Avatar */}
        <View style={styles.mochiWrap}>
          <MochiBody mood="neutral" baseColor={selectedColor} size={220} />
        </View>

        {/* Mochi Speech Bubble */}
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            "Hi {userName || "friend"}! I'm Mochi, your emotional companion. I
            shift and glow with how you feel... but first, what color would you
            like me to be?"
          </Text>
          <View style={styles.speechTail} />
        </View>

        {/* Selected Color Vibe Badge */}
        <View style={styles.vibeCard}>
          <Text style={styles.colorName}>{currentOption.name}</Text>
          <Text style={styles.colorVibe}>✨ {currentOption.vibe}</Text>
        </View>

        {/* Swatches Grid */}
        <View style={styles.colorGrid}>
          {COLOR_OPTIONS.map((item) => (
            <Pressable
              key={item.hex}
              onPress={() => setSelectedColor(item.hex)}
              style={[
                styles.swatchCard,
                { backgroundColor: item.hex },
                item.hex === selectedColor && styles.swatchSelected,
              ]}
            >
              {item.hex === selectedColor && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* Confirm Button */}
        <Pressable style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishBtnText}>Meet My Mochi</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: {
    alignItems: "center",
    padding: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  mochiWrap: { marginBottom: 20 },
  speechBubble: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    position: "relative",
    marginBottom: 20,
  },
  speechText: {
    fontSize: 16,
    color: "#3A3A3A",
    lineHeight: 24,
    textAlign: "center",
    fontWeight: "500",
  },
  speechTail: {
    position: "absolute",
    top: -10,
    left: "50%",
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
  },
  vibeCard: {
    alignItems: "center",
    marginBottom: 16,
  },
  colorName: { fontFamily: "BubblegumSans_400Regular", fontSize: 24, color: "#3A3A3A" },
  colorVibe: { fontSize: 13, color: "#8A8A8A", marginTop: 2, fontWeight: "500" },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginBottom: 28,
  },
  swatchCard: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: {
    borderColor: "#2A2A2A",
    transform: [{ scale: 1.15 }],
  },
  checkmark: { color: "#2A2A2A", fontWeight: "800", fontSize: 16 },
  finishBtn: {
    width: "100%",
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  finishBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
