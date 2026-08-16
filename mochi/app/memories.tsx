import { useState, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { useMochiStore, HistoryItem, MochiMood } from "../store/mochiStore";

import MemoriesHeader from "../components/memories/MemoriesHeader";
import MemoriesTopCard from "../components/memories/MemoriesTopCard";
import MemoriesTimeframeTabs, { TimeFrame } from "../components/memories/MemoriesTimeframeTabs";
import MemoriesAiRecommendation from "../components/memories/MemoriesAiRecommendation";
import MemoriesStatsRow from "../components/memories/MemoriesStatsRow";
import MemoriesTimelineFeed, { MOOD_EMOJIS, ModeFilter } from "../components/memories/MemoriesTimelineFeed";

export default function Memories() {
  const history = useMochiStore((s) => s.history);
  const streak = useMochiStore((s) => s.streak);
  const baseColor = useMochiStore((s) => s.baseColor);
  const userName = useMochiStore((s) => s.userName) || "Friend";

  const [timeframe, setTimeframe] = useState<TimeFrame>("week");
  const [selectedMode, setSelectedMode] = useState<ModeFilter>("all");

  // Sample data fallback if user has no entries yet, sorted newest first
  const displayHistory: HistoryItem[] = useMemo(() => {
    const list: HistoryItem[] = history && history.length > 0 ? history : [
      {
        id: "m1",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        mood: "content" as MochiMood,
        note: "Completed 25-minute Beside focus session",
        mode: "beside",
      },
      {
        id: "m2",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        mood: "sad" as MochiMood,
        note: "i am sad - Mochi felt blue with you",
        mode: "mirror",
      },
      {
        id: "m3",
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        mood: "hopeful" as MochiMood,
        note: "Rehearsed tough conversation about rent boundaries.",
        mode: "rehearsal",
      },
    ];
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [history]);

  // Filter history by selected timeframe and mode
  const filteredHistory = useMemo(() => {
    const now = new Date();
    return displayHistory.filter((item) => {
      const itemDate = new Date(item.date);
      const diffMs = now.getTime() - itemDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      let matchesTime = true;
      if (timeframe === "today") matchesTime = diffDays <= 1;
      else if (timeframe === "week") matchesTime = diffDays <= 7;
      else if (timeframe === "month") matchesTime = diffDays <= 30;

      let matchesMode = true;
      if (selectedMode !== "all") {
        matchesMode = item.mode === selectedMode || (!item.mode && selectedMode === "mirror");
      }

      return matchesTime && matchesMode;
    });
  }, [displayHistory, timeframe, selectedMode]);

  // Calculate top mood
  const topMood: MochiMood = useMemo(() => {
    if (filteredHistory.length === 0) return "neutral";
    const counts: Record<string, number> = {};
    filteredHistory.forEach((h) => {
      counts[h.mood] = (counts[h.mood] || 0) + 1;
    });
    let top = "neutral";
    let max = 0;
    Object.entries(counts).forEach(([m, count]) => {
      if (count > max) {
        max = count;
        top = m;
      }
    });
    return top as MochiMood;
  }, [filteredHistory]);

  // Dynamic AI Recommendation based on top emotion over timeframe
  const recommendation = useMemo(() => {
    if (["overwhelmed", "anxious", "scared", "burnt_out"].includes(topMood)) {
      return {
        title: "Mochi's Calm & Reset Recommendation 🌿",
        text: `Hey ${userName}, Mochi noticed you've been feeling a bit ${topMood.replace("_", " ")} recently. Recommendation: Schedule 15-minute Beside You focus sessions with Lofi tunes, turn on Do Not Disturb, and take a 5-minute stretch break between tasks!`,
      };
    }
    if (["sad", "deeply_sad", "lonely", "numb", "tired"].includes(topMood)) {
      return {
        title: "Mochi's Gentle Comfort Recommendation 💙",
        text: `Hey ${userName}, you've been carrying heavy emotions lately. Mochi recommends quick daily Mirror voice check-ins to let your feelings out safely without any judgment.`,
      };
    }
    return {
      title: "Mochi's Energy & Growth Recommendation ✨",
      text: `Hey ${userName}, your emotional energy is feeling grounded and ${topMood}! Recommendation: Rehearse upcoming difficult conversations in Rehearsal Mode to keep building your communication confidence!`,
    };
  }, [topMood, userName]);

  const topMoodEmoji = MOOD_EMOJIS[topMood] || "🌸";

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <MemoriesHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MemoriesTopCard userName={userName} topMood={topMood} baseColor={baseColor} />

        <MemoriesTimeframeTabs timeframe={timeframe} setTimeframe={setTimeframe} />

        <MemoriesAiRecommendation title={recommendation.title} text={recommendation.text} />

        <MemoriesStatsRow
          memoriesCount={filteredHistory.length}
          streak={streak}
          topMoodEmoji={topMoodEmoji}
        />

        <MemoriesTimelineFeed
          filteredHistory={filteredHistory}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
        />
      </ScrollView>

      <BottomNav/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
});
