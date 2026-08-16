import { useEffect, useRef } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts, BubblegumSans_400Regular } from "@expo-google-fonts/bubblegum-sans";
import * as SplashScreen from "expo-splash-screen";
import { useMochiStore } from "../store/mochiStore";

// Keep Splash Screen visible until state hydration and fonts are ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BubblegumSans_400Regular,
  });

  const hydrate = useMochiStore((s) => s.hydrate);
  const hydrated = useMochiStore((s) => s.hydrated);
  const isLoggedIn = useMochiStore((s) => s.isLoggedIn);
  const hasCompletedOnboarding = useMochiStore((s) => s.hasCompletedOnboarding);
  const hasCustomizedMochi = useMochiStore((s) => s.hasCustomizedMochi);

  const router = useRouter();
  const segments = useSegments();
  const splashHiddenRef = useRef(false);

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated || !fontsLoaded) return;

    // Safely hide native Splash Screen once ready
    if (!splashHiddenRef.current) {
      splashHiddenRef.current = true;
      SplashScreen.hideAsync().catch(() => {});
    }

    const currentScreen = segments[0];

    if (!hasCompletedOnboarding) {
      if (currentScreen !== "onboarding") {
        router.replace("/onboarding" as any);
      }
    } else if (!isLoggedIn) {
      if (currentScreen !== "login") {
        router.replace("/login" as any);
      }
    } else if (!hasCustomizedMochi) {
      if (currentScreen !== "customize") {
        router.replace("/customize" as any);
      }
    } else {
      if (currentScreen === "onboarding" || currentScreen === "login" || currentScreen === "customize") {
        router.replace("/" as any);
      }
    }
  }, [hydrated, fontsLoaded, isLoggedIn, hasCompletedOnboarding, hasCustomizedMochi, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFF8F0" },
      }}
    >
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="customize" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="mirror" options={{ headerShown: false }} />
      <Stack.Screen name="rehearsal" options={{ headerShown: false }} />
      <Stack.Screen name="beside" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="memories" options={{ headerShown: false }} />
      <Stack.Screen name="streaks" options={{ headerShown: false }} />
    </Stack>
  );
}
