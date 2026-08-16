import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Home", icon: "home", path: "/" },
    { name: "Memories", icon: "cloud", path: "/memories" },
    { name: "Streaks", icon: "fire", path: "/streaks" },
    { name: "Me", icon: "user", path: "/settings" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.path ||
          (tab.path === "/" && (pathname === "" || pathname === "/index"));
        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.path as any)}
          >
            <FontAwesome
              name={tab.icon as any}
              size={20}
              color={isActive ? "#7D7AF2" : "#A0A0B2"}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  tab: { alignItems: "center", justifyContent: "center", gap: 3 },
  tabLabel: { fontSize: 11, fontWeight: "500", color: "#A0A0B2" },
  tabLabelActive: { color: "#7D7AF2", fontWeight: "700" },
});
