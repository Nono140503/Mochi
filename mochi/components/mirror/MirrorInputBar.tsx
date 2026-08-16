import React from "react";
import { View, TextInput, Pressable, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface MirrorInputBarProps {
  input: string;
  setInput: (text: string) => void;
  loading: boolean;
  isRecording: boolean;
  onSend: () => void;
}

export default function MirrorInputBar({
  input,
  setInput,
  loading,
  isRecording,
  onSend,
}: MirrorInputBarProps) {
  const isSendDisabled = loading || !input.trim();

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={isRecording ? "Listening to your voice..." : "How are you, really?"}
          placeholderTextColor={isRecording ? "#7D7AF2" : "#B0A9C7"}
          value={input}
          onChangeText={setInput}
          multiline
        />

        <Pressable
          style={[styles.sendBtn, isSendDisabled && { opacity: 0.5 }]}
          onPress={onSend}
          disabled={isSendDisabled}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <FontAwesome name="paper-plane" size={16} color="#fff" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: "#EAE5F8",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#3A3A3A",
    maxHeight: 100,
    paddingTop: Platform.OS === "ios" ? 4 : 0,
    paddingBottom: Platform.OS === "ios" ? 4 : 0,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7D7AF2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
