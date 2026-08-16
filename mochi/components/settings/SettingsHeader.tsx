import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SettingsHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Profile & Settings</Text>
      <Text style={styles.sub}>Customize Mochi, change voice & manage profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  title: { fontFamily: "BubblegumSans_400Regular", fontSize: 26, color: "#3A3A3A" },
  sub: { fontSize: 13, color: "#8A8A8A", marginTop: 2 },
});
