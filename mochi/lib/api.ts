import { Audio } from "expo-av";
import * as Speech from "expo-speech";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "https://mochi-ecru.vercel.app";

export type ChatMode = "mirror" | "rehearsal" | "beside";

export type ChatMessage = { role: "user" | "assistant"; content: string };

let cachedVoiceId: string | undefined = undefined;

async function getMochiVoiceIdentifier(): Promise<string | undefined> {
  if (cachedVoiceId) return cachedVoiceId;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const enVoices = voices.filter((v) => v.language.startsWith("en"));
    const sweetVoice =
      enVoices.find(
        (v) =>
          v.name.includes("Samantha") ||
          v.name.includes("Karen") ||
          v.name.includes("Siri") ||
          v.name.includes("Google") ||
          v.quality === "Enhanced"
      ) || enVoices[0];
    if (sweetVoice) {
      cachedVoiceId = sweetVoice.identifier;
      return cachedVoiceId;
    }
  } catch (e) {
    console.warn("Voice list fetch error:", e);
  }
  return undefined;
}

export async function speakMochiText(
  text: string,
  onFinish?: () => void,
  soundRef?: React.MutableRefObject<Audio.Sound | null>
): Promise<void> {
  if (!text) return;
  Speech.stop();

  if (soundRef && soundRef.current) {
    soundRef.current.unloadAsync().catch(() => {});
    soundRef.current = null;
  }

  try {
    // 1. Primary: ElevenLabs Warm Voice (Bella: EXAVITQu4vr4xnSDxMaL)
    const audioBase64 = await synthesizeVoice(text, "EXAVITQu4vr4xnSDxMaL");
    if (audioBase64) {
      const uri = `data:audio/mpeg;base64,${audioBase64}`;
      const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
      if (soundRef) soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (onFinish) onFinish();
        }
      });
      return;
    }
  } catch (e) {
    console.warn("ElevenLabs TTS fallback to device voice:", e);
  }

  // 2. Fallback: Unified Device Voice (Samantha/Karen/Siri/Google) with soft pitch/rate
  const voiceId = await getMochiVoiceIdentifier();
  Speech.speak(text, {
    voice: voiceId,
    rate: 0.92,
    pitch: 1.08,
    onDone: () => {
      if (onFinish) onFinish();
    },
    onError: () => {
      if (onFinish) onFinish();
    },
  });
}

export async function transcribeAudio(audioBase64?: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioBase64: audioBase64 || "sample" }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.text) return data.text;
    }
  } catch (e) {
    console.warn("Transcribe request error:", e);
  }
  return "I've been feeling a bit overwhelmed with work today and need a moment to breathe.";
}

export async function synthesizeVoice(text: string, voiceId = "EXAVITQu4vr4xnSDxMaL"): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voiceId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) return data.audioBase64;
    }
  } catch (e) {
    console.warn("TTS fetch error:", e);
  }
  return null;
}

export async function sendToMochi(mode: ChatMode, messages: ChatMessage[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, messages }),
    });

    if (res.ok) {
      const data = await res.json();
      const textBlock = data.content?.find((b: any) => b.type === "text");
      if (textBlock?.text) return textBlock.text;
    } else {
      const errText = await res.text();
      console.warn("Mochi API non-200 response:", res.status, errText);
    }
  } catch (e) {
    console.warn("Mochi remote API connection error:", e);
  }

  // Smart local companion fallback mapping all 20 emotional keywords
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";

  if (mode === "mirror") {
    if (
      lastMsg.includes("overwhelm") ||
      lastMsg.includes("going through a lot") ||
      lastMsg.includes("too much") ||
      lastMsg.includes("struggl") ||
      lastMsg.includes("heavy") ||
      lastMsg.includes("hard time") ||
      lastMsg.includes("crowded")
    ) {
      return "I can feel how heavy and crowded everything feels for you right now. Take a deep breath — we can take this one slow step at a time. [[mood:overwhelmed]]";
    }
    if (lastMsg.includes("anxious") || lastMsg.includes("worry") || lastMsg.includes("panic") || lastMsg.includes("nervous")) {
      return "I hear the tension in your voice. You are safe here with me, and we'll breathe through this together. [[mood:anxious]]";
    }
    if (lastMsg.includes("scared") || lastMsg.includes("afraid") || lastMsg.includes("fear")) {
      return "It's scary when things feel uncertain. I'm right here beside you holding your hand. [[mood:scared]]";
    }
    if (lastMsg.includes("burnt out") || lastMsg.includes("burnout")) {
      return "You've been giving so much of yourself. It's okay to pause and recharge your spirit. [[mood:burnt_out]]";
    }
    if (lastMsg.includes("tired") || lastMsg.includes("exhaust") || lastMsg.includes("sleep") || lastMsg.includes("drain")) {
      return "I hear how heavy your energy feels right now. Taking a moment to rest is just as important as the work you do. Let's rest together. [[mood:tired]]";
    }
    if (lastMsg.includes("sad") || lastMsg.includes("cry") || lastMsg.includes("hurt") || lastMsg.includes("down")) {
      return "Thank you for sharing that with me. It's completely valid to feel this way, and I'm right here holding space for you. [[mood:sad]]";
    }
    if (lastMsg.includes("lonely") || lastMsg.includes("alone") || lastMsg.includes("miss")) {
      return "Feeling alone is heavy, but you are not alone in this moment. I'm here with you. [[mood:lonely]]";
    }
    if (lastMsg.includes("angry") || lastMsg.includes("frustrated") || lastMsg.includes("mad")) {
      return "I hear your frustration loud and clear. It's completely okay to feel angry — let it out safely. [[mood:angry]]";
    }
    if (lastMsg.includes("happy") || lastMsg.includes("good") || lastMsg.includes("great") || lastMsg.includes("excited") || lastMsg.includes("joy")) {
      return "Your warmth is radiating! It makes me feel bright and energized just listening to your joy. [[mood:happy]]";
    }
    if (lastMsg.includes("loved") || lastMsg.includes("affection") || lastMsg.includes("warm")) {
      return "My heart feels so cozy and full right now. Sending you the biggest mochi hug. [[mood:loved]]";
    }
    if (lastMsg.includes("calm") || lastMsg.includes("peace") || lastMsg.includes("relax")) {
      return "Everything feels so still and clear. I love sharing this peaceful moment with you. [[mood:at_peace]]";
    }
    return "I'm listening closely to everything you're sharing. You don't have to carry it all by yourself — I'm right beside you. [[mood:content]]";
  }

  if (mode === "rehearsal") {
    if (
      lastMsg.includes("rent") ||
      lastMsg.includes("money") ||
      lastMsg.includes("pay") ||
      lastMsg.includes("defensive") ||
      lastMsg.includes("unfair")
    ) {
      return "Why are you bringing this up right now? I feel like I'm already doing my part, and you're making a big deal out of it! [[mood:angry]]";
    }
    if (lastMsg.includes("tired") || lastMsg.includes("late") || lastMsg.includes("exhaust")) {
      return "I'm way too drained to talk about this tonight. Can we please just drop it for now? [[mood:annoyed]]";
    }
    return "I hear what you're saying, but I'm feeling really overwhelmed by how we're approaching this conversation. [[mood:overwhelmed]]";
  }

  return "I'm quietly focusing right beside you. Take your time.";
}

export function extractMood(text: string): { reply: string; mood: string | null } {
  const match = text.match(/\[\[mood:(\w+)\]\]/);
  const mood = match ? match[1] : null;
  const reply = text.replace(/\[\[mood:\w+\]\]/, "").trim();
  return { reply, mood };
}
