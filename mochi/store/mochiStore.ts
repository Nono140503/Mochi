import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type MochiMood =
  | "neutral"
  | "happy"
  | "loved"
  | "content"
  | "calm"
  | "sad"
  | "deeply_sad"
  | "anxious"
  | "overwhelmed"
  | "angry"
  | "annoyed"
  | "lonely"
  | "tired"
  | "burnt_out"
  | "scared"
  | "numb"
  | "hopeful"
  | "excited"
  | "grateful"
  | "proud"
  | "at_peace"
  | "wilting"
  | "glowing"
  | "curled"
  | "blooming";

type MochiState = {
  userName: string | null;
  userEmail: string | null;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  hasCustomizedMochi: boolean;
  mood: MochiMood;
  baseColor: string; // hex, user-chosen pastel
  lastCheckIn: string | null; // ISO date string
  streak: number;
  history: { date: string; mood: MochiMood; note?: string }[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  login: (name: string, email?: string) => Promise<void>;
  completeCustomization: (color: string) => Promise<void>;
  logout: () => Promise<void>;
  setMood: (mood: MochiMood, note?: string) => Promise<void>;
  setBaseColor: (color: string) => Promise<void>;
  bumpStreak: () => Promise<void>;
  computeIdleMood: () => MochiMood;
};

const STORAGE_KEY = "mochi:state:v1";
const DEFAULT_COLOR = "#C9B8FF"; // soft lavender

export const useMochiStore = create<MochiState>((set, get) => ({
  userName: null,
  userEmail: null,
  isLoggedIn: false,
  hasCompletedOnboarding: false,
  hasCustomizedMochi: false,
  mood: "neutral",
  baseColor: DEFAULT_COLOR,
  lastCheckIn: null,
  streak: 0,
  history: [],
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({ ...parsed, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch (e) {
      console.warn("Mochi failed to hydrate state", e);
      set({ hydrated: true });
    }
  },

  completeOnboarding: async () => {
    set({ hasCompletedOnboarding: true });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), hasCompletedOnboarding: true })
    );
  },

  login: async (name: string, email?: string) => {
    const currentEmail = get().userEmail;
    const newEmail = email?.trim() || null;
    const isDifferentAccount = currentEmail && newEmail && currentEmail.toLowerCase() !== newEmail.toLowerCase();

    const next = {
      userName: name.trim() || "Friend",
      userEmail: newEmail,
      isLoggedIn: true,
      ...(isDifferentAccount
        ? {
            history: [],
            lastCheckIn: null,
            streak: 0,
            mood: "neutral" as MochiMood,
            hasCustomizedMochi: false,
          }
        : {}),
    };
    set(next);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), ...next })
    );
  },

  completeCustomization: async (color: string) => {
    const next = {
      baseColor: color,
      mood: "neutral" as MochiMood,
      hasCustomizedMochi: true,
    };
    set(next);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), ...next })
    );
  },

  logout: async () => {
    const next = {
      isLoggedIn: false,
      userName: null,
      userEmail: null,
      hasCustomizedMochi: false,
      history: [],
      lastCheckIn: null,
      streak: 0,
      mood: "neutral" as MochiMood,
    };
    set(next);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), ...next })
    );
  },

  setMood: async (mood, note) => {
    const now = new Date().toISOString();
    const history = [...get().history, { date: now, mood, note }].slice(-50);
    const next = { mood, lastCheckIn: now, history };
    set(next);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), ...next })
    );
  },

  setBaseColor: async (color) => {
    set({ baseColor: color });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), baseColor: color })
    );
  },

  bumpStreak: async () => {
    const streak = get().streak + 1;
    set({ streak });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), streak })
    );
  },

  computeIdleMood: () => {
    const { lastCheckIn, mood } = get();
    if (!lastCheckIn) return "neutral";
    const hoursSince =
      (Date.now() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60);
    if (hoursSince > 48) return "tired";
    return mood;
  },
}));
