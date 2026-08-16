import React from "react";
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../MochiBody";
import { MochiMood } from "../../store/mochiStore";

interface RehearsalVoiceModalProps {
  visible: boolean;
  mochiMood: MochiMood;
  baseColor: string;
  voiceStatus: "idle" | "listening" | "processing" | "speaking";
  liveTranscript: string;
  isRecording: boolean;
  onClose: () => void;
  onToggleRecording: () => void;
}

export default function RehearsalVoiceModal({
  visible,
  mochiMood,
  baseColor,
  voiceStatus,
  liveTranscript,
  isRecording,
  onClose,
  onToggleRecording,
}: RehearsalVoiceModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.voiceModalContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.voiceModalScroll}
            showsVerticalScrollIndicator={false}
          >
            <Pressable style={styles.closeVoiceBtn} onPress={onClose}>
              <FontAwesome name="times" size={20} color="#fff" />
            </Pressable>

            <View style={styles.voiceModalMochi}>
              <MochiBody mood={mochiMood} baseColor={baseColor} size={220} />
            </View>

            <Text style={styles.voiceStatusTitle}>
              {voiceStatus === "listening" && "Listening to you... "}
              {voiceStatus === "processing" && "Roleplay partner thinking..."}
              {voiceStatus === "speaking" && "Roleplay partner responding..."}
              {voiceStatus === "idle" && "Ready for next turn ✨"}
            </Text>

            {liveTranscript ? (
              <View style={styles.transcriptCard}>
                <Text style={styles.transcriptText}>{liveTranscript}</Text>
              </View>
            ) : null}

            <View style={styles.voiceControlsRow}>
              {isRecording ? (
                <Pressable style={styles.voiceStopBtn} onPress={onToggleRecording}>
                  <FontAwesome name="stop" size={24} color="#fff" />
                </Pressable>
              ) : (
                <Pressable style={styles.voiceMicBtn} onPress={onToggleRecording}>
                  <FontAwesome name="microphone" size={28} color="#fff" />
                </Pressable>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  voiceModalContainer: {
    flex: 1,
    backgroundColor: "rgba(30, 25, 45, 0.95)",
  },
  voiceModalScroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  closeVoiceBtn: {
    alignSelf: "flex-end",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  voiceModalMochi: {
    marginVertical: 30,
    alignItems: "center",
  },
  voiceStatusTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  transcriptCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginVertical: 12,
    maxWidth: "90%",
  },
  transcriptText: {
    fontSize: 15,
    color: "#F0E8DD",
    fontStyle: "italic",
    textAlign: "center",
  },
  voiceControlsRow: {
    marginVertical: 30,
    alignItems: "center",
  },
  voiceMicBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7D7AF2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  voiceStopBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF6B8B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B8B",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
});
