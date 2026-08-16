import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";

interface HomeModesGridProps {
  onRehearsePress: () => void;
  onBesidePress: () => void;
}

export default function HomeModesGrid({
  onRehearsePress,
  onBesidePress,
}: HomeModesGridProps) {
  return (
    <View style={styles.modesGrid}>
      <Pressable
        style={[styles.gridCard, { backgroundColor: "#F0EAFF" }]}
        onPress={onRehearsePress}
      >
        <Image
          source={require("../../assets/images/talking.png")}
          style={styles.gridIconImage}
          resizeMode="contain"
        />
        <Text style={styles.gridTitle}>REHEARSE</Text>
        <Text style={styles.gridSub}>Practice hard talks</Text>
      </Pressable>

      <Pressable
        style={[styles.gridCard, { backgroundColor: "#FFF0F5" }]}
        onPress={onBesidePress}
      >
        <Image
          source={require("../../assets/images/holding-hands.png")}
          style={styles.gridIconImage}
          resizeMode="contain"
        />
        <Text style={styles.gridTitle}>BESIDE YOU</Text>
        <Text style={styles.gridSub}>Body double focus</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  modesGrid: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 14,
  },
  gridCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  gridIconImage: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  gridTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 18,
    color: "#3A3A3A",
    letterSpacing: 0.5,
  },
  gridSub: {
    fontSize: 12,
    color: "#7A7A8A",
    marginTop: 2,
    textAlign: "center",
  },
});
