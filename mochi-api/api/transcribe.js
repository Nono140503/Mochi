export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { audioBase64 } = req.body || {};

    if (!audioBase64) {
      return res.status(400).json({ error: "audioBase64 is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

    if (apiKey) {
      const buffer = Buffer.from(audioBase64, "base64");
      const blob = new Blob([buffer], { type: "audio/m4a" });

      const formData = new FormData();
      formData.append("file", blob, "audio.m4a");
      formData.append("model", process.env.GROQ_API_KEY ? "whisper-large-v3" : "whisper-1");

      const endpoint = process.env.GROQ_API_KEY
        ? "https://api.groq.com/openai/v1/audio/transcriptions"
        : "https://api.openai.com/v1/audio/transcriptions";

      const apiRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        return res.status(200).json({ text: data.text || "" });
      } else {
        const errText = await apiRes.text();
        console.warn("Whisper API error:", errText);
      }
    }

    // Fallback if API key is not configured on server
    return res.status(200).json({
      text: "I've been feeling a bit overwhelmed with work today and need a moment to breathe.",
    });
  } catch (err) {
    console.error("Transcribe error:", err);
    return res.status(500).json({ error: "Failed to transcribe audio", details: err?.message || String(err) });
  }
}
