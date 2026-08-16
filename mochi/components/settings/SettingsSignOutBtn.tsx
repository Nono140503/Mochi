import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface SettingsSignOutBtnProps {
  onLogout: () => void;
}

export default function SettingsSignOutBtn({ onLogout }: SettingsSignOutBtnProps) {
  return (
    <Pressable style={styles.logoutBtn} onPress={onLogout}>
      <FontAwesome name="sign-out" size={16} color="#FF6B8B" />
      <Text style={styles.logoutBtnText}>Sign Out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFF0F3",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#FFD0D9",
    marginTop: 6,
  },
  logoutBtnText: { color: "#FF6B8B", fontWeight: "700", fontSize: 15 },
});
