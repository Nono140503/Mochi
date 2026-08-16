import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../MochiBody";
import { MochiMood } from "../../store/mochiStore";

interface BesideActiveTimerProps {
  mood: MochiMood;
  baseColor: string;
  isPaused: boolean;
  mm: string;
  ss: string;
  line: string;
  playLofi: boolean;
  currentTrackTitle: string;
  onShuffleTrack: () => void;
  onTogglePause: () => void;
  onFinishEarly: () => void;
}

export default function BesideActiveTimer({
  mood,
  baseColor,
  isPaused,
  mm,
  ss,
  line,
  playLofi,
  currentTrackTitle,
  onShuffleTrack,
  onTogglePause,
  onFinishEarly,
}: BesideActiveTimerProps) {
  return (
    <View style={styles.activeCard}>
      <View style={styles.mochiActiveWrap}>
        <MochiBody mood={mood} baseColor={baseColor} size={230} hasLaptop={true} />
      </View>

      <View style={styles.statusBadge}>
        <View style={styles.pulseDot} />
        <Text style={styles.statusBadgeText}>
          {isPaused ? "Session Paused ⏸️" : "Mochi is locked in & typing on laptop... 💻"}
        </Text>
      </View>

      <Text style={styles.timerDisplay}>
        {mm}:{ss}
      </Text>

      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>{line}</Text>
      </View>

      {playLofi && (
        <Pressable style={styles.lofiActiveBadge} onPress={onShuffleTrack}>
          <FontAwesome name="music" size={12} color="#7D7AF2" />
          <Text style={styles.lofiActiveText}>Playing: {currentTrackTitle}</Text>
          <FontAwesome name="random" size={12} color="#7D7AF2" style={{ marginLeft: 4 }} />
        </Pressable>
      )}

      <View style={styles.activeBtnRow}>
        <Pressable style={[styles.controlBtn, styles.pauseBtn]} onPress={onTogglePause}>
          <FontAwesome name={isPaused ? "play" : "pause"} size={16} color="#fff" />
          <Text style={styles.controlBtnText}>{isPaused ? "Resume" : "Pause"}</Text>
        </Pressable>

        <Pressable style={[styles.controlBtn, styles.stopBtn]} onPress={onFinishEarly}>
          <FontAwesome name="stop" size={16} color="#fff" />
          <Text style={styles.controlBtnText}>Finish Early</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeCard: { alignItems: "center" },
  mochiActiveWrap: { marginVertical: 10, alignItems: "center" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EAFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
    marginVertical: 10,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7D7AF2",
  },
  statusBadgeText: { fontSize: 13, fontWeight: "600", color: "#7D7AF2" },

  timerDisplay: {
    fontFamily: Platform.OS === "ios" ? "BubblegumSans_400Regular" : "sans-serif-medium",
    fontSize: 64,
    color: "#3A3A3A",
    marginVertical: 8,
  },

  speechBubble: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#EAE5F8",
    marginVertical: 10,
    maxWidth: "90%",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  speechText: {
    fontSize: 15,
    color: "#4A4A5A",
    textAlign: "center",
    lineHeight: 21,
    fontWeight: "500",
  },

  lofiActiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EAE5F8",
    gap: 6,
    marginTop: 6,
  },
  lofiActiveText: { fontSize: 12, fontWeight: "600", color: "#7D7AF2" },

  activeBtnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  controlBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 18,
    gap: 8,
  },
  pauseBtn: { backgroundColor: "#7D7AF2" },
  stopBtn: { backgroundColor: "#FF6B8B" },
  controlBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
