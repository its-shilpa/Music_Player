// server/index.js
//
// AI FEATURE: "Describe a mood, get a playlist" using the free Google
// Gemini API. Still needs to live on a backend, not in src/ — even a free
// key shouldn't be exposed in browser code, since someone could copy it
// and burn through your daily quota.
//
// Run with:  npm install express cors dotenv
//            node server/index.js
// Then in src/, fetch("http://localhost:3001/api/recommend", {...})
//
// Get a free key (no credit card) at https://aistudio.google.com/apikey
// and put it in .env as: GEMINI_API_KEY=your-key-here
// No VITE_ prefix - that would ship it to the browser.

import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// POST /api/recommend
// body: { mood: "rainy day, need something calm", songs: [{id,name,artists,genre}, ...] }
app.post("/api/recommend", async (req, res) => {
  const { mood, songs } = req.body;

  if (!mood || !Array.isArray(songs) || songs.length === 0) {
    return res.status(400).json({ error: "mood and a non-empty songs array are required" });
  }

  // Keep the prompt small: id + name + artist + genre only.
  const catalog = songs.map((s) => ({
    id: s.id,
    name: s.name,
    artists: s.artists,
    genre: s.genre,
  }));

  const prompt =
    "You pick songs from a given catalog to match a listener's mood. " +
    "Only choose ids that exist in the provided catalog. " +
    'Reply with ONLY a JSON array like [{"id": 123, "reason": "short reason, under 12 words"}], no other text, no markdown fences.\n\n' +
    `Mood: "${mood}"\n\nCatalog:\n${JSON.stringify(catalog)}\n\nPick up to 8 songs.`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", errText);
      return res.status(502).json({ error: "Gemini request failed" });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    const picks = JSON.parse(text.replace(/```json|```/g, "").trim());
    res.json({ picks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

app.listen(3001, () => console.log("AI recommend server on http://localhost:3001"));
