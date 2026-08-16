const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { text } = req.body || {};

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "text must be a non-empty string" });
    }

    // Sanitize & limit text to max 1,000 characters to prevent memory/buffer overflow
    const cleanText = text.trim().slice(0, 1000);

    // 1. Primary: Microsoft Edge Neural Voice (Ava - Ultra Natural, 100% Free, Zero Card/Key Required!)
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata("en-US-AvaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      const { audioStream } = await tts.toStream(cleanText);

      const audioBuffer = await new Promise((resolve, reject) => {
        const chunks = [];
        audioStream.on("data", (chunk) => chunks.push(chunk));
        audioStream.on("end", () => resolve(Buffer.concat(chunks)));
        audioStream.on("error", (err) => reject(err));
      });

      tts.close();

      if (audioBuffer && audioBuffer.length > 0) {
        const base64Audio = audioBuffer.toString("base64");
        return res.status(200).json({ audioBase64: base64Audio });
      }
    } catch (e) {
      console.warn("Edge Neural TTS exception, attempting fallback:", e);
    }

    // 2. Guaranteed Fallback: Google Audio Stream (100% Free, Zero Key/Card Required)
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(cleanText.slice(0, 200))}`;
    const gRes = await fetch(googleUrl);
    if (gRes.ok) {
      const audioArrayBuffer = await gRes.arrayBuffer();
      const base64Audio = Buffer.from(audioArrayBuffer).toString("base64");
      return res.status(200).json({ audioBase64: base64Audio });
    }

    return res.status(500).json({ error: "Failed to generate speech audio" });
  } catch (err) {
    console.error("TTS endpoint error:", err);
    return res.status(500).json({ error: "Speech synthesis error" });
  }
};
