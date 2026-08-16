import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMochiStore } from "../store/mochiStore";
import { SpecialOutfit } from "../components/MochiBody";

import MochidleHeader from "../components/mochidle/MochidleHeader";
import MochidleGrid, { WORD_LENGTH, MAX_ATTEMPTS, evaluateGuess } from "../components/mochidle/MochidleGrid";
import MochidleKeyboard from "../components/mochidle/MochidleKeyboard";
import MochidleRulesModal from "../components/mochidle/MochidleRulesModal";
import MochidleVictoryModal from "../components/mochidle/MochidleVictoryModal";

const WELLNESS_WORDS = [
  "PEACE",
  "SMILE",
  "SLEEP",
  "BLOOM",
  "SHINE",
  "GRACE",
  "LAUGH",
  "VIGOR",
  "FOCUS",
  "VITAL",
  "ALIVE",
  "HEART",
  "FAITH",
  "PAUSE",
  "LIGHT",
  "SWEET",
  "RELAX",
  "HAPPY",
  "QUIET",
  "DREAM",
  "GLOWS",
  "MINDS",
  "CALMS",
  "HOPE",
];

function getRandomWordIndex(currentIndex?: number): number {
  let nextIdx = Math.floor(Math.random() * WELLNESS_WORDS.length);
  if (currentIndex !== undefined && WELLNESS_WORDS.length > 1) {
    while (nextIdx === currentIndex) {
      nextIdx = Math.floor(Math.random() * WELLNESS_WORDS.length);
    }
  }
  return nextIdx;
}

export default function Mochidle() {
  const router = useRouter();
  const baseColor = useMochiStore((s) => s.baseColor);
  const unlockSpecialMochi = useMochiStore((s) => s.unlockSpecialMochi);

  const [wordIndex, setWordIndex] = useState(() => getRandomWordIndex());
  const targetWord = WELLNESS_WORDS[wordIndex];

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<"in_progress" | "won" | "lost">("in_progress");

  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [unlockedPrize, setUnlockedPrize] = useState<SpecialOutfit | null>(null);

  const handleKeyPress = (key: string) => {
    if (gameStatus !== "in_progress") return;

    if (key === "DELETE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "ENTER") {
      if (currentGuess.length !== WORD_LENGTH) return;
      submitGuess();
      return;
    }

    if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const submitGuess = () => {
    const nextGuesses = [...guesses, currentGuess];
    setGuesses(nextGuesses);

    if (currentGuess === targetWord) {
      setGameStatus("won");
      const guessesUsed = nextGuesses.length;

      // Prize Condition: Solve in 3 or fewer guesses!
      if (guessesUsed <= 3) {
        const prizeOptions: SpecialOutfit[] = ["chef", "doctor", "sensei", "artist", "astronaut"];
        const prize = prizeOptions[Math.floor(Math.random() * prizeOptions.length)];
        setUnlockedPrize(prize);
        unlockSpecialMochi(prize, targetWord, guessesUsed);
      } else {
        setUnlockedPrize(null);
      }

      setShowVictoryModal(true);
    } else if (nextGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus("lost");
      setUnlockedPrize(null);
      setShowVictoryModal(true);
    }

    setCurrentGuess("");
  };

  const startNextWord = () => {
    const nextIdx = getRandomWordIndex(wordIndex);
    setWordIndex(nextIdx);
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("in_progress");
    setUnlockedPrize(null);
    setShowVictoryModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <MochidleHeader
        onBack={() => router.back()}
        onOpenRules={() => setShowRulesModal(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MochidleGrid
          guesses={guesses}
          currentGuess={currentGuess}
          targetWord={targetWord}
        />

        <MochidleKeyboard
          guesses={guesses}
          targetWord={targetWord}
          onKeyPress={handleKeyPress}
        />
      </ScrollView>

      <MochidleRulesModal
        visible={showRulesModal}
        baseColor={baseColor}
        onClose={() => setShowRulesModal(false)}
      />

      <MochidleVictoryModal
        visible={showVictoryModal}
        gameStatus={gameStatus}
        targetWord={targetWord}
        guessesCount={guesses.length}
        unlockedPrize={unlockedPrize}
        baseColor={baseColor}
        onViewCollection={() => {
          setShowVictoryModal(false);
          router.push("/streaks" as any);
        }}
        onNextWord={startNextWord}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20, alignItems: "center" },
});
