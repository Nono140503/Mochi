import React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../MochiBody";
import { MochiMood } from "../../store/mochiStore";

interface MirrorVoiceModalProps {
  visible: boolean;
  mood: MochiMood;
  baseColor: string;
  voiceStatus: "idle" | "listening" | "processing" | "speaking";
  liveTranscript: string;
  isRecording: boolean;
  onClose: () => void;
  onToggleRecording: () => void;
}

export default function MirrorVoiceModal({
  visible,
  mood,
  baseColor,
  voiceStatus,
  liveTranscript,
  isRecording,
  onClose,
  onToggleRecording,
}: MirrorVoiceModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.voiceModalContainer}>
        <ScrollView
          contentContainerStyle={styles.voiceModalScroll}
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.closeVoiceModalBtn} onPress={onClose}>
            <FontAwesome name="times" size={20} color="#3A3A3A" />
          </Pressable>

          <View style={styles.voiceMochiWrap}>
            <MochiBody mood={mood} baseColor={baseColor} size={230} />
          </View>

          <Text style={styles.voiceStatusTitle}>
            {voiceStatus === "listening"
              ? "Mochi is listening..."
              : voiceStatus === "speaking"
              ? "Mochi is speaking..."
              : voiceStatus === "processing"
              ? "Thinking..."
              : "Tap Mic to Talk"}
          </Text>

          {liveTranscript ? (
            <Text style={styles.liveTranscriptText}>"{liveTranscript}"</Text>
          ) : null}

          <View style={styles.voiceControlsRow}>
            <Pressable
              style={[
                styles.voiceMicBigBtn,
                isRecording && styles.voiceMicBigBtnActive,
              ]}
              onPress={onToggleRecording}
            >
              {voiceStatus === "processing" ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <FontAwesome
                  name={isRecording ? "stop" : "microphone"}
                  size={32}
                  color="#fff"
                />
              )}
            </Pressable>
          </View>

          <Text style={styles.voiceInstructionSub}>
            {isRecording
              ? "Tap stop when finished speaking"
              : "Tap the microphone to share how you feel"}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  voiceModalContainer: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  voiceModalScroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  closeVoiceModalBtn: {
    alignSelf: "flex-end",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginTop:10,
  },
  voiceMochiWrap: {
    marginVertical: 24,
    alignItems: "center",
  },
  voiceStatusTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 26,
    color: "#3A3A3A",
    textAlign: "center",
    marginBottom: 8,
  },
  liveTranscriptText: {
    fontSize: 16,
    color: "#6A6A7A",
    fontStyle: "italic",
    textAlign: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EAE5F8",
    marginVertical: 12,
    maxWidth: "90%",
  },
  voiceControlsRow: {
    marginVertical: 24,
    alignItems: "center",
  },
  voiceMicBigBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#7D7AF2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  voiceMicBigBtnActive: {
    backgroundColor: "#FF6B8B",
    shadowColor: "#FF6B8B",
  },
  voiceInstructionSub: {
    fontSize: 14,
    color: "#7A7A8A",
    textAlign: "center",
  },
});
