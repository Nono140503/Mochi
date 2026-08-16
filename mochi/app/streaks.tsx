import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMochiStore } from "../store/mochiStore";
import BottomNav from "../components/BottomNav";
import { SpecialOutfit } from "../components/MochiBody";

import StreaksHeader from "../components/streaks/StreaksHeader";
import StreaksHeroCard from "../components/streaks/StreaksHeroCard";
import StreaksMochidleBanner from "../components/streaks/StreaksMochidleBanner";
import StreaksSpecialCollectionGrid from "../components/streaks/StreaksSpecialCollectionGrid";
import StreaksBadgesGrid, { BadgeItem } from "../components/streaks/StreaksBadgesGrid";

export default function Streaks() {
  const router = useRouter();
  const streak = useMochiStore((s) => s.streak);
  const history = useMochiStore((s) => s.history);
  const unlockedMochis = (useMochiStore((s) => s.unlockedMochis || []) as SpecialOutfit[]);
  const baseColor = useMochiStore((s) => s.baseColor);

  const badges: BadgeItem[] = [
    {
      title: "First Step",
      desc: "Completed 1 check-in",
      unlocked: history.length >= 1,
      image: require("../assets/images/plant.png"),
    },
    {
      title: "Focus Friend",
      desc: "3 session focus streak",
      unlocked: streak >= 3,
      image: require("../assets/images/fire.png"),
    },
    {
      title: "Emotional Master",
      desc: "Completed 5 check-ins",
      unlocked: history.length >= 5,
      image: require("../assets/images/reaction.png"),
    },
    {
      title: "Zen Master",
      desc: "10 session focus streak",
      unlocked: streak >= 10,
      image: require("../assets/images/meditation.png"),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StreaksHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <StreaksHeroCard streak={streak} />

        <StreaksMochidleBanner onPress={() => router.push("/mochidle" as any)} />

        <StreaksSpecialCollectionGrid unlockedMochis={unlockedMochis} baseColor={baseColor} />

        <StreaksBadgesGrid badges={badges} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 100 },
});
