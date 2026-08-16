import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface MochidleHeaderProps {
  onBack: () => void;
  onOpenRules: () => void;
}

export default function MochidleHeader({ onBack, onOpenRules }: MochidleHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.iconBtn}>
        <FontAwesome name="arrow-left" size={18} color="#3A3A3A" />
      </Pressable>
      <View style={styles.titleWrap}>
        <Text style={styles.headerTitle}>Mochidle</Text>
        <Text style={styles.headerSub}>Wellness Word of the Day</Text>
      </View>
      <Pressable onPress={onOpenRules} style={styles.iconBtn}>
        <FontAwesome name="question-circle" size={22} color="#7D7AF2" />
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
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EAE5F8",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  titleWrap: {
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#3A3A3A",
  },
  headerSub: {
    fontSize: 12,
    color: "#7D7AF2",
    fontWeight: "600",
    marginTop: -2,
  },
});
