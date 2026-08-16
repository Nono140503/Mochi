import React from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../MochiBody";

interface BesideConfirmModalProps {
  visible: boolean;
  baseColor: string;
  onKeepGoing: () => void;
  onConfirmEndEarly: () => void;
}

export default function BesideConfirmModal({
  visible,
  baseColor,
  onKeepGoing,
  onConfirmEndEarly,
}: BesideConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.confirmModalCard}>
          <View style={{ marginVertical: 8 }}>
            <MochiBody mood="sad" baseColor={baseColor} size={150} />
          </View>
          <Text style={styles.confirmModalTitle}>Stop session early?</Text>
          <Text style={styles.confirmModalSub}>
            Are you sure? You're doing so awesome and we've come this far! Just a little bit more and we can cross the finish line together! 💙
          </Text>

          <Pressable style={styles.keepGoingBtn} onPress={onKeepGoing}>
            <FontAwesome name="play" size={16} color="#fff" />
            <Text style={styles.keepGoingBtnText}>Keep Going! I can do this</Text>
          </Pressable>

          <Pressable style={styles.confirmEndBtn} onPress={onConfirmEndEarly}>
            <Text style={styles.confirmEndBtnText}>End Session Anyway</Text>
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
  confirmModalCard: {
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
  confirmModalTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#3A3A3A",
    marginBottom: 8,
    textAlign: "center",
  },
  confirmModalSub: {
    fontSize: 14,
    color: "#6A6A7A",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  keepGoingBtn: {
    flexDirection: "row",
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  keepGoingBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  confirmEndBtn: {
    paddingVertical: 10,
  },
  confirmEndBtnText: { color: "#FF6B8B", fontWeight: "600", fontSize: 14 },
});
