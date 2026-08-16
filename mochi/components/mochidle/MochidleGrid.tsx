import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export function evaluateGuess(
  guess: string,
  target: string
): ("correct" | "present" | "absent")[] {
  const len = target.length;
  const result: ("correct" | "present" | "absent")[] = new Array(len);
  const targetCounts: Record<string, number> = {};

  for (let i = 0; i < len; i++) {
    const char = target[i];
    targetCounts[char] = (targetCounts[char] || 0) + 1;
  }

  // Pass 1: Mark exact matches (correct / green)
  for (let i = 0; i < len; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      targetCounts[guess[i]]--;
    }
  }

  // Pass 2: Mark remaining letters (present / yellow or absent / gray)
  for (let i = 0; i < len; i++) {
    if (!result[i]) {
      const char = guess[i];
      if (targetCounts[char] && targetCounts[char] > 0) {
        result[i] = "present";
        targetCounts[char]--;
      } else {
        result[i] = "absent";
      }
    }
  }

  return result;
}

interface MochidleGridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
}

export default function MochidleGrid({
  guesses,
  currentGuess,
  targetWord,
}: MochidleGridProps) {
  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
        const isSubmitted = rowIndex < guesses.length;
        const isCurrentRow = rowIndex === guesses.length;
        const rowText = isSubmitted
          ? guesses[rowIndex]
          : isCurrentRow
          ? currentGuess.padEnd(WORD_LENGTH, " ")
          : "     ";

        return (
          <View key={rowIndex} style={styles.row}>
            {(() => {
              const rowEvaluations = isSubmitted
                ? evaluateGuess(guesses[rowIndex], targetWord)
                : [];

              return Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                const letter = rowText[colIndex]?.trim() || "";
                let tileStyle = styles.tileEmpty;
                let textStyle = styles.tileTextEmpty;

                if (isSubmitted) {
                  const evalStatus = rowEvaluations[colIndex];
                  if (evalStatus === "correct") {
                    tileStyle = styles.tileCorrect;
                    textStyle = styles.tileTextFilled;
                  } else if (evalStatus === "present") {
                    tileStyle = styles.tilePresent;
                    textStyle = styles.tileTextFilled;
                  } else {
                    tileStyle = styles.tileAbsent;
                    textStyle = styles.tileTextFilled;
                  }
                } else if (letter) {
                  tileStyle = styles.tileActive;
                  textStyle = styles.tileTextActive;
                }

                return (
                  <View key={colIndex} style={[styles.tile, tileStyle]}>
                    <Text style={[styles.tileText, textStyle]}>{letter}</Text>
                  </View>
                );
              });
            })()}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    alignItems: "center",
    marginVertical: 12,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  tile: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  tileEmpty: {
    backgroundColor: "#fff",
    borderColor: "#EAE5F8",
  },
  tileActive: {
    backgroundColor: "#fff",
    borderColor: "#7D7AF2",
  },
  tileCorrect: {
    backgroundColor: "#6BCE92",
    borderColor: "#6BCE92",
  },
  tilePresent: {
    backgroundColor: "#FFC55C",
    borderColor: "#FFC55C",
  },
  tileAbsent: {
    backgroundColor: "#A0A0A0",
    borderColor: "#A0A0A0",
  },
  tileText: {
    fontSize: 22,
    fontWeight: "800",
  },
  tileTextEmpty: { color: "#3A3A3A" },
  tileTextActive: { color: "#7D7AF2" },
  tileTextFilled: { color: "#fff" },
});
