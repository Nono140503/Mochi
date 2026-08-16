import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { evaluateGuess } from "./MochidleGrid";

interface MochidleKeyboardProps {
  guesses: string[];
  targetWord: string;
  onKeyPress: (key: string) => void;
}

export default function MochidleKeyboard({
  guesses,
  targetWord,
  onKeyPress,
}: MochidleKeyboardProps) {
  const getKeyStatus = (letter: string) => {
    let status: "correct" | "present" | "absent" | "unused" = "unused";
    for (const guess of guesses) {
      const evaluations = evaluateGuess(guess, targetWord);
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === letter) {
          const evalResult = evaluations[i];
          if (evalResult === "correct") {
            return "correct";
          }
          if (evalResult === "present") {
            status = "present";
          } else if (evalResult === "absent" && status !== "present") {
            status = "absent";
          }
        }
      }
    }
    return status;
  };

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
  ];

  return (
    <View style={styles.keyboardContainer}>
      {keyboardRows.map((row, rIdx) => (
        <View key={rIdx} style={styles.keyboardRow}>
          {row.map((key) => {
            const status = getKeyStatus(key);
            let keyBgStyle = styles.keyUnused;

            if (status === "correct") keyBgStyle = styles.keyCorrect;
            else if (status === "present") keyBgStyle = styles.keyPresent;
            else if (status === "absent") keyBgStyle = styles.keyAbsent;

            const isSpecial = key === "ENTER" || key === "DELETE";

            return (
              <Pressable
                key={key}
                style={[
                  styles.key,
                  isSpecial ? styles.keyWide : null,
                  keyBgStyle,
                ]}
                onPress={() => onKeyPress(key)}
              >
                {key === "DELETE" ? (
                  <Text style={[styles.keyText, styles.keyTextSpecial]}>DEL</Text>
                ) : (
                  <Text style={[styles.keyText, isSpecial && styles.keyTextSpecial]}>
                    {key}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    width: "100%",
    marginTop: 10,
    gap: 6,
    alignItems: "center",
    paddingHorizontal: 1,
  },
  keyboardRow: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
  key: {
    minWidth: 32,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  keyWide: {
    minWidth: 50,
  },
  keyUnused: {
    backgroundColor: "#dcd6f7ff",
    borderWidth: 1,
    borderColor: "#EAE5F8",
  },
  keyCorrect: {
    backgroundColor: "#6BCE92",
    borderWidth: 1,
    borderColor: "#6BCE92",
  },
  keyPresent: {
    backgroundColor: "#FFC55C",
    borderWidth: 1,
    borderColor: "#FFC55C",
  },
  keyAbsent: {
    backgroundColor: "#C2C2C2",
    borderWidth: 1,
    borderColor: "#C2C2C2",
  },
  keyText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3A3A3A",
  },
  keyTextSpecial: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7D7AF2",
  },
});
