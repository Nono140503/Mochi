import React from "react";
import { View, Text, Pressable, Switch, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../MochiBody";

export const DURATION_OPTIONS = [
  { label: "5 Min", minutes: 5, sub: "Mini Sprint" },
  { label: "15 Min", minutes: 15, sub: "Quick Sprint" },
  { label: "25 Min", minutes: 25, sub: "Pomodoro" },
  { label: "45 Min", minutes: 45, sub: "Deep Work" },
  { label: "60 Min", minutes: 60, sub: "Power Hour" },
];

interface BesideSetupViewProps {
  baseColor: string;
  selectedMinutes: number;
  setSelectedMinutes: (minutes: number) => void;
  playLofi: boolean;
  setPlayLofi: (val: boolean) => void;
  onStartSession: () => void;
}

export default function BesideSetupView({
  baseColor,
  selectedMinutes,
  setSelectedMinutes,
  playLofi,
  setPlayLofi,
  onStartSession,
}: BesideSetupViewProps) {
  return (
    <View style={styles.setupCard}>
      {/* Encouraging ADHD / Focus Banner */}
      <View style={styles.bannerBox}>
        <Text style={styles.bannerTitle}>
          Got things to do? Let's lock in and do it! Time to focus! 🚀
        </Text>
        <Text style={styles.bannerSub}>
          Mochi will sit beside you and type on their laptop to help you stay accountable through body-doubling.
        </Text>
      </View>

      {/* Mochi Idle Avatar */}
      <View style={styles.mochiPreviewWrap}>
        <MochiBody mood="glowing" baseColor={baseColor} size={180} hasLaptop={true} />
      </View>

      {/* Duration Selector */}
      <Text style={styles.sectionLabel}>Recommend Focus Duration:</Text>
      <View style={styles.durationGrid}>
        {DURATION_OPTIONS.map((opt) => {
          const isSelected = selectedMinutes === opt.minutes;
          return (
            <Pressable
              key={opt.minutes}
              style={[styles.durationChip, isSelected && styles.durationChipSelected]}
              onPress={() => setSelectedMinutes(opt.minutes)}
            >
              <Text style={[styles.durationChipTitle, isSelected && styles.durationChipTitleSelected]}>
                {opt.label}
              </Text>
              <Text style={[styles.durationChipSub, isSelected && styles.durationChipSubSelected]}>
                {opt.sub}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Do Not Disturb Pro-Tip Banner */}
      <View style={styles.tipCard}>
        <FontAwesome name="lightbulb-o" size={20} color="#7D7AF2" style={{ marginTop: 2 }} />
        <Text style={styles.tipText}>
          <Text style={{ fontWeight: "700" }}>Pro Tip: </Text>
          I recommend that you turn on your <Text style={{ fontWeight: "700" }}>Do Not Disturb</Text> for the duration of our session so that we focus completely!
        </Text>
      </View>

      {/* Lofi Background Music Switch */}
      <View style={styles.lofiRow}>
        <View style={styles.lofiTextWrap}>
          <Text style={styles.lofiTitle}>Play Background Lofi Tunes 🎧</Text>
          <Text style={styles.lofiSub}>Cozy ambient beats to keep your mind locked in</Text>
        </View>
        <Switch
          value={playLofi}
          onValueChange={setPlayLofi}
          trackColor={{ false: "#EAE5F8", true: "#B79CFF" }}
          thumbColor={playLofi ? "#7D7AF2" : "#8A8A8A"}
        />
      </View>

      {/* Start Button */}
      <Pressable style={styles.startBtn} onPress={onStartSession}>
        <FontAwesome name="play" size={16} color="#fff" />
        <Text style={styles.startBtnText}>Start Focus Session ({selectedMinutes}m)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  setupCard: { alignItems: "center" },
  bannerBox: {
    backgroundColor: "#F0EAFF",
    borderRadius: 20,
    padding: 18,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2D8FD",
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4A3A8A",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 6,
  },
  bannerSub: { fontSize: 13, color: "#6A5A9A", textAlign: "center", lineHeight: 19 },
  mochiPreviewWrap: { marginVertical: 10, alignItems: "center" },
  sectionLabel: {
    alignSelf: "flex-start",
    fontSize: 15,
    fontWeight: "700",
    color: "#3A3A3A",
    marginTop: 14,
    marginBottom: 10,
  },
  durationGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, width: "100%" },
  durationChip: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EAE5F8",
  },
  durationChipSelected: {
    backgroundColor: "#F0EAFF",
    borderColor: "#7D7AF2",
  },
  durationChipTitle: { fontSize: 16, fontWeight: "700", color: "#3A3A3A" },
  durationChipTitleSelected: { color: "#7D7AF2" },
  durationChipSub: { fontSize: 11, color: "#8A8A8A", marginTop: 2 },
  durationChipSubSelected: { color: "#7D7AF2", fontWeight: "600" },

  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFF4E5",
    borderRadius: 16,
    padding: 14,
    width: "100%",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#FFE2BC",
    gap: 12,
    alignItems: "flex-start",
  },
  tipText: { flex: 1, fontSize: 13, color: "#7A5210", lineHeight: 19 },

  lofiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  lofiTextWrap: { flex: 1, paddingRight: 10 },
  lofiTitle: { fontSize: 14, fontWeight: "700", color: "#3A3A3A" },
  lofiSub: { fontSize: 12, color: "#8A8A8A", marginTop: 2 },

  startBtn: {
    flexDirection: "row",
    backgroundColor: "#7D7AF2",
    borderRadius: 20,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 17 },
});
