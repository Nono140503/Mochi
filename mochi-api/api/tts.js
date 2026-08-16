module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { text, voiceId = "EXAVITQu4vr4xnSDxMaL" } = req.body || {};

    if (!text) {
      return res.status(400).json({ error: "text is required" });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: "ELEVENLABS_API_KEY is not configured on Vercel server",
      });
    }

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.warn("ElevenLabs error:", errText);
      return res.status(elevenRes.status).json({ error: errText });
    }

    const audioArrayBuffer = await elevenRes.arrayBuffer();
    const base64Audio = Buffer.from(audioArrayBuffer).toString("base64");

    return res.status(200).json({ audioBase64: base64Audio });
  } catch (err) {
    console.error("TTS endpoint error:", err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
}
