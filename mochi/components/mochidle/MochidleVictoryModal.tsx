import React from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import MochiBody, { SPECIAL_MOCHI_CHARACTERS, SpecialOutfit } from "../MochiBody";

export const WELLNESS_MESSAGES: Record<string, string> = {
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

interface MochidleVictoryModalProps {
  visible: boolean;
  gameStatus: "in_progress" | "won" | "lost";
  targetWord: string;
  guessesCount: number;
  unlockedPrize: SpecialOutfit | null;
  baseColor: string;
  onViewCollection: () => void;
  onNextWord: () => void;
}

export default function MochidleVictoryModal({
  visible,
  gameStatus,
  targetWord,
  guessesCount,
  unlockedPrize,
  baseColor,
  onViewCollection,
  onNextWord,
}: MochidleVictoryModalProps) {
  const prizeCharacter = SPECIAL_MOCHI_CHARACTERS.find((c) => c.id === unlockedPrize);

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {gameStatus === "won" ? (
            <>
              <Text style={styles.victoryEmoji}>🎉</Text>
              <Text style={styles.modalTitle}>Wellness Champion!</Text>
              <Text style={styles.modalSub}>
                You solved "{targetWord}" in {guessesCount} {guessesCount === 1 ? "guess" : "guesses"}!
              </Text>

              {/* Cute Mochi Encouragement Message */}
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
                  <Text style={styles.prizeName}>{prizeCharacter?.name}</Text>
                  <Text style={styles.prizeDesc}>{prizeCharacter?.description}</Text>
                  <Text style={styles.prizeTag}>Saved to your Streaks Collection!</Text>
                </View>
              ) : (
                <Text style={styles.noPrizeText}>
                  Great job! Solve in 3 or fewer guesses next time to unlock a Special Mochi Character prize! 🌟
                </Text>
              )}

              <View style={styles.actionRow}>
                <Pressable style={styles.streaksNavBtn} onPress={onViewCollection}>
                  <Text style={styles.streaksNavBtnText}>View Collection</Text>
                </Pressable>
                <Pressable style={styles.nextWordBtn} onPress={onNextWord}>
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
              <Pressable style={styles.playBtn} onPress={onNextWord}>
                <Text style={styles.playBtnText}>Try Another Word 🔁</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  victoryEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  modalTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 26,
    color: "#3A3A3A",
  },
  modalSub: {
    fontSize: 14,
    color: "#6A6A7A",
    textAlign: "center",
    marginBottom: 16,
  },
  cuteMessageCard: {
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 14,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0E8DD",
    alignItems: "center",
  },
  cuteMessageHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7D7AF2",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cuteMessageText: {
    fontSize: 13,
    color: "#4A4A5A",
    textAlign: "center",
    lineHeight: 19,
    fontStyle: "italic",
  },
  prizeCard: {
    backgroundColor: "#F0EAFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#7D7AF2",
  },
  prizeHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#7D7AF2",
    letterSpacing: 1,
    marginBottom: 8,
  },
  prizeName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3A3A3A",
    marginTop: 6,
  },
  prizeDesc: {
    fontSize: 12,
    color: "#6A6A7A",
    textAlign: "center",
    marginTop: 2,
    lineHeight: 16,
  },
  prizeTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6BCE92",
    marginTop: 8,
  },
  noPrizeText: {
    fontSize: 13,
    color: "#7A7A8A",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  streaksNavBtn: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0E8DD",
  },
  streaksNavBtnText: {
    color: "#7D7AF2",
    fontWeight: "700",
    fontSize: 14,
  },
  nextWordBtn: {
    flex: 1,
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  nextWordBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  playBtn: {
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
  },
  playBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
