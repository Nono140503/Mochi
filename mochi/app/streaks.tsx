import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useMochiStore } from "../store/mochiStore";
import BottomNav from "../components/BottomNav";
import MochiBody, { SPECIAL_MOCHI_CHARACTERS } from "../components/MochiBody";

export default function Streaks() {
  const router = useRouter();
  const streak = useMochiStore((s) => s.streak);
  const history = useMochiStore((s) => s.history);
  const unlockedMochis = useMochiStore((s) => s.unlockedMochis || []);
  const baseColor = useMochiStore((s) => s.baseColor);

  const badges = [
    {
      title: "First Step",
      desc: "Completed 1 check-in",
      unlocked: history.length >= 1,
      image: require("../assets/images/plant.png"),
    },
    {
      title: "Focus Friend",
      desc: "3 session focus streak",
      unlocked: streak >= 3,
      image: require("../assets/images/fire.png"),
    },
    {
      title: "Emotional Master",
      desc: "Completed 5 check-ins",
      unlocked: history.length >= 5,
      image: require("../assets/images/reaction.png"),
    },
    {
      title: "Zen Master",
      desc: "10 session focus streak",
      unlocked: streak >= 10,
      image: require("../assets/images/meditation.png"),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header with Flame Icon */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Image
            source={require("../assets/images/fire.png")}
            style={styles.headerFlameIcon}
            resizeMode="contain"
          />
          <Text style={styles.title}>Focus Streaks & Badges</Text>
        </View>
        <Text style={styles.sub}>Keep checking in with Mochi every day</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Streak Hero Card */}
        <View style={styles.streakHero}>
          <Image
            source={require("../assets/images/fire.png")}
            style={styles.heroFlameIcon}
            resizeMode="contain"
          />
          <Text style={styles.heroCount}>{streak}</Text>
          <Text style={styles.heroLabel}>Session Focus Streak</Text>
          <Text style={styles.heroSub}>
            You're building a daily habit of emotional self-care with Mochi!
          </Text>
        </View>

        {/* Banner to Play Mochidle */}
        <Pressable style={styles.mochidleBanner} onPress={() => router.push("/mochidle" as any)}>
          <View style={styles.mochidleBannerContent}>
            <Text style={styles.mochidleBannerTitle}>Play Daily Mochidle</Text>
            <Text style={styles.mochidleBannerSub}>Guess wellness words & win Special Mochi character prizes!</Text>
          </View>
          <FontAwesome name="chevron-right" size={16} color="#fff" />
        </Pressable>

        {/* Special Mochi Collection Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Special Mochi Collection 🌟</Text>
          <Text style={styles.collectionCount}>
            {unlockedMochis.length} / {SPECIAL_MOCHI_CHARACTERS.length} Unlocked
          </Text>
        </View>
        <View style={styles.collectionGrid}>
          {SPECIAL_MOCHI_CHARACTERS.map((char) => {
            const isUnlocked = unlockedMochis.includes(char.id);
            return (
              <View
                key={char.id}
                style={[
                  styles.mochiCollectionCard,
                  !isUnlocked && styles.mochiCollectionLocked,
                ]}
              >
                <View style={styles.mochiAvatarWrap}>
                  <MochiBody
                    mood="neutral"
                    baseColor={baseColor}
                    size={110}
                    specialOutfit={char.id}
                  />
                </View>
                <Text style={styles.mochiCharName}>{char.name}</Text>
                <Text style={styles.mochiCharTitle}>{char.title}</Text>
                <Text style={styles.mochiCharDesc}>{char.description}</Text>

                <View
                  style={[
                    styles.unlockedTag,
                    !isUnlocked && styles.lockedTag,
                  ]}
                >
                  <Text style={[styles.unlockedTagText, !isUnlocked && styles.lockedTagText]}>
                    {isUnlocked ? "UNLOCKED" : "LOCKED"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Badges Section */}
        <Text style={styles.sectionTitle}>Achievement Badges</Text>
        <View style={styles.badgeGrid}>
          {badges.map((badge) => (
            <View
              key={badge.title}
              style={[
                styles.badgeCard,
                !badge.unlocked && styles.badgeLocked,
              ]}
            >
              <Image
                source={badge.image}
                style={styles.badgeImage}
                resizeMode="contain"
              />
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
              <Text style={styles.badgeStatus}>
                {badge.unlocked ? "UNLOCKED ✨" : "LOCKED 🔒"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  headerTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerFlameIcon: { width: 28, height: 28 },
  title: { fontFamily: "BubblegumSans_400Regular", fontSize: 24, color: "#3A3A3A" },
  sub: { fontSize: 13, color: "#8A8A8A", marginTop: 2 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 100 },
  streakHero: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  heroFlameIcon: { width: 64, height: 64, marginBottom: 4 },
  heroCount: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 48,
    color: "#7D7AF2",
    marginVertical: 2,
  },
  heroLabel: { fontSize: 16, fontWeight: "700", color: "#3A3A3A" },
  heroSub: { fontSize: 13, color: "#8A8A8A", textAlign: "center", marginTop: 6, lineHeight: 18 },
  mochidleBanner: {
    backgroundColor: "#7D7AF2",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#7D7AF2",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  mochidleBannerContent: { flex: 1, marginRight: 10 },
  mochidleBannerTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  mochidleBannerSub: { fontSize: 12, color: "rgba(255,255,255,0.9)", marginTop: 2 },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 20,
    color: "#3A3A3A",
  },
  collectionCount: { fontSize: 12, fontWeight: "700", color: "#7D7AF2" },

  collectionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  mochiCollectionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  mochiCollectionLocked: { opacity: 0.5 },
  mochiAvatarWrap: { marginBottom: 4, height: 110, justifyContent: "center", alignItems: "center" },
  mochiCharName: { fontSize: 14, fontWeight: "800", color: "#3A3A3A", textAlign: "center" },
  mochiCharTitle: { fontSize: 11, fontWeight: "600", color: "#7D7AF2", textAlign: "center", marginTop: 2 },
  mochiCharDesc: { fontSize: 10, color: "#8A8A8A", textAlign: "center", marginTop: 4, marginBottom: 8, lineHeight: 14 },
  unlockedTag: { backgroundColor: "#F3E8FF", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  lockedTag: { backgroundColor: "#F1F5F9" },
  unlockedTagText: { fontSize: 10, fontWeight: "800", color: "#7D7AF2" },
  lockedTagText: { color: "#64748B" },

  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  badgeCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  badgeLocked: { opacity: 0.5 },
  badgeImage: { width: 44, height: 44, marginBottom: 8 },
  badgeTitle: { fontSize: 14, fontWeight: "700", color: "#3A3A3A", textAlign: "center" },
  badgeDesc: { fontSize: 11, color: "#8A8A8A", textAlign: "center", marginTop: 2, marginBottom: 8 },
  badgeStatus: { fontSize: 10, fontWeight: "800", color: "#7D7AF2" },
});
