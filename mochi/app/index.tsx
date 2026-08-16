import { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMochiStore } from "../store/mochiStore";
import MochiBody from "../components/MochiBody";
import BottomNav from "../components/BottomNav";
import { API_BASE_URL } from "../lib/api";

import HomeHeader from "../components/home/HomeHeader";
import HomeLastCheckInCard from "../components/home/HomeLastCheckInCard";
import HomeMirrorCard from "../components/home/HomeMirrorCard";
import HomeModesGrid from "../components/home/HomeModesGrid";
import HomeMochidleTile from "../components/home/HomeMochidleTile";
import HomeMemeCard, { MemeData } from "../components/home/HomeMemeCard";

export default function Home() {
  const router = useRouter();
  const {
    userName,
    mood,
    hydrated,
    baseColor,
    history,
    computeIdleMood,
  } = useMochiStore();

  const [meme, setMeme] = useState<MemeData | null>(null);
  const [loadingMeme, setLoadingMeme] = useState(false);

  const displayMood = hydrated ? mood || computeIdleMood() : "neutral";
  const lastCheckIn = useMemo(() => {
    return [...history].reverse().find((item) => item.mode === "mirror" || !item.mode) || null;
  }, [history]);

  const fetchMeme = async () => {
    setLoadingMeme(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/meme`);
      if (res.ok) {
        const data = await res.json();
        setMeme(data);
      }
    } catch (e) {
      console.warn("Meme fetch error:", e);
    } finally {
      setLoadingMeme(false);
    }
  };

  useEffect(() => {
    fetchMeme();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Banner */}
        <HomeHeader
          userName={userName || "friend"}
          onNotificationsPress={() => router.push("/notifications" as any)}
        />

        {/* Mochi Avatar Character */}
        <View style={styles.mochiWrap}>
          <MochiBody mood={displayMood} baseColor={baseColor} size={210} />
        </View>

        {/* Your Last Check-In */}
        <HomeLastCheckInCard lastCheckIn={lastCheckIn} />

        {/* Mirror Mode Callout */}
        <HomeMirrorCard onPress={() => router.push("/mirror" as any)} />

        {/* Modes Grid (Rehearse & Beside You) */}
        <HomeModesGrid
          onRehearsePress={() => router.push("/rehearsal" as any)}
          onBesidePress={() => router.push("/beside" as any)}
        />

        {/* Mochidle Game Banner */}
        <HomeMochidleTile
          baseColor={baseColor}
          onPress={() => router.push("/mochidle" as any)}
        />

        {/* Mochi's Meme of the Day */}
        <HomeMemeCard meme={meme} loadingMeme={loadingMeme} />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { padding: 20, paddingBottom: 30, alignItems: "center" },
  mochiWrap: { marginVertical: 12, alignItems: "center" },
});
