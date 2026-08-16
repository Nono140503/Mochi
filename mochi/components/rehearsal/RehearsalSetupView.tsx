import React from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import MochiBody from "../MochiBody";

interface RehearsalSetupViewProps {
  baseColor: string;
  personaDescription: string;
  setPersonaDescription: (text: string) => void;
  onStart: () => void;
  onBack: () => void;
}

export default function RehearsalSetupView({
  baseColor,
  personaDescription,
  setPersonaDescription,
  onStart,
  onBack,
}: RehearsalSetupViewProps) {
  return (
    <SafeAreaView style={styles.setupContainer}>
      <View style={styles.topNav}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <FontAwesome name="arrow-left" size={18} color="#3A3A3A" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.setupScroll}>
        <MochiBody mood="curled" baseColor={baseColor} size={170} />
        <Text style={styles.setupTitle}>Rehearsal Mode</Text>
        <Text style={styles.setupLabel}>
          Who do you need to practice talking to, and what's the situation? Describe the person's personality
        </Text>
        <TextInput
          style={styles.setupInput}
          placeholder="e.g. My roommate, about splitting rent unfairly. She gets defensive fast."
          placeholderTextColor="#B0A9C7"
          value={personaDescription}
          onChangeText={setPersonaDescription}
          multiline
          numberOfLines={4}
        />
        <Pressable style={styles.startBtn} onPress={onStart}>
          <Text style={styles.startBtnText}>Start Rehearsal 🎭</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  setupContainer: { flex: 1, backgroundColor: "#FFF8F0" },
  topNav: { paddingHorizontal: 20, paddingTop: 10 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  setupScroll: { alignItems: "center", padding: 24, paddingTop: 20 },
  setupTitle: { fontFamily: "BubblegumSans_400Regular", fontSize: 28, color: "#3A3A3A", marginTop: 12 },
  setupLabel: { fontSize: 15, color: "#6A6A7A", textAlign: "center", marginTop: 8, marginBottom: 20, lineHeight: 22 },
  setupInput: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: "#3A3A3A",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  startBtn: {
    width: "100%",
    backgroundColor: "#7D7AF2",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
