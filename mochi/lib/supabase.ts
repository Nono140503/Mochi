import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

let envUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || "").trim();
if (!envUrl.startsWith("http://") && !envUrl.startsWith("https://")) {
  envUrl = "https://placeholder-project.supabase.co";
}
const supabaseUrl = envUrl;
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key").trim();

export const isSupabaseConfigured = () => {
  return (
    Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) &&
    !process.env.EXPO_PUBLIC_SUPABASE_URL?.includes("placeholder") &&
    Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) &&
    !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.includes("placeholder")
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
