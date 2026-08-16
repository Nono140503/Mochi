import React from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";

export type MemeData = {
  title: string;
  topText: string;
  bottomText: string;
  imageUrl: string;
  source: string;
};

interface HomeMemeCardProps {
  meme: MemeData | null;
  loadingMeme: boolean;
}

export default function HomeMemeCard({ meme, loadingMeme }: HomeMemeCardProps) {
  return (
    <View style={styles.memeCard}>
      <View style={styles.memeHeader}>
        <Text style={styles.memeHeaderTitle}>MOCHI'S MEME OF THE DAY</Text>
      </View>

      {loadingMeme ? (
        <View style={styles.memeLoadingWrap}>
          <ActivityIndicator color="#7D7AF2" />
          <Text style={styles.memeLoadingText}>Fetching fresh meme...</Text>
        </View>
      ) : meme ? (
        <View style={styles.memeBody}>
          <Image
            source={{ uri: meme.imageUrl }}
            style={styles.memeImage}
            resizeMode="contain"
          />
          {meme.topText ? (
            <Text style={styles.memeTopText}>"{meme.topText}"</Text>
          ) : null}
          {meme.bottomText ? (
            <Text style={styles.memeBottomText}>"{meme.bottomText}"</Text>
          ) : null}
          <Text style={styles.memeSourceTag}>via {meme.source}</Text>
        </View>
      ) : (
        <Text style={styles.memeTopText}>
          "Me opening my laptop to be productive..."
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  memeCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EAE5F8",
    alignItems: "center",
  },
  memeHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  memeHeaderTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#f671abff",
    letterSpacing: 1.2,
  },
  memeLoadingWrap: {
    paddingVertical: 20,
    alignItems: "center",
  },
  memeLoadingText: {
    fontSize: 12,
    color: "#7D7AF2",
    marginTop: 8,
  },
  memeBody: {
    alignItems: "center",
    width: "100%",
  },
  memeImage: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginBottom: 10,
  },
  memeTopText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3A3A3A",
    textAlign: "center",
    marginTop: 4,
  },
  memeBottomText: {
    fontSize: 13,
    color: "#6A6A7A",
    textAlign: "center",
    marginTop: 2,
  },
  memeSourceTag: {
    fontSize: 10,
    color: "#A0A0A0",
    marginTop: 8,
    fontStyle: "italic",
  },
});
