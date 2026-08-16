import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface MirrorReflectionCardProps {
  reply: string;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

export default function MirrorReflectionCard({
  reply,
  isSpeaking,
  onToggleSpeech,
}: MirrorReflectionCardProps) {
  if (!reply) return null;

  return (
    <View style={styles.replyCard}>
      <View style={styles.replyHeader}>
        <Text style={styles.replyTitle}>Mochi's Reflection</Text>
        <Pressable style={styles.audioBtn} onPress={onToggleSpeech}>
          <FontAwesome
            name={isSpeaking ? "stop-circle" : "volume-up"}
            size={14}
            color="#7D7AF2"
          />
          <Text style={styles.audioBtnText}>
            {isSpeaking ? " Speaking..." : " Listen"}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.reply}>{reply}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  replyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#7D7AF2",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  replyTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 18,
    color: "#7D7AF2",
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2EEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  audioBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7D7AF2",
  },
  reply: {
    fontSize: 15,
    color: "#3A3A3A",
    lineHeight: 22,
  },
});
