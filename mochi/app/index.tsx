import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useMochiStore } from "../store/mochiStore";
import MochiBody from "../components/MochiBody";
import BottomNav from "../components/BottomNav";
import { API_BASE_URL } from "../lib/api";

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😄",
  loved: "🥰",
  content: "🌸",
  calm: "😌",
  sad: "💙",
  deeply_sad: "😭",
  anxious: "😰",
  overwhelmed: "😵‍💫",
  angry: "😡",
  annoyed: "😤",
  lonely: "😔",
  tired: "😴",
  burnt_out: "🫠",
  scared: "😨",
  numb: "🤍",
  hopeful: "🌱",
  excited: "✨",
  grateful: "🥹",
  proud: "🌷",
  at_peace: "🧘",
};

type MemeData = {
  title: string;
  topText: string;
  bottomText: string;
  imageUrl: string;
  source: string;
};

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
  const lastEntry = history.length > 0 ? history[history.length - 1] : null;

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
        {/* Top Header Bar */}
        {/* <View style={styles.headerBar}>
          
        </View> */}

        {/* Greeting Banner */}
        <Text style={styles.greetingTitle}>
          Hey {userName || "friend"},
        </Text>
        <Text style={styles.greetingSub}>it's Mochi.</Text>

        {/* Mochi Avatar Character */}
        <View style={styles.mochiWrap}>
          <MochiBody mood={displayMood} baseColor={baseColor} size={210} />
        </View>

        {/* Card 1: Your Last Check-In */}
        {lastEntry ? (
          <View style={styles.checkInCard}>
            <Text style={styles.cardHeaderTitle}>YOUR LAST CHECK-IN</Text>
            <View style={styles.checkInContent}>
              <Text style={styles.checkInEmoji}>
                {MOOD_EMOJIS[lastEntry.mood] || "🌸"}
              </Text>
              <View style={styles.checkInTextWrap}>
                <Text style={styles.checkInNote}>
                  "{lastEntry.note || "Took a check-in moment"}"
                </Text>
                <Text style={styles.checkInMoodLabel}>
                  Mochi felt <Text style={{ fontWeight: "700" }}>{lastEntry.mood}</Text>
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.checkInCard}>
            <Text style={styles.cardHeaderTitle}>YOUR LAST CHECK-IN</Text>
            <View style={styles.checkInContent}>
              <Text style={styles.checkInEmoji}>🌸</Text>
              <View style={styles.checkInTextWrap}>
                <Text style={styles.checkInNote}>"No check-in yet today"</Text>
                <Text style={styles.checkInMoodLabel}>Tap Mirror below to talk with Mochi!</Text>
              </View>
            </View>
          </View>
        )}

        {/* Card 2: Mirror Mode (Primary Full Width Card) */}
        <Pressable
          style={styles.mirrorCard}
          onPress={() => router.push("/mirror" as any)}
        >
          <View style={styles.mirrorContentRow}>
            <Image
              source={require("../assets/images/hand-mirror.png")}
              style={styles.mirrorIconImage}
              resizeMode="contain"
            />
            <View style={styles.mirrorColumn}>
              <Text style={styles.mirrorTitle}>MIRROR</Text>
              <Text style={styles.mirrorSub}>Tell Mochi how you feel →</Text>
            </View>
          </View>
          <View style={styles.arrowCircle}>
            <FontAwesome name="chevron-right" size={14} color="#fff" />
          </View>
        </Pressable>

        {/* Secondary Modes Grid (Rehearse & Beside You) */}
        <View style={styles.modesGrid}>
          <Pressable
            style={[styles.gridCard, { backgroundColor: "#F0EAFF" }]}
            onPress={() => router.push("/rehearsal" as any)}
          >
            <Image
              source={require("../assets/images/talking.png")}
              style={styles.gridIconImage}
              resizeMode="contain"
            />
            <Text style={styles.gridTitle}>REHEARSE</Text>
            <Text style={styles.gridSub}>Practice hard talks</Text>
          </Pressable>

          <Pressable
            style={[styles.gridCard, { backgroundColor: "#FFF0F5" }]}
            onPress={() => router.push("/beside" as any)}
          >
            <Image
              source={require("../assets/images/holding-hands.png")}
              style={styles.gridIconImage}
              resizeMode="contain"
            />
            <Text style={styles.gridTitle}>BESIDE YOU</Text>
            <Text style={styles.gridSub}>Body double focus</Text>
          </Pressable>
        </View>

        {/* Card 3: Mochi's Meme of the Day (justmeme.wtf) */}
        <View style={styles.memeCard}>
          <View style={styles.memeHeader}>
            <Text style={styles.memeHeaderTitle}>MOCHI'S MEME OF THE DAY</Text>
            
          </View>

          {loadingMeme ? (
            <View style={styles.memeLoadingWrap}>
              <ActivityIndicator color="#7D7AF2" />
              <Text style={styles.memeLoadingText}>Fetching fresh meme...</Text>
            </View>
          ) : meme ? (
            <View style={styles.memeBody}>
              <Image
                source={{ uri: meme.imageUrl }}
                style={styles.memeImage}
                resizeMode="contain"
              />
              {meme.topText ? (
                <Text style={styles.memeTopText}>"{meme.topText}"</Text>
              ) : null}
              {meme.bottomText ? (
                <Text style={styles.memeBottomText}>"{meme.bottomText}"</Text>
              ) : null}
              <Text style={styles.memeSourceTag}>via {meme.source}</Text>
            </View>
          ) : (
            <Text style={styles.memeTopText}>
              "Me opening my laptop to be productive..."
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { padding: 20, paddingBottom: 30, alignItems: "center" },
  headerBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  brandTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 32,
    color: "#3A3A3A",
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  greetingTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#3A3A3A",
    textAlign: "center",
    // marginTop: 4,
  },
  greetingSub: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 24,
    color: "#3A3A3A",
    textAlign: "center",
    marginBottom: 14,
  },
  mochiWrap: { marginVertical: 10 },

  // Last Check-In Card
  checkInCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7D7AF2",
    letterSpacing: 1,
    marginBottom: 10,
  },
  checkInContent: { flexDirection: "row", alignItems: "center", gap: 14 },
  checkInEmoji: { fontSize: 32 },
  checkInTextWrap: { flex: 1 },
  checkInNote: { fontSize: 15, fontWeight: "600", color: "#3A3A3A" },
  checkInMoodLabel: { fontSize: 13, color: "#8A8A8A", marginTop: 2 },

  // Mirror Card
  mirrorCard: {
    width: "100%",
    backgroundColor: "#7D7AF2",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  mirrorContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  mirrorIconImage: {
    width: 44,
    height: 44,
  },
  mirrorColumn: {
    flexDirection: "column",
    justifyContent: "center",
  },
  mirrorTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 22,
    color: "#fff",
  },
  mirrorSub: { fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 2 },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Grid Modes
  modesGrid: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginVertical: 10,
  },
  gridCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: "flex-start",
  },
  gridIconImage: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  gridEmoji: { fontSize: 26, marginBottom: 6 },
  gridTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 18,
    color: "#3A3A3A",
  },
  gridSub: { fontSize: 12, color: "#7A7A8A", marginTop: 2 },

  // Meme of the Day Card
  memeCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  memeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  memeHeaderTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FF6B8B",
    letterSpacing: 1,
  },
  refreshMemeBtn: { fontSize: 12, fontWeight: "700", color: "#7D7AF2" },
  memeLoadingWrap: { padding: 30, alignItems: "center", gap: 8 },
  memeLoadingText: { fontSize: 13, color: "#8A8A8A" },
  memeBody: { alignItems: "center" },
  memeImage: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    backgroundColor: "#F8F8F8",
    marginBottom: 10,
    
  },
  memeTopText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3A3A3A",
    textAlign: "center",
    marginTop: 4,
  },
  memeBottomText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5A5A5A",
    textAlign: "center",
    marginTop: 2,
  },
  memeSourceTag: {
    fontSize: 11,
    color: "#B0B0C0",
    marginTop: 6,
    alignSelf: "flex-end",
  },

  // Insights Card
  insightsCard: {
    width: "100%",
    backgroundColor: "#F0EAFF",
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E2D8FD",
  },
  insightsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  insightsIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  insightsTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 18,
    color: "#3A3A3A",
  },
  insightsSub: {
    fontSize: 12,
    color: "#6A6A8A",
    marginTop: 2,
  },
  arrowCirclePurple: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
