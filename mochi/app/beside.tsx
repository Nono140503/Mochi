import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import { useMochiStore } from "../store/mochiStore";

import BesideHeader from "../components/beside/BesideHeader";
import BesideSetupView from "../components/beside/BesideSetupView";
import BesideActiveTimer from "../components/beside/BesideActiveTimer";
import BesideConfirmModal from "../components/beside/BesideConfirmModal";
import BesideCelebrationModal from "../components/beside/BesideCelebrationModal";

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
  const saveFocusSession = useMochiStore((s) => s.saveFocusSession);
  const baseColor = useMochiStore((s) => s.baseColor);

  const totalSessionSeconds = selectedMinutes * 60;
  const glowLevel = 1 - secondsLeft / totalSessionSeconds;
  const mood = glowLevel > 0.66 ? "glowing" : glowLevel > 0.33 ? "blooming" : "neutral";

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  // Prevent back navigation while active focus session is running
  useEffect(() => {
    if (!active) return;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
    return () => backHandler.remove();
  }, [active]);

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
          if (tickRef.current) clearInterval(tickRef.current);
          setTimeout(() => {
            stopSession(true);
            setShowCompletedModal(true);
          }, 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      if (playLofi && lofiSoundRef.current) {
        lofiSoundRef.current.playAsync().catch(() => {});
      }
      tickRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            if (tickRef.current) clearInterval(tickRef.current);
            setTimeout(() => {
              stopSession(true);
              setShowCompletedModal(true);
            }, 0);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
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
      saveFocusSession(selectedMinutes, `Completed ${selectedMinutes}-minute Beside focus session`);
      const randomTip = WELLNESS_RESEARCH_TIPS[Math.floor(Math.random() * WELLNESS_RESEARCH_TIPS.length)];
      setCompletedWellnessTip(randomTip);
      setLine("That's time! Incredible work — we locked in and finished together! 🔥🎉");
      playVictorySound();
    } else {
      setLine("Taking a break? I'll keep my laptop ready whenever you're set.");
    }
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
      <BesideHeader active={active} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!active ? (
          <BesideSetupView
            baseColor={baseColor}
            selectedMinutes={selectedMinutes}
            setSelectedMinutes={setSelectedMinutes}
            playLofi={playLofi}
            setPlayLofi={setPlayLofi}
            onStartSession={startSession}
          />
        ) : (
          <BesideActiveTimer
            mood={mood}
            baseColor={baseColor}
            isPaused={isPaused}
            mm={mm}
            ss={ss}
            line={line}
            playLofi={playLofi}
            currentTrackTitle={currentTrack.title}
            onShuffleTrack={() => startLofiMusic(true)}
            onTogglePause={togglePause}
            onFinishEarly={handleFinishEarlyClick}
          />
        )}
      </ScrollView>

      <BesideConfirmModal
        visible={showConfirmModal}
        baseColor={baseColor}
        onKeepGoing={handleKeepGoing}
        onConfirmEndEarly={handleConfirmEndEarly}
      />

      <BesideCelebrationModal
        visible={showCompletedModal}
        baseColor={baseColor}
        completedWellnessTip={completedWellnessTip}
        onFinish={() => setShowCompletedModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { padding: 20, paddingBottom: 40 },
});
