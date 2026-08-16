import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../MochiBody";

interface HomeMochidleTileProps {
  baseColor: string;
  onPress: () => void;
}

export default function HomeMochidleTile({
  baseColor,
  onPress,
}: HomeMochidleTileProps) {
  return (
    <Pressable style={styles.mochidleTileCard} onPress={onPress}>
      <View style={styles.mochidleTileLeft}>
        <View style={styles.mochidleTagWrap}>
          <Text style={styles.mochidleTagText}>DAILY GAME</Text>
        </View>
        <Text style={styles.mochidleTileTitle}>MOCHIDLE</Text>
        <Text style={styles.mochidleTileSub}>
          Guess the wellness word in ≤ 3 tries to win Special Mochi Prizes!
        </Text>
      </View>
      <View style={styles.mochidleTileRight}>
        <MochiBody mood="glowing" baseColor={baseColor} size={75} specialOutfit="chef" />
        <View style={styles.arrowCirclePurple}>
          <FontAwesome name="chevron-right" size={12} color="#7D7AF2" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mochidleTileCard: {
    backgroundColor: "#F5F0FF",
    borderRadius: 22,
    padding: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#DCD0FF",
  },
  mochidleTileLeft: {
    flex: 1,
    paddingRight: 10,
  },
  mochidleTagWrap: {
    backgroundColor: "#7D7AF2",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  mochidleTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  mochidleTileTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 22,
    color: "#3A3A3A",
    letterSpacing: 0.5,
  },
  mochidleTileSub: {
    fontSize: 12,
    color: "#6A6A7A",
    marginTop: 2,
    lineHeight: 17,
  },
  mochidleTileRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  arrowCirclePurple: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#DCD0FF",
  },
});
