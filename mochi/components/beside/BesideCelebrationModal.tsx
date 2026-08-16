import React from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../MochiBody";

interface BesideCelebrationModalProps {
  visible: boolean;
  baseColor: string;
  completedWellnessTip: string;
  onFinish: () => void;
}

export default function BesideCelebrationModal({
  visible,
  baseColor,
  completedWellnessTip,
  onFinish,
}: BesideCelebrationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.completedModalCard}>
          <View style={{ marginVertical: 10 }}>
            <MochiBody mood="excited" baseColor={baseColor} size={200} hasPomPoms={true} />
          </View>

          <Text style={styles.completedModalTitle}>YAY! YOU DID IT!! 🎉</Text>
          <Text style={styles.completedModalSub}>
            High five! You locked in, stayed focused, and crushed your goal! I'm so proud of you!
          </Text>

          {completedWellnessTip ? (
            <View style={styles.researchCard}>
              <View style={styles.researchCardHeader}>
                <Text style={styles.researchCardTitle}>
                  While you focused, Mochi researched this for you:
                </Text>
              </View>
              <Text style={styles.researchCardText}>{completedWellnessTip}</Text>
            </View>
          ) : null}

          <Pressable style={styles.celebrateBtn} onPress={onFinish}>
            <FontAwesome name="trophy" size={18} color="#fff" />
            <Text style={styles.celebrateBtnText}>Celebrate & Finish</Text>
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
  completedModalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  completedModalTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 26,
    color: "#7D7AF2",
    marginBottom: 8,
    textAlign: "center",
  },
  completedModalSub: {
    fontSize: 14,
    color: "#5A5A5A",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  researchCard: {
    backgroundColor: "#F2EEFF",
    borderRadius: 16,
    padding: 14,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D8CDFB",
  },
  researchCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  researchCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7D7AF2",
  },
  researchCardText: {
    fontSize: 13,
    color: "#3A3A3A",
    lineHeight: 19,
  },
  celebrateBtn: {
    flexDirection: "row",
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  celebrateBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
