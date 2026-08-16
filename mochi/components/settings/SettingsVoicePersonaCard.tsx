import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { speakMochiText } from "../../lib/api";

interface SettingsVoicePersonaCardProps {
  userName?: string | null;
}

export default function SettingsVoicePersonaCard({ userName }: SettingsVoicePersonaCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Mochi's Voice Persona 🎙️</Text>
      <Text style={styles.sectionSub}>
        Mochi speaks with a warm, gentle & comforting AI voice persona across all voice conversations.
      </Text>

      <View style={styles.voiceSingleBox}>
        <View style={{ flex: 1 }}>
          <Text style={styles.voiceSingleTitle}>Bella (Soft & Warm Mochi 🌸)</Text>
          <Text style={styles.voiceSingleSub}>Signature gentle & comforting companion voice</Text>
        </View>
        <Pressable
          style={styles.voiceTestBtn}
          onPress={() => speakMochiText(`Hi ${userName || "friend"}! I'm Mochi, and I'm right here with you.`)}
        >
          <FontAwesome name="volume-up" size={14} color="#fff" />
          <Text style={styles.voiceTestBtnText}>Test Voice</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 20,
    color: "#3A3A3A",
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 14,
  },
  voiceSingleBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EAFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#7D7AF2",
    justifyContent: "space-between",
    marginTop: 6,
  },
  voiceSingleTitle: { fontSize: 14, fontWeight: "800", color: "#3A3A3A" },
  voiceSingleSub: { fontSize: 12, color: "#6A6A7A", marginTop: 2 },
  voiceTestBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#7D7AF2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  voiceTestBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
