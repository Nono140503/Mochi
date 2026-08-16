module.exports = async function handler(req, res) {
  try {
    // 1. Try justmeme.wtf AI meme API first
    const jmRes = await fetch("https://justmeme.wtf/api/ai-meme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "funny relatable work life productivity wholesome meme" }),
    });

    if (jmRes.ok) {
      const data = await jmRes.json();
      if (data?.template?.img) {
        const imgUrl = data.template.img.startsWith("http")
          ? data.template.img
          : `https://justmeme.wtf${data.template.img}`;
        return res.status(200).json({
          title: data.template.name || "Mochi's Meme of the Day",
          topText: data.top || "",
          bottomText: data.bottom || "",
          imageUrl: imgUrl,
          source: "justmeme.wtf",
        });
      }
    }

    // 2. Fallback to Wholesome Memes API
    const redditRes = await fetch("https://meme-api.com/gimme/wholesomememes");
    if (redditRes.ok) {
      const rData = await redditRes.json();
      if (rData.url) {
        return res.status(200).json({
          title: rData.title || "Daily Laugh",
          topText: rData.subreddit ? `r/${rData.subreddit}` : "",
          bottomText: rData.author ? `by u/${rData.author}` : "",
          imageUrl: rData.url,
          source: "Reddit",
        });
      }
    }
  } catch (err) {
    console.warn("Meme API error:", err);
  }

  // 3. Guaranteed offline static meme fallback
  return res.status(200).json({
    title: "Me opening my laptop to be productive...",
    topText: "Opening my laptop to work",
    bottomText: "Staring at Mochi for 30 minutes instead",
    imageUrl: "https://i.imgur.com/W38G7Z4.jpeg",
    source: "justmeme.wtf",
  });
}
