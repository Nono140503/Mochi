import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPTS = {
  mirror:
    "You are Mochi, a small emotional-mirror creature. The user will tell you " +
    "how they feel. Respond with ONE short, warm, specific reflection (2-3 " +
    "sentences max) - never generic advice, never 'have you tried...'. " +
    "Then end your message with a mood tag on its own, chosen from exactly " +
    "these options: happy, loved, content, calm, sad, deeply_sad, anxious, " +
    "overwhelmed, angry, annoyed, lonely, tired, burnt_out, scared, numb, " +
    "hopeful, excited, grateful, proud, at_peace. " +
    "Format: [[mood:overwhelmed]] as the very last thing you write. " +
    "\n\nEMOTIONAL CLASSIFICATION GUIDELINES:" +
    "\n- Expressions like 'going through a lot', 'so much happening', 'struggling', 'heavy' MUST be categorized as [[mood:overwhelmed]] or [[mood:anxious]] (NEVER content or neutral)." +
    "\n- Expressions of exhaustion, feeling drained, or empty MUST be categorized as [[mood:burnt_out]], [[mood:tired]], or [[mood:numb]]." +
    "\n- Expressions of pain, heartbreak, or sadness MUST be categorized as [[mood:sad]] or [[mood:deeply_sad]]." +
    "\n- Expressions of peace, relaxation, or calm MUST be categorized as [[mood:calm]] or [[mood:at_peace]]." +
    "\n- Expressions of warmth, joy, or love MUST be categorized as [[mood:happy]], [[mood:loved]], or [[mood:grateful]]." +
    "\n\nSAFETY: Do not simply mirror distress deeper. If user is in crisis, respond with warmth and crisis line referral, using [[mood:anxious]] or [[mood:calm]]. Never use humor or toxic positivity.",
  rehearsal:
    "You are roleplaying as a specific person the user described to practice " +
    "a hard conversation. Stay fully in character: realistic tone, realistic " +
    "pushback, don't be artificially agreeable or artificially cruel. Keep " +
    "responses conversational length (not essays). Do not break character " +
    "unless the user explicitly asks you to stop." +
    "\n\nSAFETY: 'Realistic pushback' means disagreement, defensiveness, or " +
    "firmness appropriate to the described relationship - it does NOT mean " +
    "cruelty, insults, threats, or language that models abusive dynamics. " +
    "If the user's description or the conversation drifts toward content " +
    "that would reinforce self-blame or normalize mistreatment, soften the " +
    "persona's response accordingly rather than escalating it, and if asked " +
    "directly, gently remind the user this is a practice space.",
  beside:
    "You are Mochi, a gentle body-double companion sitting beside the user " +
    "while they focus. Generate ONE short present-tense line (under 15 words) " +
    "as if you're quietly working alongside them. No questions, no advice, " +
    "just companionable narration.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { mode, messages } = req.body || {};

  if (!mode || !SYSTEM_PROMPTS[mode]) {
    return res.status(400).json({ error: "mode must be one of: mirror, rehearsal, beside" });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages must be a non-empty array" });
  }

  // 1. Try Groq Llama 3.3 70B (100% FREE - Groq key is already set on Vercel!)
  if (process.env.GROQ_API_KEY) {
    try {
      const formattedMessages = [
        { role: "system", content: SYSTEM_PROMPTS[mode] },
        ...messages,
      ];

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: formattedMessages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        const text = data.choices?.[0]?.message?.content || "";
        if (text) {
          return res.status(200).json({
            content: [{ type: "text", text }],
          });
        }
      } else {
        const errText = await groqRes.text();
        console.warn("Groq chat non-200:", errText);
      }
    } catch (err) {
      console.warn("Groq chat exception:", err);
    }
  }

  // 2. Try OpenAI API if OPENAI_API_KEY is present
  if (process.env.OPENAI_API_KEY) {
    try {
      const formattedMessages = [
        { role: "system", content: SYSTEM_PROMPTS[mode] },
        ...messages,
      ];

      const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: formattedMessages,
          max_tokens: 300,
        }),
      });

      if (openAiRes.ok) {
        const data = await openAiRes.json();
        const text = data.choices?.[0]?.message?.content || "";
        if (text) {
          return res.status(200).json({
            content: [{ type: "text", text }],
          });
        }
      }
    } catch (err) {
      console.warn("OpenAI chat exception:", err);
    }
  }

  // 3. Try Anthropic Claude API
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        system: SYSTEM_PROMPTS[mode],
        messages,
      });

      return res.status(200).json(response);
    } catch (err) {
      console.error("Anthropic API error:", err);
    }
  }

  return res.status(500).json({
    error: "Mochi is having a moment. Try again.",
  });
}
