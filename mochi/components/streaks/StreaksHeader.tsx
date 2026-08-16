import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function StreaksHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerTitleRow}>
        <Image
          source={require("../../assets/images/fire.png")}
          style={styles.headerFlameIcon}
          resizeMode="contain"
        />
        <Text style={styles.title}>Focus Streaks & Badges</Text>
      </View>
      <Text style={styles.sub}>Keep checking in with Mochi every day</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  headerTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerFlameIcon: { width: 28, height: 28 },
  title: { fontFamily: "BubblegumSans_400Regular", fontSize: 24, color: "#3A3A3A" },
  sub: { fontSize: 13, color: "#8A8A8A", marginTop: 2 },
});
