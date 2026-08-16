import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useMochiStore } from "../store/mochiStore";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const router = useRouter();
  const { login, userName } = useMochiStore();
  const baseColor = useMochiStore((s) => s.baseColor);

  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAuth = async () => {
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter an email and password.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setErrorMessage("Please tell Mochi your name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        // Attempt Supabase Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: { display_name: name.trim() },
          },
        });

        if (error) {
          // If Supabase has placeholder keys or network error, fallback gracefully to store login
          console.warn("Supabase auth notice:", error.message);
        }

        const displayName =
          name.trim() ||
          data?.user?.user_metadata?.display_name ||
          (userName && userName !== "Friend" ? userName : "Friend");
        await login(displayName, email.trim());
        useMochiStore.setState({ hasCustomizedMochi: false });
        router.replace("/customize" as any);
      } else {
        // Attempt Supabase Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          console.warn("Supabase signin notice:", error.message);
          if (error.message.includes("Email not confirmed")) {
            setErrorMessage("Please check your email to confirm your account, or turn off 'Confirm email' in Supabase Dashboard.");
          } else {
            setErrorMessage(error.message);
          }
        }

        const displayName =
          data?.user?.user_metadata?.display_name ||
          (name.trim() ? name.trim() : userName && userName !== "Friend" ? userName : "Friend");
        await login(displayName, email.trim());
        useMochiStore.setState({ hasCustomizedMochi: true });
        router.replace("/" as any);
      }
    } catch (e: any) {
      console.warn("Auth error fallback:", e);
      const fallbackName = name.trim() || (userName && userName !== "Friend" ? userName : "Friend");
      await login(fallbackName, email.trim());
      router.replace(mode === "signup" ? ("/customize" as any) : ("/" as any));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    await login("Friend");
    router.replace("/customize" as any);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Transparent Mochi Logo Header */}
        <View style={styles.header}>
          <Image
            source={require("../assets/images/Mochi_transparent.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Auth Card */}
        <View style={styles.card}>
          {/* Tab Selector */}
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tab, mode === "signup" && styles.tabActive]}
              onPress={() => {
                setMode("signup");
                setErrorMessage("");
              }}
            >
              <Text style={[styles.tabText, mode === "signup" && styles.tabTextActive]}>
                Create Account
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, mode === "signin" && styles.tabActive]}
              onPress={() => {
                setMode("signin");
                setErrorMessage("");
              }}
            >
              <Text style={[styles.tabText, mode === "signin" && styles.tabTextActive]}>
                Sign In
              </Text>
            </Pressable>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {mode === "signup" && (
            <View style={styles.field}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="What should Mochi call you?"
                placeholderTextColor="#B0A9C7"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#B0A9C7"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#B0A9C7"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {mode === "signup" && (
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#B0A9C7"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          )}

          <Pressable style={styles.primaryBtn} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {mode === "signup" ? "Create Account" : "Sign In →"}
              </Text>
            )}
          </Pressable>

          <Pressable style={styles.guestBtn} onPress={handleGuestLogin}>
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { alignItems: "center", padding: 24, paddingTop: 30, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 10 },
  logoImage: { width: 220, height: 220, marginBottom: 10 },
  title: { fontFamily: "BubblegumSans_400Regular", fontSize: 46, color: "#3A3A3A", marginTop: 14, textAlign: "center" },
  subtitle: {
    fontSize: 14,
    color: "#6A6A6A",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 320,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#D8C7FA",
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#8A8A8A" },
  tabTextActive: { color: "#3A3A3A", fontWeight: "700" },
  errorText: { color: "#D9534F", fontSize: 13, textAlign: "center", marginBottom: 12, fontWeight: "500" },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "700", color: "#3A3A3A", marginBottom: 6 },
  input: {
    backgroundColor: "#FFF9F4",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#2A2A2A",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  primaryBtn: {
    backgroundColor: "#7D7AF2",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  guestBtn: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  guestBtnText: { color: "#8A8A8A", fontWeight: "600", fontSize: 14 },
});
