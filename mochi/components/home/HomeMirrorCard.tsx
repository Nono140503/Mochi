import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface HomeMirrorCardProps {
  onPress: () => void;
}

export default function HomeMirrorCard({ onPress }: HomeMirrorCardProps) {
  return (
    <Pressable style={styles.mirrorCard} onPress={onPress}>
      <View style={styles.mirrorContentRow}>
        <Image
          source={require("../../assets/images/hand-mirror.png")}
          style={styles.mirrorIconImage}
          resizeMode="contain"
        />
        <View style={styles.mirrorColumn}>
          <Text style={styles.mirrorTitle}>MIRROR</Text>
          <Text style={styles.mirrorSub}>Tell Mochi how you feel</Text>
        </View>
      </View>
      <View style={styles.arrowCircle}>
        <FontAwesome name="chevron-right" size={14} color="#fff" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mirrorCard: {
    backgroundColor: "#FDF0F5",
    borderRadius: 24,
    padding: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FAD0E0",
  },
  mirrorContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  mirrorIconImage: {
    width: 44,
    height: 44,
  },
  mirrorColumn: {
    justifyContent: "center",
  },
  mirrorTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 22,
    color: "#3A3A3A",
    letterSpacing: 0.5,
  },
  mirrorSub: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7D7AF2",
    marginTop: 2,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7D7AF2",
    alignItems: "center",
    justifyContent: "center",
  },
});
