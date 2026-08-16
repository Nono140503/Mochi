import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import MochiBody from "../components/MochiBody";
import { useMochiStore } from "../store/mochiStore";

const NARRATION_INTERVAL_MS = 45_000; // Narration every 45s

const DURATION_OPTIONS = [
  { label: "5 Min", minutes: 5, sub: "Mini Sprint ⚡" },
  { label: "15 Min", minutes: 15, sub: "Quick Sprint" },
  { label: "25 Min", minutes: 25, sub: "Pomodoro" },
  { label: "45 Min", minutes: 45, sub: "Deep Work" },
  { label: "60 Min", minutes: 60, sub: "Power Hour" },
];

// Genuine High-Quality Lofi Playlist (Local MP3 Assets)
const LOFI_PLAYLIST = [
  {
    title: "Cozy Study Lofi ☕",
    source: require("../assets/audio/lofi1.mp3"),
  },
  {
    title: "Midnight Rain Beats 🌧️",
    source: require("../assets/audio/lofi4.mp3"),
  },
  {
    title: "Chilly Coffee Shop 🍩",
    source: require("../assets/audio/lofi5.mp3"),
  },
];

const WELLNESS_RESEARCH_TIPS = [
  "Did you know? Taking a 2-minute stretch break after focusing increases oxygen flow to your brain and boosts energy by up to 25%! 🧠✨",
  "Mochi's Research: Hydrating with a glass of water after deep work improves focus retention and prevents brain fatigue! 💧",
  "Did you know? Completing even a short 5 to 25 minute focus session releases dopamine, training your brain to start tasks easier next time! 🎯🎉",
  "Mochi's Research: Looking at something 20 feet away for 20 seconds (the 20-20-20 rule) resets your eye muscles after screen time! 👁️✨",
  "Did you know? Taking 3 deep belly breaths lowers cortisol levels instantly, transitioning your mind from work mode to peaceful rest! 🌿🧘",
  "Mochi's Research: Body-doubling (working alongside a companion like Mochi) activates accountability centers in the brain, making hard tasks feel 40% easier! 🤝💜",
];

export default function BesideYou() {
  const router = useRouter();
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [playLofi, setPlayLofi] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(LOFI_PLAYLIST[0]);
  const [completedWellnessTip, setCompletedWellnessTip] = useState("");

  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [line, setLine] = useState("Ready when you are! Let me open my laptop.");
  const [isPaused, setIsPaused] = useState(false);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const narrateRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lofiSoundRef = useRef<Audio.Sound | null>(null);

  const bumpStreak = useMochiStore((s) => s.bumpStreak);
  const setMood = useMochiStore((s) => s.setMood);
  const baseColor = useMochiStore((s) => s.baseColor);

  const totalSessionSeconds = selectedMinutes * 60;
  const glowLevel = 1 - secondsLeft / totalSessionSeconds;
  const mood = glowLevel > 0.66 ? "glowing" : glowLevel > 0.33 ? "blooming" : "neutral";

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  // Control Lofi Background Music with Local Asset Playback & Non-Repeating Shuffle
  const startLofiMusic = async (forceShuffle = false) => {
    if (!playLofi) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      if (lofiSoundRef.current) {
        const soundToUnload = lofiSoundRef.current;
        lofiSoundRef.current = null;
        await soundToUnload.stopAsync().catch(() => {});
        await soundToUnload.unloadAsync().catch(() => {});
      }

      let nextTrack = LOFI_PLAYLIST[Math.floor(Math.random() * LOFI_PLAYLIST.length)];
      if (forceShuffle && LOFI_PLAYLIST.length > 1) {
        while (nextTrack.title === currentTrack.title) {
          nextTrack = LOFI_PLAYLIST[Math.floor(Math.random() * LOFI_PLAYLIST.length)];
        }
      }
      setCurrentTrack(nextTrack);

      const { sound } = await Audio.Sound.createAsync(
        nextTrack.source,
        { shouldPlay: true, isLooping: true, volume: 0.35 }
      );
      lofiSoundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.warn("Lofi music playback error:", e);
    }
  };

  const stopLofiMusic = async () => {
    if (lofiSoundRef.current) {
      try {
        await lofiSoundRef.current.stopAsync();
        await lofiSoundRef.current.unloadAsync();
      } catch (e) {
        console.warn("Error unloading Lofi music:", e);
      }
      lofiSoundRef.current = null;
    }
  };

  const startSession = () => {
    const totalSecs = selectedMinutes * 60;
    setSecondsLeft(totalSecs);
    setActive(true);
    setIsPaused(false);
    setLine("Mochi is quietly typing beside you on their laptop...");

    startLofiMusic();

    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          stopSession(true);
          setShowCompletedModal(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const togglePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      if (playLofi && lofiSoundRef.current) {
        lofiSoundRef.current.playAsync().catch(() => {});
      }
      tickRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            stopSession(true);
            setShowCompletedModal(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      // Pause
      setIsPaused(true);
      if (tickRef.current) clearInterval(tickRef.current);
      if (lofiSoundRef.current) {
        lofiSoundRef.current.pauseAsync().catch(() => {});
      }
    }
  };

  const handleFinishEarlyClick = () => {
    if (!isPaused) togglePause();
    setShowConfirmModal(true);
  };

  const handleKeepGoing = () => {
    setShowConfirmModal(false);
    if (isPaused) togglePause();
  };

  const handleConfirmEndEarly = () => {
    setShowConfirmModal(false);
    stopSession(false);
  };

  const playVictorySound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/audio/victory.mp3"),
        { shouldPlay: true, volume: 0.85 }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch (e) {
      console.warn("Victory sound error:", e);
    }
  };

  const stopSession = (completed = false) => {
    setActive(false);
    setIsPaused(false);
    if (tickRef.current) clearInterval(tickRef.current);
    if (narrateRef.current) clearInterval(narrateRef.current);
    stopLofiMusic();

    if (completed) {
      bumpStreak();
      setMood("glowing", `Completed ${selectedMinutes}-minute Beside focus session`, "beside");
      const randomTip = WELLNESS_RESEARCH_TIPS[Math.floor(Math.random() * WELLNESS_RESEARCH_TIPS.length)];
      setCompletedWellnessTip(randomTip);
      setLine("That's time! Incredible work — we locked in and finished together! 🔥🎉");
      playVictorySound();
    } else {
      setLine("Taking a break? I'll keep my laptop ready whenever you're set.");
    }
  };

  const resetSession = () => {
    stopSession(false);
    setSecondsLeft(selectedMinutes * 60);
    setLine("Ready when you are! Let me open my laptop.");
  };

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (narrateRef.current) clearInterval(narrateRef.current);
      stopLofiMusic();
    };
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.headerTitle}>Beside You Focus</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!active ? (
          // SETUP SCREEN
          <View style={styles.setupCard}>
            {/* Encouraging ADHD / Focus Banner */}
            <View style={styles.bannerBox}>
              <Text style={styles.bannerTitle}>Got things to do? Let's lock in and do it! Time to focus! 🚀</Text>
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
            <Pressable style={styles.startBtn} onPress={startSession}>
              <FontAwesome name="play" size={16} color="#fff" />
              <Text style={styles.startBtnText}>Start Focus Session ({selectedMinutes}m)</Text>
            </Pressable>
          </View>
        ) : (
          // ACTIVE FOCUS SESSION SCREEN
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

            <Text style={styles.timerDisplay}>{mm}:{ss}</Text>

            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>{line}</Text>
            </View>

            {playLofi && (
              <Pressable style={styles.lofiActiveBadge} onPress={() => startLofiMusic(true)}>
                <FontAwesome name="music" size={12} color="#7D7AF2" />
                <Text style={styles.lofiActiveText}>Playing: {currentTrack.title}</Text>
                <FontAwesome name="random" size={12} color="#7D7AF2" style={{ marginLeft: 4 }} />
              </Pressable>
            )}

            <View style={styles.activeBtnRow}>
              <Pressable style={[styles.controlBtn, styles.pauseBtn]} onPress={togglePause}>
                <FontAwesome name={isPaused ? "play" : "pause"} size={16} color="#fff" />
                <Text style={styles.controlBtnText}>{isPaused ? "Resume" : "Pause"}</Text>
              </Pressable>

              <Pressable style={[styles.controlBtn, styles.stopBtn]} onPress={handleFinishEarlyClick}>
                <FontAwesome name="stop" size={16} color="#fff" />
                <Text style={styles.controlBtnText}>Finish Early</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal when tapping Finish Early (Sad Mochi) */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalCard}>
            <View style={{ marginVertical: 8 }}>
              <MochiBody mood="sad" baseColor={baseColor} size={150} />
            </View>
            <Text style={styles.confirmModalTitle}>Stop session early?</Text>
            <Text style={styles.confirmModalSub}>
              Are you sure? You're doing so awesome and we've come this far! Just a little bit more and we can cross the finish line together! 💙
            </Text>

            <Pressable style={styles.keepGoingBtn} onPress={handleKeepGoing}>
              <FontAwesome name="play" size={16} color="#fff" />
              <Text style={styles.keepGoingBtnText}>Keep Going! I can do this</Text>
            </Pressable>

            <Pressable style={styles.confirmEndBtn} onPress={handleConfirmEndEarly}>
              <Text style={styles.confirmEndBtnText}>End Session Anyway</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Celebration Modal on Completion (Cheerleader Mochi with Pom Poms) */}
      <Modal visible={showCompletedModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.completedModalCard}>
            <View style={{ marginVertical: 10 }}>
              <MochiBody mood="excited" baseColor={baseColor} size={200} hasPomPoms={true} />
            </View>

            <Text style={styles.completedModalTitle}>YAY! YOU DID IT!! 🎉</Text>
            <Text style={styles.completedModalSub}>
              High five! You locked in, stayed focused, and crushed your goal! I'm so proud of you!
            </Text>

            {/* Mochi's Laptop Research Wellness Card */}
            {completedWellnessTip ? (
              <View style={styles.researchCard}>
                <View style={styles.researchCardHeader}>
                  <Text style={styles.researchCardTitle}>
                    While you focused, Mochi researched this for you:
                  </Text>
                </View>
                <Text style={styles.researchCardText}>{completedWellnessTip}</Text>
              </View>
            ) : null}

            <Pressable style={styles.celebrateBtn} onPress={() => setShowCompletedModal(false)}>
              <FontAwesome name="trophy" size={18} color="#fff" />
              <Text style={styles.celebrateBtnText}>Celebrate & Finish</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
 
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "BubblegumSans_400Regular" : "sans-serif-medium",
    fontSize: 22,
    color: "#3A3A3A",
    marginLeft: 40,
  },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Setup Card
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
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EAE5F8",
  },
  durationChipSelected: {
    backgroundColor: "#7D7AF2",
    borderColor: "#7D7AF2",
  },
  durationChipTitle: { fontSize: 16, fontWeight: "700", color: "#3A3A3A" },
  durationChipTitleSelected: { color: "#fff" },
  durationChipSub: { fontSize: 12, color: "#8A8A8A", marginTop: 2 },
  durationChipSubSelected: { color: "rgba(255,255,255,0.85)" },

  // Pro-Tip Card
  tipCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#FFF3E0",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FFE0B2",
    alignItems: "flex-start",
  },
  tipText: { flex: 1, fontSize: 13, color: "#7A4A00", lineHeight: 19 },

  // Lofi Switch
  lofiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  lofiTextWrap: { flex: 1, paddingRight: 10 },
  lofiTitle: { fontSize: 15, fontWeight: "700", color: "#3A3A3A" },
  lofiSub: { fontSize: 12, color: "#8A8A8A", marginTop: 2 },

  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#7D7AF2",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 28,
    width: "100%",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // Active Focus Screen
  activeCard: { alignItems: "center", width: "100%" },
  mochiActiveWrap: { marginVertical: 10 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EAE5F8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 14,
  },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#52C41A" },
  statusBadgeText: { fontSize: 13, fontWeight: "600", color: "#5A4A8A" },

  timerDisplay: { fontSize: 52, fontWeight: "800", color: "#3A3A3A", letterSpacing: 1 },

  speechBubble: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginVertical: 14,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  speechText: { fontSize: 15, color: "#4A4A4A", textAlign: "center", lineHeight: 22, fontWeight: "500" },

  lofiActiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0EAFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  lofiActiveText: { fontSize: 12, fontWeight: "600", color: "#7D7AF2" },

  activeBtnRow: { flexDirection: "row", gap: 14, width: "100%" },
  controlBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  pauseBtn: { backgroundColor: "#7D7AF2" },
  stopBtn: { backgroundColor: "#FF6B8B" },
  controlBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 18, 38, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  confirmModalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#3A3A3A",
    marginTop: 8,
    marginBottom: 8,
  },
  confirmModalSub: {
    fontSize: 14,
    color: "#6A6A6A",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  keepGoingBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 10,
  },
  keepGoingBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  confirmEndBtn: { paddingVertical: 10 },
  confirmEndBtnText: { color: "#FF6B8B", fontWeight: "600", fontSize: 14 },

  completedModalCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 26,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    borderWidth: 2,
    borderColor: "#E2D8FD",
  },
  completedModalTitle: {
    fontFamily: Platform.OS === "ios" ? "BubblegumSans_400Regular" : "sans-serif-medium",
    fontSize: 24,
    fontWeight: "800",
    color: "#4A3A8A",
    marginVertical: 10,
    textAlign: "center",
  },
  completedModalSub: {
    fontSize: 14,
    color: "#6A6A6A",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 16,
  },

  // Research Card inside Victory Modal
  researchCard: {
    backgroundColor: "#F0EAFF",
    borderRadius: 16,
    padding: 14,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2D8FD",
  },
  researchCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  researchCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5A4A8A",
  },
  researchCardText: {
    fontSize: 13,
    color: "#4A3A7A",
    lineHeight: 19,
  },

  celebrateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#52C41A",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    shadowColor: "#52C41A",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  celebrateBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
