import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useMochiStore } from "../store/mochiStore";
import MochiBody from "../components/MochiBody";

const PASTEL_PRESETS = [
  { name: "Lavender", hex: "#C9B8FF" },
  { name: "Blush Pink", hex: "#FFC2D1" },
  { name: "Soft Mint", hex: "#B8E6D5" },
  { name: "Butter Yellow", hex: "#FFE3A3" },
  { name: "Sky Blue", hex: "#B8D8FF" },
  { name: "Peach", hex: "#FFCBA4" },
];

export default function Settings() {
  const router = useRouter();
  const {
    userName,
    userEmail,
    baseColor,
    mood,
    streak,
    setBaseColor,
    login,
    logout,
  } = useMochiStore();

  const [nameInput, setNameInput] = useState(userName || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    await login(nameInput.trim(), userEmail || undefined);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of Mochi?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login" as any);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account Profile</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Your Name</Text>
            <View style={styles.nameRow}>
              <TextInput
                style={styles.input}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter your name"
                placeholderTextColor="#A0A0A0"
              />
              <Pressable style={styles.saveBtn} onPress={handleSaveName}>
                <Text style={styles.saveBtnText}>
                  {savedSuccess ? "Saved!" : "Save"}
                </Text>
              </Pressable>
            </View>
          </View>
          {userEmail ? (
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.emailValue}>{userEmail}</Text>
            </View>
          ) : null}
        </View>

        {/* Mochi Default Color Customization */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mochi's Default Color</Text>
          <Text style={styles.sectionSub}>
            Choose Mochi's baseline color. When neutral, Mochi will rest in this shade!
          </Text>

          <View style={styles.mochiPreview}>
            <MochiBody mood="neutral" baseColor={baseColor} size={140} />
          </View>

          <View style={styles.swatchGrid}>
            {PASTEL_PRESETS.map((preset) => (
              <Pressable
                key={preset.hex}
                style={[
                  styles.swatchItem,
                  preset.hex === baseColor && styles.swatchSelected,
                ]}
                onPress={() => setBaseColor(preset.hex)}
              >
                <View
                  style={[styles.colorCircle, { backgroundColor: preset.hex }]}
                />
                <Text style={styles.swatchName}>{preset.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Focus Stats & Streak */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Focus & Companion Stats</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Focus Streak</Text>
            <Text style={styles.statValue}>{streak} 🔥</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={16} color="#FF6B8B" />
          <Text style={styles.logoutBtnText}>Sign Out of Mochi</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { padding: 20, gap: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionTitle: {
    fontFamily: "BubblegumSans_400Regular",
    fontSize: 20,
    color: "#3A3A3A",
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 14,
  },
  field: { marginTop: 10 },
  label: { fontSize: 12, fontWeight: "700", color: "#8A8A8A", marginBottom: 6 },
  emailValue: { fontSize: 15, color: "#3A3A3A", fontWeight: "500" },
  nameRow: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2A2A2A",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  saveBtn: {
    backgroundColor: "#7D7AF2",
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  mochiPreview: { alignItems: "center", marginVertical: 10 },
  swatchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 10,
  },
  swatchItem: {
    width: "30%",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: {
    borderColor: "#7D7AF2",
    backgroundColor: "#F2EEFF",
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 6,
  },
  swatchName: { fontSize: 12, fontWeight: "600", color: "#3A3A3A" },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statLabel: { fontSize: 14, color: "#5A5A5A" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#7D7AF2" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFF0F3",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#FFD0D9",
    marginTop: 10,
  },
  logoutBtnText: { color: "#FF6B8B", fontWeight: "700", fontSize: 15 },
});
