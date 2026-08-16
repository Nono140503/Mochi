import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface HomeHeaderProps {
  userName: string;
  onNotificationsPress: () => void;
}

export default function HomeHeader({
  userName,
  onNotificationsPress,
}: HomeHeaderProps) {
  return (
    <View style={styles.topHeaderRow}>
      <View style={styles.greetingWrap}>
        <Text style={styles.greetingTitle}>
          Hey {userName || "friend"},
        </Text>
        <Text style={styles.greetingSub}>it's Mochi.</Text>
      </View>

      <Pressable style={styles.bellBtn} onPress={onNotificationsPress}>
        <FontAwesome name="bell" size={18} color="#3A3A3A" />
        <View style={styles.unreadBadgeDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeaderRow: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 4,
    marginBottom: 4,
  },
  greetingWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  greetingTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 26,
    color: "#3A3A3A",
    textAlign: "center",
  },
  greetingSub: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#7D7AF2",
    textAlign: "center",
    marginTop: -4,
  },
  bellBtn: {
    position: "absolute",
    right: 0,
    top: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EAE5F8",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unreadBadgeDot: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B8B",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
});
