import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface BesideHeaderProps {
  active: boolean;
  onBack: () => void;
}

export default function BesideHeader({ active, onBack }: BesideHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        style={[styles.backBtn, active && { opacity: 0.3 }]}
        disabled={active}
      >
        <FontAwesome name={active ? "lock" : "arrow-left"} size={18} color="#3A3A3A" />
      </Pressable>
      <Text style={styles.headerTitle}>Beside You Focus</Text>
      <View style={{ width: 36 }} />
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
    fontFamily: Platform.OS === "ios" ? "BubblegumSans_400Regular" : "sans-serif-medium",
    fontSize: 22,
    color: "#3A3A3A",
  },
});
