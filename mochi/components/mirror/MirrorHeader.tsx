import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface MirrorHeaderProps {
  onBack: () => void;
}

export default function MirrorHeader({ onBack }: MirrorHeaderProps) {
  return (
    <View style={styles.topHeader}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <FontAwesome name="arrow-left" size={18} color="#3A3A3A" />
      </Pressable>
      <Text style={styles.headerTitle}>Mirror Mode</Text>
      <View style={{ width: 36 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
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
});
