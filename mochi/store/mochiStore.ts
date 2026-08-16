import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

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

export type HistoryItem = {
  id: string;
  date: string;
  mood: MochiMood;
  note?: string;
  mode?: "mirror" | "rehearsal" | "beside";
};

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
  history: HistoryItem[];
  unlockedMochis: string[]; // IDs of unlocked special Mochi characters
  mochidleStats: {
    played: number;
    won: number;
    streak: number;
    lastPlayedDate: string | null;
  };
  hydrated: boolean;

  hydrate: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  login: (name: string, email?: string) => Promise<void>;
  completeCustomization: (color: string) => Promise<void>;
  logout: () => Promise<void>;
  setMood: (mood: MochiMood, note?: string, mode?: "mirror" | "rehearsal" | "beside") => Promise<void>;
  saveRehearsalSession: (persona?: string, note?: string, transcript?: string) => Promise<void>;
  saveFocusSession: (durationMinutes: number, note?: string) => Promise<void>;
  unlockSpecialMochi: (characterId: string, word: string, guessesTaken: number) => Promise<void>;
  recordMochidleGame: (won: boolean) => Promise<void>;
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
  unlockedMochis: [],
  mochidleStats: { played: 0, won: 0, streak: 0, lastPlayedDate: null },
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};

      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase
            .from("memories")
            .select("*")
            .order("date", { ascending: true })
            .limit(100);

          if (data && data.length > 0) {
            const fetchedHistory: HistoryItem[] = data.map((item: any) => ({
              id: item.id || Math.random().toString(36).substring(2, 9),
              date: item.date || item.created_at,
              mood: (item.mood || "neutral") as MochiMood,
              note: item.note || undefined,
              mode: (item.mode || "mirror") as any,
            }));

            // Find last actual Mirror Mode check-in date
            const lastMirrorCheckIn = [...fetchedHistory]
              .reverse()
              .find((h) => h.mode === "mirror" || !h.mode);

            set({
              ...parsed,
              history: fetchedHistory,
              ...(lastMirrorCheckIn ? { lastCheckIn: lastMirrorCheckIn.date, mood: lastMirrorCheckIn.mood } : {}),
              hydrated: true,
            });
            return;
          }
        } catch (e) {
          console.warn("Failed to fetch memories from Supabase:", e);
        }
      }

      set({ ...parsed, hydrated: true });
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
      hasCustomizedMochi: true,
      ...(isDifferentAccount
        ? {
            history: [],
            lastCheckIn: null,
            streak: 0,
            mood: "neutral" as MochiMood,
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

  setMood: async (mood, note, mode = "mirror") => {
    const now = new Date().toISOString();
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      date: now,
      mood,
      note,
      mode,
    };
    const history = [...get().history, newItem].slice(-100);
    // ONLY update lastCheckIn if mode is mirror
    const isMirrorCheckIn = mode === "mirror";
    const next = {
      mood,
      ...(isMirrorCheckIn ? { lastCheckIn: now } : {}),
      history,
    };
    set(next);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), ...next })
    );

    // Sync to Supabase cloud
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const userRes = await supabase.auth.getUser();
          const userId = userRes.data?.user?.id || null;

          const checkInPayload = {
            ...(userId ? { user_id: userId } : {}),
            mood,
            note: note || null,
          };

          const { error: cErr } = await supabase.from("check_ins").insert(checkInPayload);
          if (cErr) console.warn("Supabase check_ins insert notice:", cErr.message);

          const { error: mErr } = await supabase.from("memories").insert({
            ...(userId ? { user_id: userId } : {}),
            date: now,
            mood,
            note: note || null,
            mode: "mirror",
          });
          if (mErr) console.warn("Supabase memories insert notice:", mErr.message);
        } catch (e) {
          console.warn("Supabase check_ins insert exception:", e);
        }
      })();
    }
  },

  saveRehearsalSession: async (persona, note, transcript) => {
    const now = new Date().toISOString();
    const noteText = note || `Rehearsed conversation with: ${persona || "practice partner"}`;
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      date: now,
      mood: "glowing",
      note: noteText,
      mode: "rehearsal",
    };

    const history = [...get().history, newItem].slice(-100);
    set({ history });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), history })
    );

    // Sync rehearsal session to Supabase rehearsal_sessions and memories tables
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const userRes = await supabase.auth.getUser();
          const userId = userRes.data?.user?.id || null;

          const rehPayload = {
            ...(userId ? { user_id: userId } : {}),
            persona_description: persona || "Practice Partner",
            note: noteText,
          };

          const { error: rErr } = await supabase.from("rehearsal_sessions").insert(rehPayload);
          if (rErr) console.warn("Supabase rehearsal_sessions insert notice:", rErr.message);

          const { error: mErr } = await supabase.from("memories").insert({
            ...(userId ? { user_id: userId } : {}),
            date: now,
            mood: "glowing",
            note: noteText,
            mode: "rehearsal",
          });
          if (mErr) console.warn("Supabase memories insert notice:", mErr.message);
        } catch (e) {
          console.warn("Supabase rehearsal_sessions insert exception:", e);
        }
      })();
    }
  },

  saveFocusSession: async (durationMinutes, note) => {
    const now = new Date().toISOString();
    const noteText = note || `Completed ${durationMinutes}-minute Beside focus session`;
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      date: now,
      mood: "glowing",
      note: noteText,
      mode: "beside",
    };

    const history = [...get().history, newItem].slice(-100);
    set({ history });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), history })
    );

    // Sync focus session to Supabase focus_sessions and memories tables
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const userRes = await supabase.auth.getUser();
          const userId = userRes.data?.user?.id || null;

          const focusPayload = {
            ...(userId ? { user_id: userId } : {}),
            duration_minutes: durationMinutes,
            note: noteText,
          };

          const { error: fErr } = await supabase.from("focus_sessions").insert(focusPayload);
          if (fErr) console.warn("Supabase focus_sessions insert notice:", fErr.message);

          const { error: mErr } = await supabase.from("memories").insert({
            ...(userId ? { user_id: userId } : {}),
            date: now,
            mood: "glowing",
            note: noteText,
            mode: "beside",
          });
          if (mErr) console.warn("Supabase memories insert notice:", mErr.message);
        } catch (e) {
          console.warn("Supabase focus_sessions insert exception:", e);
        }
      })();
    }
  },

  unlockSpecialMochi: async (characterId, word, guessesTaken) => {
    const currentUnlocked = get().unlockedMochis || [];
    if (currentUnlocked.includes(characterId)) return;

    const nextUnlocked = [...currentUnlocked, characterId];
    set({ unlockedMochis: nextUnlocked });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), unlockedMochis: nextUnlocked })
    );

    // Sync to Supabase SQL table mochidle_prizes
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const userRes = await supabase.auth.getUser();
          const userId = userRes.data?.user?.id || null;

          const payload = {
            ...(userId ? { user_id: userId } : {}),
            character_id: characterId,
            word,
            guesses_taken: guessesTaken,
            unlocked_at: new Date().toISOString(),
          };

          const { error } = await supabase.from("mochidle_prizes").insert(payload);
          if (error && !error.message.includes("schema cache") && error.code !== "PGRST205") {
            console.warn("Supabase mochidle_prizes sync notice:", error.message);
          }
        } catch (e) {
          console.warn("Supabase mochidle_prizes insert exception:", e);
        }
      })();
    }
  },

  recordMochidleGame: async (won: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    const prevStats = get().mochidleStats || { played: 0, won: 0, streak: 0, lastPlayedDate: null };
    const played = prevStats.played + 1;
    const wonCount = won ? prevStats.won + 1 : prevStats.won;
    const streak = won ? prevStats.streak + 1 : 0;
    const nextStats = { played, won: wonCount, streak, lastPlayedDate: today };

    set({ mochidleStats: nextStats });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...get(), mochidleStats: nextStats })
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
