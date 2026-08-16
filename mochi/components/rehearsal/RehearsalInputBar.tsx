import React from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RehearsalInputBarProps {
  input: string;
  setInput: (text: string) => void;
  isRecording: boolean;
  onSend: () => void;
  onToggleRecording: () => void;
  onEndRehearsal: () => void;
}

export default function RehearsalInputBar({
  input,
  setInput,
  isRecording,
  onSend,
  onToggleRecording,
  onEndRehearsal,
}: RehearsalInputBarProps) {
  return (
    <View style={styles.footer}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Say what you'd say..."
          placeholderTextColor="#B0A9C7"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={onSend}
        />
        <Pressable
          style={[styles.micBtn, isRecording && styles.micBtnActive]}
          onPress={onToggleRecording}
        >
          <FontAwesome name={isRecording ? "stop" : "microphone"} size={16} color="#fff" />
        </Pressable>
        <Pressable style={styles.sendBtn} onPress={onSend}>
          <FontAwesome name="paper-plane" size={16} color="#fff" />
        </Pressable>
      </View>
      <Pressable style={styles.endBtn} onPress={onEndRehearsal}>
        <Text style={styles.endBtnText}>End Rehearsal & Reflect</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFF8F0",
    borderTopWidth: 1,
    borderTopColor: "#F0E8DD",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: "#EAE5F8",
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#3A3A3A",
    paddingVertical: 6,
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7D7AF2",
    alignItems: "center",
    justifyContent: "center",
  },
  micBtnActive: {
    backgroundColor: "#FF6B8B",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7D7AF2",
    alignItems: "center",
    justifyContent: "center",
  },
  endBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 8,
  },
  endBtnText: {
    color: "#FF6B8B",
    fontSize: 14,
    fontWeight: "700",
  },
});
