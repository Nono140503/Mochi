import { useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMochiStore } from "../store/mochiStore";
import BottomNav from "../components/BottomNav";

import SettingsHeader from "../components/settings/SettingsHeader";
import SettingsProfileCard from "../components/settings/SettingsProfileCard";
import SettingsVoicePersonaCard from "../components/settings/SettingsVoicePersonaCard";
import SettingsColorCustomizerCard from "../components/settings/SettingsColorCustomizerCard";
import SettingsStatsCard from "../components/settings/SettingsStatsCard";
import SettingsSignOutBtn from "../components/settings/SettingsSignOutBtn";

export default function Settings() {
  const router = useRouter();
  const {
    userName,
    userEmail,
    baseColor,
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
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/onboarding" as any);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <SettingsHeader />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SettingsProfileCard
          nameInput={nameInput}
          setNameInput={setNameInput}
          userEmail={userEmail}
          savedSuccess={savedSuccess}
          onSaveName={handleSaveName}
        />

        <SettingsVoicePersonaCard userName={userName} />

        <SettingsColorCustomizerCard baseColor={baseColor} setBaseColor={setBaseColor} />

        <SettingsStatsCard streak={streak} />

        <SettingsSignOutBtn onLogout={handleLogout} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 100 },
});
