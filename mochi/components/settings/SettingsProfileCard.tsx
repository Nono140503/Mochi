import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

interface SettingsProfileCardProps {
  nameInput: string;
  setNameInput: (text: string) => void;
  userEmail?: string | null;
  savedSuccess: boolean;
  onSaveName: () => void;
}

export default function SettingsProfileCard({
  nameInput,
  setNameInput,
  userEmail,
  savedSuccess,
  onSaveName,
}: SettingsProfileCardProps) {
  return (
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
          <Pressable style={styles.saveBtn} onPress={onSaveName}>
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
  );
}

const styles = StyleSheet.create({
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
});
