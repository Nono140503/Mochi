import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface RehearsalFinishedCardProps {
  onRestart: () => void;
}

export default function RehearsalFinishedCard({ onRestart }: RehearsalFinishedCardProps) {
  return (
    <View style={styles.finishedCard}>
      <Text style={styles.finishedTitle}>Great practice session! 🌟</Text>
      <Text style={styles.finishedSub}>
        How did that feel? Rehearsing tough conversations builds emotional confidence.
      </Text>
      <Pressable style={styles.startBtn} onPress={onRestart}>
        <Text style={styles.startBtnText}>Practice Another Conversation</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  finishedCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EAE5F8",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  finishedTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#3A3A3A",
    marginBottom: 8,
    textAlign: "center",
  },
  finishedSub: {
    fontSize: 14,
    color: "#6A6A7A",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  startBtn: {
    width: "100%",
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  startBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
