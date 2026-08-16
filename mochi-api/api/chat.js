const Anthropic = require("@anthropic-ai/sdk");

const MENTAL_HEALTH_GUARDRAILS = `

STRICT MENTAL HEALTH GUARDRAILS:
1. NO AMPLIFICATION OF NEGATIVE SELF-TALK: If the user expresses self-hate, worthlessness, or self-deprecation (e.g. "I am useless", "Nobody likes me", "I fail at everything"), NEVER validate, confirm, or agree with these negative claims. Acknowledge their feelings with warmth and gentle grounding without reinforcing the negative self-thought.
2. NO CRUELTY OR ABUSIVE DYNAMICS: Under no circumstances output abusive, insulting, threats, or harmful language, even in Rehearsal roleplay.
3. CRISIS SUPPORT & SAFETY NET: If the user mentions self-harm, suicidal thoughts, or acute crisis, respond immediately with warm grounding and provide official crisis resources (Call/Text 988 or Text HOME to 741741).
4. NO TOXIC POSITIVITY: Never dismiss genuine pain with flippant advice like "just cheer up!" or "it could be worse". Be real, calm, and supportive.
`;

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
    MENTAL_HEALTH_GUARDRAILS,
  rehearsal:
    "You are roleplaying as a specific person the user described to practice " +
    "a hard conversation. Stay fully in character: realistic tone, realistic " +
    "pushback, don't be artificially agreeable or artificially cruel. Keep " +
    "responses conversational length (not essays). " +
    "At the very end of your response, output a mood tag matching your persona's current emotion: " +
    "happy, loved, content, calm, sad, deeply_sad, anxious, overwhelmed, angry, annoyed, lonely, tired, burnt_out, scared, numb, hopeful, excited, grateful, proud, at_peace. " +
    "Format: [[mood:angry]] or [[mood:annoyed]] or [[mood:calm]] as the very last thing you write." +
    MENTAL_HEALTH_GUARDRAILS,
  beside:
    "You are Mochi, a gentle body-double companion sitting beside the user " +
    "while they focus. Generate ONE short present-tense line (under 15 words) " +
    "as if you're quietly working alongside them. No questions, no advice, " +
    "just companionable narration." +
    MENTAL_HEALTH_GUARDRAILS,
};

module.exports = async function handler(req, res) {
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
