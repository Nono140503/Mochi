import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts, BubblegumSans_400Regular } from "@expo-google-fonts/bubblegum-sans";
import { useMochiStore } from "../store/mochiStore";

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

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

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
  }, [hydrated, isLoggedIn, hasCompletedOnboarding, hasCustomizedMochi, segments]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FFF8F0" },
        headerShadowVisible: false,
        headerBackTitle: "",
        headerTitleStyle: {
          fontFamily: fontsLoaded ? "BubblegumSans_400Regular" : undefined,
          fontSize: 22,
          color: "#3A3A3A",
        },
        headerTintColor: "#3A3A3A",
        contentStyle: { backgroundColor: "#FFF8F0" },
      }}
    >
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="customize" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: "Mochi" }} />
      <Stack.Screen name="mirror" options={{ title: "Mirror Mode", headerShown: false}} />
      <Stack.Screen name="rehearsal" options={{ title: "Rehearsal Mode", headerShown: false }} />
      <Stack.Screen name="beside" options={{ title: "Beside You Mode", headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="memories" options={{ headerShown: false }} />
      <Stack.Screen name="streaks" options={{ headerShown: false }} />
    </Stack>
  );
}
