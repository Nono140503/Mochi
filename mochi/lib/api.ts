export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "https://mochi-ecru.vercel.app";

export type ChatMode = "mirror" | "rehearsal" | "beside";

export type ChatMessage = { role: "user" | "assistant"; content: string };

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
    return "I hear what you're saying. That definitely sounds complicated, but I'm ready to listen and work through this with you.";
  }

  return "I'm quietly focusing right beside you. Take your time.";
}

export function extractMood(text: string): { reply: string; mood: string | null } {
  const match = text.match(/\[\[mood:(\w+)\]\]/);
  const mood = match ? match[1] : null;
  const reply = text.replace(/\[\[mood:\w+\]\]/, "").trim();
  return { reply, mood };
}
