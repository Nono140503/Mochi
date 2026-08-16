import React from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { ChatMessage } from "../../lib/api";

interface RehearsalMessageListProps {
  messages: ChatMessage[];
  loading: boolean;
}

export default function RehearsalMessageList({ messages, loading }: RehearsalMessageListProps) {
  return (
    <ScrollView contentContainerStyle={styles.chatScroll}>
      {messages.map((m, i) => {
        if (m.content.startsWith("[SETUP")) return null;
        const isUser = m.role === "user";
        return (
          <View
            key={i}
            style={[
              styles.msgBubble,
              isUser ? styles.msgUser : styles.msgAssistant,
            ]}
          >
            <Text style={isUser ? styles.msgTextUser : styles.msgTextAssistant}>
              {m.content}
            </Text>
          </View>
        );
      })}
      {loading && (
        <View style={styles.loadingBubble}>
          <ActivityIndicator color="#7D7AF2" />
          <Text style={styles.loadingText}>Roleplay partner is thinking...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chatScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  msgBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
  },
  msgUser: {
    alignSelf: "flex-end",
    backgroundColor: "#7D7AF2",
    borderBottomRightRadius: 4,
  },
  msgAssistant: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#EAE5F8",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  msgTextUser: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 21,
  },
  msgTextAssistant: {
    color: "#3A3A3A",
    fontSize: 15,
    lineHeight: 21,
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  loadingText: {
    fontSize: 14,
    color: "#7D7AF2",
    fontWeight: "500",
  },
});
