import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useMochiStore } from "../store/mochiStore";
import MochiBody, { SPECIAL_MOCHI_CHARACTERS, SpecialOutfit } from "../components/MochiBody";

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

const WELLNESS_MESSAGES: Record<string, string> = {
  PEACE: "May your day be filled with gentle PEACE and quiet warmth. 🌸",
  SMILE: "Your SMILE brings so much light to Mochi's world today! 😊",
  SLEEP: "Remember to give yourself restful SLEEP and peaceful dreams tonight. 🌙",
  BLOOM: "Take your time—you are meant to BLOOM in your own beautiful way! 🌸",
  SHINE: "Keep going! You SHINE brighter than you realize. ✨",
  GRACE: "Be kind to yourself and give your heart extra GRACE today. 💖",
  LAUGH: "A little LAUGH is Mochi's favorite medicine for a heavy mind! 😄",
  VIGOR: "Feel the gentle energy of VIGOR flowing through you today. 🌿",
  FOCUS: "Protect your energy and keep your FOCUS on what truly matters to you. 🎯",
  VITAL: "Your feelings are valid and your presence is VITAL to this world. 🌟",
  ALIVE: "Take a deep breath and feel how wonderful it is to be ALIVE right now. 🌿",
  HEART: "Listen closely to your HEART today—it knows the way. 💓",
  FAITH: "Have FAITH in your strength; you have overcome so much already. 🕊️",
  PAUSE: "It's okay to PAUSE and just breathe whenever you need a moment. 🧘",
  LIGHT: "You bring so much LIGHT into the room just by being yourself! ☀️",
  SWEET: "Wishing you a day as SWEET and gentle as a warm hug! 🍯",
  RELAX: "Unclench your jaw, drop your shoulders, and RELAX with Mochi. 🍃",
  HAPPY: "Mochi is so HAPPY to spend this moment with you! 🥳",
  QUIET: "Embrace the QUIET moments today—they hold sweet peace. 🤫",
  DREAM: "Never stop allowing your heart to DREAM big and soft! 💭",
  GLOWS: "Your kind heart GLOWS with so much warmth and beauty. 🌟",
  MINDS: "Take gentle care of your MINDS and thoughts today. 🧠",
  CALMS: "Mochi CALMS your mind and holds a quiet space for you. 🧘‍♀️",
  HOPE: "Hold onto HOPE—tomorrow brings fresh new beginnings! 🌱",
};

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

function getRandomWordIndex(currentIndex?: number): number {
  let nextIdx = Math.floor(Math.random() * WELLNESS_WORDS.length);
  if (currentIndex !== undefined && WELLNESS_WORDS.length > 1) {
    while (nextIdx === currentIndex) {
      nextIdx = Math.floor(Math.random() * WELLNESS_WORDS.length);
    }
  }
  return nextIdx;
}

export function evaluateGuess(
  guess: string,
  target: string
): ("correct" | "present" | "absent")[] {
  const len = target.length;
  const result: ("correct" | "present" | "absent")[] = new Array(len);
  const targetCounts: Record<string, number> = {};

  for (let i = 0; i < len; i++) {
    const char = target[i];
    targetCounts[char] = (targetCounts[char] || 0) + 1;
  }

  // Pass 1: Mark exact matches (correct / green)
  for (let i = 0; i < len; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      targetCounts[guess[i]]--;
    }
  }

  // Pass 2: Mark remaining letters (present / yellow or absent / gray)
  for (let i = 0; i < len; i++) {
    if (!result[i]) {
      const char = guess[i];
      if (targetCounts[char] && targetCounts[char] > 0) {
        result[i] = "present";
        targetCounts[char]--;
      } else {
        result[i] = "absent";
      }
    }
  }

  return result;
}

export default function Mochidle() {
  const router = useRouter();
  const { unlockedMochis, unlockSpecialMochi, recordMochidleGame, baseColor } = useMochiStore();

  const [wordIndex, setWordIndex] = useState(() => getRandomWordIndex());
  const [targetWord, setTargetWord] = useState(WELLNESS_WORDS[wordIndex]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  
  const [showRulesModal, setShowRulesModal] = useState(true);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [unlockedPrize, setUnlockedPrize] = useState<SpecialOutfit | null>(null);

  useEffect(() => {
    setTargetWord(WELLNESS_WORDS[wordIndex]);
  }, [wordIndex]);

  const handleKeyPress = (key: string) => {
    if (gameStatus !== "playing") return;

    if (key === "DELETE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "ENTER") {
      if (currentGuess.length !== WORD_LENGTH) return;
      
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess("");

      if (currentGuess === targetWord) {
        setGameStatus("won");
        recordMochidleGame(true);

        const attemptsTaken = newGuesses.length;
        if (attemptsTaken <= 3) {
          // Find next available locked Mochi character
          const lockedAvailable = SPECIAL_MOCHI_CHARACTERS.filter(
            (c) => !(unlockedMochis || []).includes(c.id)
          );
          const prizeToAward = lockedAvailable.length > 0
            ? lockedAvailable[0].id
            : SPECIAL_MOCHI_CHARACTERS[attemptsTaken % SPECIAL_MOCHI_CHARACTERS.length].id;

          unlockSpecialMochi(prizeToAward, targetWord, attemptsTaken);
          setUnlockedPrize(prizeToAward);
        } else {
          setUnlockedPrize(null);
        }
        setShowVictoryModal(true);
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameStatus("lost");
        recordMochidleGame(false);
        setShowVictoryModal(true);
      }
      return;
    }

    if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const startNextWord = () => {
    const nextIdx = getRandomWordIndex(wordIndex);
    setWordIndex(nextIdx);
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setShowVictoryModal(false);
    setUnlockedPrize(null);
  };

  // Keyboard Status Mapping
  const getKeyStatus = (letter: string) => {
    let status: "correct" | "present" | "absent" | "unused" = "unused";
    for (const guess of guesses) {
      const evaluations = evaluateGuess(guess, targetWord);
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === letter) {
          const evalResult = evaluations[i];
          if (evalResult === "correct") {
            return "correct";
          }
          if (evalResult === "present") {
            status = "present";
          } else if (evalResult === "absent" && status !== "present") {
            status = "absent";
          }
        }
      }
    }
    return status;
  };

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <FontAwesome name="arrow-left" size={18} color="#3A3A3A" />
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.headerTitle}>Mochidle 🎮</Text>
          <Text style={styles.headerSub}>Wellness Word of the Day</Text>
        </View>
        <Pressable onPress={() => setShowRulesModal(true)} style={styles.iconBtn}>
          <FontAwesome name="question-circle" size={22} color="#7D7AF2" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Game Grid */}
        <View style={styles.gridContainer}>
          {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
            const isSubmitted = rowIndex < guesses.length;
            const isCurrentRow = rowIndex === guesses.length;
            const rowText = isSubmitted
              ? guesses[rowIndex]
              : isCurrentRow
              ? currentGuess.padEnd(WORD_LENGTH, " ")
              : "     ";

            return (
              <View key={rowIndex} style={styles.row}>
                {(() => {
                  const rowEvaluations = isSubmitted
                    ? evaluateGuess(guesses[rowIndex], targetWord)
                    : [];

                  return Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                    const letter = rowText[colIndex]?.trim() || "";
                    let tileStyle = styles.tileEmpty;
                    let textStyle = styles.tileTextEmpty;

                    if (isSubmitted) {
                      const evalStatus = rowEvaluations[colIndex];
                      if (evalStatus === "correct") {
                        tileStyle = styles.tileCorrect;
                        textStyle = styles.tileTextFilled;
                      } else if (evalStatus === "present") {
                        tileStyle = styles.tilePresent;
                        textStyle = styles.tileTextFilled;
                      } else {
                        tileStyle = styles.tileAbsent;
                        textStyle = styles.tileTextFilled;
                      }
                    } else if (letter) {
                      tileStyle = styles.tileActive;
                      textStyle = styles.tileTextActive;
                    }

                    return (
                      <View key={colIndex} style={[styles.tile, tileStyle]}>
                        <Text style={[styles.tileText, textStyle]}>{letter}</Text>
                      </View>
                    );
                  });
                })()}
              </View>
            );
          })}
        </View>

        {/* Onscreen Keyboard */}
        <View style={styles.keyboardContainer}>
          {keyboardRows.map((row, rIdx) => (
            <View key={rIdx} style={styles.keyboardRow}>
              {row.map((key) => {
                const status = getKeyStatus(key);
                let keyBgStyle = styles.keyUnused;

                if (status === "correct") keyBgStyle = styles.keyCorrect;
                else if (status === "present") keyBgStyle = styles.keyPresent;
                else if (status === "absent") keyBgStyle = styles.keyAbsent;

                const isSpecial = key === "ENTER" || key === "DELETE";

                return (
                  <Pressable
                    key={key}
                    style={[
                      styles.key,
                      isSpecial ? styles.keyWide : null,
                      keyBgStyle,
                    ]}
                    onPress={() => handleKeyPress(key)}
                  >
                    {key === "DELETE" ? (
                      <Text style={[styles.keyText, styles.keyTextSpecial]}>DEL</Text>
                    ) : (
                      <Text style={[styles.keyText, isSpecial && styles.keyTextSpecial]}>
                        {key}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* RULES & PRIZES MODAL */}
      <Modal visible={showRulesModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.closeModalBtn} onPress={() => setShowRulesModal(false)}>
              <FontAwesome name="times" size={18} color="#8A8A8A" />
            </Pressable>

            <Text style={styles.modalTitle}>Mochidle Rules & Prizes</Text>
            <Text style={styles.modalSub}>Daily Wellness Word Game</Text>

            {/* Multiple Special Mochi Parade */}
            <Text style={styles.paradeTitle}>Win Special Mochi Characters!</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paradeScroll}>
              {SPECIAL_MOCHI_CHARACTERS.map((char) => (
                <View key={char.id} style={styles.paradeCard}>
                  <MochiBody mood="neutral" baseColor={baseColor} size={90} specialOutfit={char.id} />
                  <Text style={styles.paradeName}>{char.name}</Text>
                  <Text style={styles.paradeTitleText}>{char.title}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Rules List */}
            <View style={styles.rulesList}>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleBadge}>1</Text>
                <Text style={styles.ruleText}>Guess the 5-letter wellness word in 6 tries.</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleBadge}>2</Text>
                <Text style={styles.ruleText}>Green = correct spot, Yellow = wrong spot, Gray = not in word.</Text>
              </View>
              <View style={styles.ruleItemHighlight}>
                <Text style={styles.ruleBadgeHighlight}> PRIZE</Text>
                <Text style={styles.ruleTextHighlight}>
                  Solve the word in <Text style={{ fontWeight: "800" }}>3 or fewer guesses</Text> to unlock a Special Mochi character for your Streaks collection!
                </Text>
              </View>
            </View>

            <Pressable style={styles.playBtn} onPress={() => setShowRulesModal(false)}>
              <Text style={styles.playBtnText}>Let's Play!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* VICTORY & PRIZE UNLOCK MODAL */}
      <Modal visible={showVictoryModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {gameStatus === "won" ? (
              <>
                <Text style={styles.victoryEmoji}>🎉</Text>
                <Text style={styles.modalTitle}>Wellness Champion!</Text>
                <Text style={styles.modalSub}>
                  You solved "{targetWord}" in {guesses.length} {guesses.length === 1 ? "guess" : "guesses"}!
                </Text>

                {/* Cute Mochi Encouragement Message using the Wellness Word */}
                <View style={styles.cuteMessageCard}>
                  <Text style={styles.cuteMessageHeader}>🌸 MOCHI'S WELLNESS NOTE</Text>
                  <Text style={styles.cuteMessageText}>
                    "{WELLNESS_MESSAGES[targetWord] || `Mochi sends you love and warmth with the word "${targetWord}" today! ✨`}"
                  </Text>
                </View>

                {unlockedPrize ? (
                  <View style={styles.prizeCard}>
                    <Text style={styles.prizeHeader}>SPECIAL PRIZE UNLOCKED!</Text>
                    <MochiBody mood="neutral" baseColor={baseColor} size={140} specialOutfit={unlockedPrize} />
                    <Text style={styles.prizeName}>
                      {SPECIAL_MOCHI_CHARACTERS.find((c) => c.id === unlockedPrize)?.name}
                    </Text>
                    <Text style={styles.prizeDesc}>
                      {SPECIAL_MOCHI_CHARACTERS.find((c) => c.id === unlockedPrize)?.description}
                    </Text>
                    <Text style={styles.prizeTag}>Saved to your Streaks Collection!</Text>
                  </View>
                ) : (
                  <Text style={styles.noPrizeText}>
                    Great job! Solve in 3 or fewer guesses next time to unlock a Special Mochi Character prize! 🌟
                  </Text>
                )}

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.streaksNavBtn}
                    onPress={() => {
                      setShowVictoryModal(false);
                      router.push("/streaks" as any);
                    }}
                  >
                    <Text style={styles.streaksNavBtnText}>View Collection</Text>
                  </Pressable>
                  <Pressable style={styles.nextWordBtn} onPress={startNextWord}>
                    <Text style={styles.nextWordBtnText}>Next Word</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.victoryEmoji}>🌱</Text>
                <Text style={styles.modalTitle}>Nice Effort!</Text>
                <Text style={styles.modalSub}>
                  The wellness word was <Text style={{ fontWeight: "800", color: "#7D7AF2" }}>"{targetWord}"</Text>.
                </Text>
                <Pressable style={styles.playBtn} onPress={startNextWord}>
                  <Text style={styles.playBtnText}>Try Another Word 🔁</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconBtn: { padding: 6 },
  titleWrap: { alignItems: "center" },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "BubblegumSans_400Regular" : "sans-serif-medium",
    fontSize: 22,
    color: "#3A3A3A",
  },
  headerSub: { fontSize: 12, color: "#8A8A8A" },
  scrollContent: { alignItems: "center", paddingBottom: 40 },
  gridContainer: { marginVertical: 20, gap: 6 },
  row: { flexDirection: "row", gap: 6 },
  tile: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "#fff",
  },
  tileEmpty: { borderColor: "#E2E8F0" },
  tileActive: { borderColor: "#7D7AF2" },
  tileCorrect: { backgroundColor: "#4ADE80", borderColor: "#4ADE80" },
  tilePresent: { backgroundColor: "#FACC15", borderColor: "#FACC15" },
  tileAbsent: { backgroundColor: "#94A3B8", borderColor: "#94A3B8" },

  tileText: { fontSize: 22, fontWeight: "800" },
  tileTextEmpty: { color: "#3A3A3A" },
  tileTextActive: { color: "#3A3A3A" },
  tileTextFilled: { color: "#FFFFFF" },

  keyboardContainer: { width: "100%", paddingHorizontal: 15, marginTop: 10, gap: 8 },
  keyboardRow: { flexDirection: "row", justifyContent: "center", gap: 4 },
  key: {
    height: 48,
    flex: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
  },
  keyWide: { flex: 1.5 },
  keyUnused: { backgroundColor: "#E2E8F0" },
  keyCorrect: { backgroundColor: "#4ADE80" },
  keyPresent: { backgroundColor: "#FACC15" },
  keyAbsent: { backgroundColor: "#94A3B8" },
  keyText: { fontSize: 14, fontWeight: "700", color: "#3A3A3A" },
  keyTextSpecial: { fontSize: 11, fontWeight: "800" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFF8F0",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    maxHeight: "90%",
  },
  closeModalBtn: { alignSelf: "flex-end", padding: 6 },
  modalTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#3A3A3A",
    textAlign: "center",
  },
  modalSub: { fontSize: 13, color: "#8A8A8A", textAlign: "center", marginBottom: 12 },
  paradeTitle: { fontSize: 14, fontWeight: "700", color: "#7D7AF2", marginBottom: 8 },
  paradeScroll: { flexDirection: "row", marginBottom: 16, maxHeight: 150 },
  paradeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    marginRight: 10,
    width: 140,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  paradeName: { fontSize: 12, fontWeight: "700", color: "#3A3A3A", marginTop: 4, textAlign: "center" },
  paradeTitleText: { fontSize: 10, color: "#8A8A8A", textAlign: "center" },

  rulesList: { width: "100%", gap: 8, marginBottom: 16 },
  ruleItem: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#fff", padding: 10, borderRadius: 12 },
  ruleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#7D7AF2",
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 22,
    fontSize: 12,
  },
  ruleText: { flex: 1, fontSize: 12, color: "#3A3A3A" },

  ruleItemHighlight: {
    backgroundColor: "#F3E8FF",
    borderWidth: 1.5,
    borderColor: "#7D7AF2",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  ruleBadgeHighlight: { fontSize: 12, fontWeight: "800", color: "#7D7AF2", marginBottom: 2 },
  ruleTextHighlight: { fontSize: 12, color: "#3A3A3A", textAlign: "center", lineHeight: 17 },

  playBtn: {
    width: "100%",
    backgroundColor: "#7D7AF2",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
  },
  playBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  cuteMessageCard: {
    backgroundColor: "#FFF0F5",
    borderWidth: 1.5,
    borderColor: "#FFB6C1",
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  cuteMessageHeader: {
    fontSize: 10,
    fontWeight: "900",
    color: "#D81B60",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cuteMessageText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3A3A3A",
    textAlign: "center",
    lineHeight: 19,
    fontStyle: "italic",
  },

  victoryEmoji: { fontSize: 40, marginBottom: 4 },
  prizeCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginVertical: 12,
    width: "100%",
    borderWidth: 2,
    borderColor: "#FACC15",
  },
  prizeHeader: { fontSize: 12, fontWeight: "900", color: "#D97706", marginBottom: 6 },
  prizeName: { fontSize: 16, fontWeight: "800", color: "#3A3A3A", marginTop: 4 },
  prizeDesc: { fontSize: 12, color: "#8A8A8A", textAlign: "center", marginTop: 2 },
  prizeTag: { fontSize: 11, fontWeight: "700", color: "#7D7AF2", marginTop: 8 },
  noPrizeText: { fontSize: 13, color: "#8A8A8A", textAlign: "center", marginVertical: 14, lineHeight: 18 },

  actionRow: { flexDirection: "row", gap: 10, width: "100%", marginTop: 10 },
  streaksNavBtn: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    borderWidth: 2,
    borderColor: "#7D7AF2",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  streaksNavBtnText: { color: "#7D7AF2", fontWeight: "800", fontSize: 13 },
  nextWordBtn: {
    flex: 1,
    backgroundColor: "#7D7AF2",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  nextWordBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
