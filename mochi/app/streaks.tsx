import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMochiStore } from "../store/mochiStore";
import BottomNav from "../components/BottomNav";

export default function Streaks() {
  const streak = useMochiStore((s) => s.streak);
  const history = useMochiStore((s) => s.history);

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
  sectionTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 20,
    color: "#3A3A3A",
    marginTop: 6,
  },
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
