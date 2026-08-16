import React from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody, { SPECIAL_MOCHI_CHARACTERS } from "../MochiBody";

interface MochidleRulesModalProps {
  visible: boolean;
  baseColor: string;
  onClose: () => void;
}

export default function MochidleRulesModal({
  visible,
  baseColor,
  onClose,
}: MochidleRulesModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Pressable style={styles.closeModalBtn} onPress={onClose}>
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

          <Pressable style={styles.playBtn} onPress={onClose}>
            <Text style={styles.playBtnText}>Let's Play!</Text>
          </Pressable>
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
  closeModalBtn: {
    alignSelf: "flex-end",
    padding: 4,
  },
  modalTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#3A3A3A",
    marginTop: -10,
  },
  modalSub: {
    fontSize: 13,
    color: "#7D7AF2",
    fontWeight: "600",
    marginBottom: 16,
  },
  paradeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3A3A3A",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  paradeScroll: {
    width: "100%",
    marginBottom: 16,
  },
  paradeCard: {
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#F0E8DD",
    width: 120,
  },
  paradeName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3A3A3A",
    marginTop: 6,
  },
  paradeTitleText: {
    fontSize: 11,
    color: "#7D7AF2",
    textAlign: "center",
    marginTop: 2,
  },
  rulesList: {
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F8FD",
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  ruleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#7D7AF2",
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 22,
  },
  ruleText: {
    fontSize: 12,
    color: "#4A4A5A",
    flex: 1,
  },
  ruleItemHighlight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FFD0D9",
  },
  ruleBadgeHighlight: {
    backgroundColor: "#FF6B8B",
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  ruleTextHighlight: {
    fontSize: 12,
    color: "#8A3A4A",
    flex: 1,
    lineHeight: 17,
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
