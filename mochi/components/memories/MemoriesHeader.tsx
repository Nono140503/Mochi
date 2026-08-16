import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MemoriesHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Emotional Timeline</Text>
      </View>
      <Text style={styles.sub}>Reflect on your mood journey with Mochi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { fontFamily: "BubblegumSans_400Regular", fontSize: 26, color: "#3A3A3A" },
  sub: { fontSize: 13, color: "#8A8A8A", marginTop: 2 },
});
