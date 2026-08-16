import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Modal,
  LogBox,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Video, ResizeMode, Audio } from "expo-av";

// Suppress benign expo-av deprecation warning log
LogBox.ignoreLogs(["Video component from `expo-av` is deprecated", "[expo-av]: Video component"]);
import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
} from "react-native-svg";

// Custom SVG Component: 3 Hugging Mochis with different expressions
function ThreeHuggingMochis() {
  return (
    <Svg width={280} height={165} viewBox="0 0 300 175">
      <Defs>
        <LinearGradient id="hugGloss" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </LinearGradient>

        <RadialGradient id="blushGradientHug" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF8EA6" stopOpacity="0.7" />
          <Stop offset="100%" stopColor="#FF8EA6" stopOpacity="0.0" />
        </RadialGradient>
      </Defs>

      {/* Ground Soft Drop Shadow */}
      <Ellipse cx="150" cy="158" rx="115" ry="11" fill="#D6C7F5" opacity={0.35} />

      {/* FLOATING HEARTS & SPARKLES */}
      <G>
        {/* Big Center Heart */}
        <Path
          d="M150,28 C144,18 132,18 126,26 C120,34 126,46 150,60 C174,46 180,34 174,26 C168,18 156,18 150,28 Z"
          fill="#FF5252"
          opacity={0.9}
        />
        {/* Left Mini Heart */}
        <Path
          d="M95,38 C91,30 82,30 78,35 C74,40 78,49 95,58 C112,49 116,40 112,35 C108,30 99,30 95,38 Z"
          fill="#FF708A"
          opacity={0.85}
        />
        {/* Right Mini Heart */}
        <Path
          d="M205,38 C201,30 192,30 188,35 C184,40 188,49 205,58 C222,49 226,40 222,35 C218,30 209,30 205,38 Z"
          fill="#FF708A"
          opacity={0.85}
        />
        {/* Sparkle Dots */}
        <Circle cx="62" cy="46" r="3" fill="#FFD166" />
        <Circle cx="238" cy="46" r="3" fill="#FFD166" />
        <Circle cx="150" cy="12" r="2.5" fill="#7D7AF2" />
      </G>

      {/* LEFT MOCHI (Pastel Lavender - Winking Happy) */}
      <G>
        {/* Body Blob */}
        <Path
          d="M90,65 C118,65 132,85 130,118 C128,142 122,154 90,154 C58,154 52,142 50,118 C48,85 62,65 90,65 Z"
          fill="#C9B8FF"
        />
        {/* Gloss Highlight */}
        <Path d="M75,70 C102,70 120,82 124,100 C114,82 95,74 75,70 Z" fill="url(#hugGloss)" />
        {/* Cheek Blush */}
        <Ellipse cx="68" cy="116" rx="7" ry="4" fill="url(#blushGradientHug)" />
        <Ellipse cx="112" cy="116" rx="7" ry="4" fill="url(#blushGradientHug)" />
        {/* Left Winking Eye */}
        <Path d="M70,104 C74,98 80,98 84,104" stroke="#2D2146" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Right Open Eye */}
        <Ellipse cx="106" cy="103" rx="6" ry="8" fill="#2D2146" />
        <Circle cx="104" cy="100" r="2.5" fill="#FFFFFF" />
        {/* Mouth */}
        <Path d="M84,112 C88,118 94,118 98,112" stroke="#2D2146" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Arm hugging center Mochi */}
        <Path d="M112,122 C126,118 140,120 144,126 C140,132 124,132 110,128 Z" fill="#BBA7FF" />
      </G>

      {/* RIGHT MOCHI (Pastel Mint - Joyful Closed Eyes) */}
      <G>
        {/* Body Blob */}
        <Path
          d="M210,65 C238,65 252,85 250,118 C248,142 242,154 210,154 C178,154 172,142 170,118 C168,85 182,65 210,65 Z"
          fill="#BDE8D4"
        />
        {/* Gloss Highlight */}
        <Path d="M195,70 C222,70 240,82 244,100 C234,82 215,74 195,70 Z" fill="url(#hugGloss)" />
        {/* Cheek Blush */}
        <Ellipse cx="188" cy="116" rx="7" ry="4" fill="url(#blushGradientHug)" />
        <Ellipse cx="232" cy="116" rx="7" ry="4" fill="url(#blushGradientHug)" />
        {/* Closed Happy Eyes (^ ^) */}
        <Path d="M184,104 C188,98 194,98 198,104" stroke="#2D2146" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <Path d="M222,104 C226,98 232,98 236,104" stroke="#2D2146" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Mouth */}
        <Path d="M204,112 C208,118 214,118 218,112" stroke="#2D2146" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Arm hugging center Mochi */}
        <Path d="M188,122 C174,118 160,120 156,126 C160,132 176,132 190,128 Z" fill="#A8D8C2" />
      </G>

      {/* CENTER MOCHI (Pastel Pink - Central Embraced Mochi) */}
      <G>
        {/* Body Blob */}
        <Path
          d="M150,55 C180,55 194,78 192,114 C190,140 182,156 150,156 C118,156 110,140 108,114 C106,78 120,55 150,55 Z"
          fill="#F7B8D2"
        />
        {/* Gloss Highlight */}
        <Path d="M132,60 C162,60 182,74 186,95 C172,76 150,68 132,60 Z" fill="url(#hugGloss)" />
        {/* Cheek Blush */}
        <Ellipse cx="126" cy="108" rx="8" ry="5" fill="url(#blushGradientHug)" />
        <Ellipse cx="174" cy="108" rx="8" ry="5" fill="url(#blushGradientHug)" />
        {/* Loving Eyes (Heart Eyes) */}
        <Path
          d="M130,94 C128,90 122,90 119,93 C116,96 119,101 130,107 C141,101 144,96 141,93 C138,90 132,90 130,94 Z"
          fill="#FF5252"
        />
        <Path
          d="M170,94 C168,90 162,90 159,93 C156,96 159,101 170,107 C181,101 184,96 181,93 C178,90 172,90 170,94 Z"
          fill="#FF5252"
        />
        {/* Happy Open Smile */}
        <Path d="M143,108 C143,116 157,116 157,108 Z" fill="#2D2146" />
        <Path d="M145,111 C147,115 153,115 155,111 Z" fill="#FF8EA6" />
        {/* Hugging Paws */}
        <Ellipse cx="122" cy="126" rx="9" ry="6" fill="#ECA2C2" />
        <Ellipse cx="178" cy="126" rx="9" ry="6" fill="#ECA2C2" />
      </G>
    </Svg>
  );
}

export default function Notifications() {
  const router = useRouter();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (showVideoModal) {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      }).catch((e) => console.warn("Audio mode error for promo video:", e));
    }
  }, [showVideoModal]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={18} color="#3A3A3A" />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* FEATURED ANNOUNCEMENT CARD: COMING SOON MOCHI FRIENDS */}
        <View style={styles.featuredCard}>
          <View style={styles.comingSoonTag}>
            <Text style={styles.comingSoonTagText}>COMING SOON</Text>
          </View>

          <Text style={styles.featuredTitle}>Mochi Friends 👥</Text>
          <Text style={styles.featuredSub}>
            Mochi is not meant to be alone, Mochi needs friends! Connect, chat and compete with your friends on Mochi.
          </Text>

          {/* 3 Hugging Mochis SVG Scene */}
          <View style={styles.illustrationWrap}>
            <ThreeHuggingMochis />
          </View>

          {/* Super Cute Video Play Button */}
          <Pressable style={styles.watchVideoBtn} onPress={() => setShowVideoModal(true)}>
            <FontAwesome name="play-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.watchVideoText}>Watch Mochi Friends Promo Video</Text>
          </Pressable>

          <View style={styles.notifyMeBtn}>
            <FontAwesome name="heart" size={14} color="#7D7AF2" style={{ marginRight: 6 }} />
            <Text style={styles.notifyMeText}>Stay tuned — Friends feature arriving soon!</Text>
          </View>
        </View>

        {/* NOTIFICATION FEED LIST */}
        <Text style={styles.sectionHeader}>Recent Updates</Text>

        {/* Notification 1: Mochi Friends Announcement */}
        <View style={[styles.notifCard, styles.notifUnread]}>
          <View style={[styles.notifIconWrap, { backgroundColor: "#F0EAFF" }]}>
            <FontAwesome name="users" size={16} color="#7D7AF2" />
          </View>
          <View style={styles.notifTextWrap}>
            <View style={styles.notifTitleRow}>
              <Text style={styles.notifTitle}>Coming Soon!: Mochi Friends</Text>
              <View style={styles.unreadDot} />
            </View>
            <Text style={styles.notifSub}>
              Mochi is not meant to be alone, Mochi needs friends! Connect, chat and compete with your friends on Mochi.
            </Text>
            <Pressable style={styles.inlinePlayBtn} onPress={() => setShowVideoModal(true)}>
              <FontAwesome name="play" size={11} color="#7D7AF2" style={{ marginRight: 5 }} />
              <Text style={styles.inlinePlayBtnText}>Watch Teaser Video</Text>
            </Pressable>
            <Text style={styles.notifTime}>Just now</Text>
          </View>
        </View>

        {/* Notification 2: Daily Mochidle Game */}
        <View style={styles.notifCard}>
          <View style={[styles.notifIconWrap, { backgroundColor: "#FFF4E5" }]}>
            <FontAwesome name="gamepad" size={16} color="#FF9800" />
          </View>
          <View style={styles.notifTextWrap}>
            <Text style={styles.notifTitle}>Daily Mochidle Word Ready</Text>
            <Text style={styles.notifSub}>
              A fresh wellness word of the day is waiting for you! Can you guess it in 3 or fewer tries to win a Special Mochi Prize?
            </Text>
            <Text style={styles.notifTime}>2h ago</Text>
          </View>
        </View>

        {/* Notification 3: Mirror Check-in */}
        <View style={styles.notifCard}>
          <View style={[styles.notifIconWrap, { backgroundColor: "#FFF0F5" }]}>
            <FontAwesome name="heart" size={16} color="#FF6B8B" />
          </View>
          <View style={styles.notifTextWrap}>
            <Text style={styles.notifTitle}>Daily Reflection Reminder</Text>
            <Text style={styles.notifSub}>
              How are you feeling today? Mochi is ready to listen in Mirror mode.
            </Text>
            <Text style={styles.notifTime}>1d ago</Text>
          </View>
        </View>
      </ScrollView>

      {/* PROMO VIDEO PLAYBACK MODAL */}
      <Modal visible={showVideoModal} animationType="slide" transparent>
        <View style={styles.videoModalOverlay}>
          <View style={styles.videoModalCard}>
            <View style={styles.videoModalHeader}>
              <View style={styles.videoHeaderTitleRow}>
                <FontAwesome name="film" size={16} color="#7D7AF2" />
                <Text style={styles.videoModalTitle}>Mochi Friends Teaser</Text>
              </View>
              <Pressable style={styles.closeVideoBtn} onPress={() => setShowVideoModal(false)}>
                <FontAwesome name="times" size={18} color="#8A8A8A" />
              </Pressable>
            </View>

            {/* Video Player */}
            <View style={styles.videoPlayerContainer}>
              <Video
                ref={videoRef}
                source={require("../assets/videos/Mochi_Friends.mp4")}
                style={styles.videoPlayer}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay={showVideoModal}
                volume={1.0}
                isMuted={false}
              />
            </View>

            <Pressable style={styles.closeModalBarBtn} onPress={() => setShowVideoModal(false)}>
              <Text style={styles.closeModalBarBtnText}>Done Watching</Text>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { padding: 6 },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "BubblegumSans_400Regular" : "sans-serif-medium",
    fontSize: 22,
    color: "#3A3A3A",
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },

  // Featured Announcement Card
  featuredCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: "#EAE5F8",
    alignItems: "center",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  comingSoonTag: {
    backgroundColor: "#7D7AF2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  comingSoonTagText: { color: "#fff", fontSize: 11, fontWeight: "900" },
  featuredTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 26,
    color: "#3A3A3A",
    marginBottom: 6,
    textAlign: "center",
  },
  featuredSub: {
    fontSize: 13,
    color: "#6A6A7A",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  illustrationWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  watchVideoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7D7AF2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 12,
    width: "100%",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  watchVideoText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  notifyMeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FFB6C1",
  },
  notifyMeText: { fontSize: 12, fontWeight: "700", color: "#7D7AF2" },

  // Notification List Feed
  sectionHeader: {
    fontSize: 17,
    fontWeight: "800",
    color: "#3A3A3A",
    marginTop: 16,
    marginBottom: 12,
  },
  notifCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EAE5F8",
    alignItems: "flex-start",
    gap: 12,
  },
  notifUnread: {
    borderColor: "#7D7AF2",
    backgroundColor: "#FAF9FF",
  },
  notifIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  notifTextWrap: { flex: 1 },
  notifTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  notifTitle: { fontSize: 14, fontWeight: "800", color: "#3A3A3A" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7D7AF2",
  },
  notifSub: { fontSize: 12, color: "#6A6A7A", marginTop: 3, lineHeight: 17 },
  inlinePlayBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EAFF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#DCD0FF",
  },
  inlinePlayBtnText: { fontSize: 11, fontWeight: "700", color: "#7D7AF2" },
  notifTime: { fontSize: 11, color: "#A0A0A0", marginTop: 6 },

  // Promo Video Modal
  videoModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  videoModalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  videoModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  videoHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  videoModalTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 20,
    color: "#3A3A3A",
  },
  closeVideoBtn: {
    padding: 4,
  },
  videoPlayerContainer: {
    width: "100%",
    height: 240,
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  closeModalBarBtn: {
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  closeModalBarBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
