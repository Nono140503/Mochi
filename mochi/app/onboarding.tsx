import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMochiStore, MochiMood } from "../store/mochiStore";
import MochiBody from "../components/MochiBody";

const { width } = Dimensions.get("window");

type Slide = {
  id: number;
  mode: string;
  title: string;
  description: string;
  mochiMood: MochiMood;
  badgeColor: string;
};

const SLIDES: Slide[] = [
  {
    id: 1,
    mode: "MIRROR MODE",
    title: "Feel Without Judgement",
    description:
      "Share how you're feeling freely. Mochi listens and reflects back with gentle, non-generic insights while adapting its color and posture.",
    mochiMood: "glowing",
    badgeColor: "#B79CFF",
  },
  {
    id: 2,
    mode: "REHEARSAL MODE",
    title: "Practice Hard Conversations",
    description:
      "Rehearse difficult discussions in a safe, realistic roleplay space. Build confidence before having the conversation in real life.",
    mochiMood: "curled",
    badgeColor: "#FFC2D1",
  },
  {
    id: 3,
    mode: "BESIDE YOU MODE",
    title: "Focus & Stay Present",
    description:
      "Sit alongside Mochi during work or study sessions. Enjoy gentle voice narration and earn presence streak rewards as Mochi glows brighter.",
    mochiMood: "blooming",
    badgeColor: "#B8E6D5",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const completeOnboarding = useMochiStore((s) => s.completeOnboarding);
  const baseColor = useMochiStore((s) => s.baseColor);

  const currentSlide = SLIDES[currentIndex];

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await completeOnboarding();
      router.replace("/login" as any);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/login" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            {currentIndex + 1} of {SLIDES.length}
          </Text>
        </View>
        <Pressable onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Main Slide Content */}
      <View style={styles.slideContent}>
        <View style={styles.mochiWrap}>
          <MochiBody
            mood={currentSlide.mochiMood}
            baseColor={baseColor}
            size={240}
          />
        </View>

        <Text style={[styles.modeTag, { color: currentSlide.badgeColor }]}>
          {currentSlide.mode}
        </Text>
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.description}>{currentSlide.description}</Text>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Pressable style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentIndex === SLIDES.length - 1 ? "Get Started ✨" : "Next →"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  stepBadge: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  stepBadgeText: { fontSize: 12, fontWeight: "700", color: "#8A8A8A" },
  skipBtn: { paddingVertical: 6, paddingHorizontal: 12 },
  skipText: { fontSize: 14, fontWeight: "600", color: "#8A8A8A" },

  slideContent: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: "auto",
    marginBottom: "auto",
  },
  mochiWrap: { marginBottom: 24 },
  modeTag: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 30,
    color: "#3A3A3A",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#6A6A6A",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 20,
    alignItems: "center",
  },
  dotsRow: { flexDirection: "row", gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0D7F5",
  },
  dotActive: {
    width: 24,
    backgroundColor: "#B79CFF",
  },
  nextBtn: {
    width: "100%",
    backgroundColor: "#B79CFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  nextBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
