import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import MochiBody from "../components/MochiBody";
import { sendToMochi } from "../lib/api";
import { useMochiStore } from "../store/mochiStore";

const NARRATION_INTERVAL_MS = 45_000; // every 45s, keep API usage light
const SESSION_LENGTH_S = 15 * 60; // 15 minute focus session

export default function BesideYou() {
  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_LENGTH_S);
  const [line, setLine] = useState("Ready when you are.");
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const narrateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bumpStreak = useMochiStore((s) => s.bumpStreak);
  const baseColor = useMochiStore((s) => s.baseColor);

  const glowLevel = 1 - secondsLeft / SESSION_LENGTH_S; // 0 -> 1 as time passes
  const mood = glowLevel > 0.66 ? "glowing" : glowLevel > 0.33 ? "blooming" : "neutral";

  const narrate = async () => {
    try {
      const reply = await sendToMochi("beside", [
        { role: "user", content: "Keep working alongside me. Give me one line." },
      ]);
      setLine(reply);
      Speech.stop();
      Speech.speak(reply, { rate: 0.95 });
    } catch (e) {
      console.warn(e);
    }
  };

  const start = () => {
    setActive(true);
    narrate();
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          stop(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    narrateRef.current = setInterval(narrate, NARRATION_INTERVAL_MS);
  };

  const stop = (completed = false) => {
    setActive(false);
    if (tickRef.current) clearInterval(tickRef.current);
    if (narrateRef.current) clearInterval(narrateRef.current);
    Speech.stop();
    if (completed) {
      bumpStreak();
      setLine("That's time! Nice work — I stayed the whole way through. 🔥");
    } else {
      setLine("Taking a break? I'll be right here.");
    }
  };

  const reset = () => {
    stop(false);
    setSecondsLeft(SESSION_LENGTH_S);
    setLine("Ready when you are.");
  };

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (narrateRef.current) clearInterval(narrateRef.current);
      Speech.stop();
    };
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <View style={styles.container}>
      <MochiBody mood={mood} baseColor={baseColor} size={220} />
      <Text style={styles.timer}>{mm}:{ss}</Text>
      <Text style={styles.line}>{line}</Text>

      <View style={styles.btnRow}>
        <Pressable
          style={[styles.btn, active && styles.btnStop]}
          onPress={() => (active ? stop(false) : start())}
        >
          <Text style={styles.btnText}>{active ? "Pause" : "Start focus session"}</Text>
        </Pressable>
        {secondsLeft < SESSION_LENGTH_S && (
          <Pressable style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetBtnText}>Reset</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 14 },
  timer: { fontSize: 38, fontWeight: "700", color: "#3A3A3A" },
  line: { fontSize: 15, color: "#6A6A6A", textAlign: "center", minHeight: 44, paddingHorizontal: 16 },
  btnRow: { flexDirection: "row", gap: 12, marginTop: 10, alignItems: "center" },
  btn: {
    backgroundColor: "#B79CFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  btnStop: { backgroundColor: "#FFC2D1" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  resetBtn: {
    backgroundColor: "#EAE5F8",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  resetBtnText: { color: "#5A4A8A", fontWeight: "600", fontSize: 15 },
});
