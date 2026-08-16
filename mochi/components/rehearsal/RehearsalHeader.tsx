import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RehearsalHeaderProps {
  onBack: () => void;
  onReset: () => void;
}

export default function RehearsalHeader({ onBack, onReset }: RehearsalHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <FontAwesome name="arrow-left" size={18} color="#3A3A3A" />
      </Pressable>
      <Text style={styles.headerTitle}>Rehearsal Mode</Text>
      <Pressable style={styles.resetBtn} onPress={onReset}>
        <Text style={styles.resetBtnText}>New</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#3A3A3A",
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7D7AF2",
  },
});
