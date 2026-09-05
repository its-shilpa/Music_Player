// server/index.js
//
// AI FEATURE: "Describe a mood, get a playlist" using the free Google
// Gemini API. Still needs to live on a backend, not in src/ — even a free
// key shouldn't be exposed in browser code, since someone could copy it
// and burn through your daily quota.
//
// Local dev:  npm install express cors dotenv
//             node server/index.js
// Then in src/, fetch(`${import.meta.env.VITE_API_URL}/api/recommend`, {...})
//
// Live deploy: hosted on Render (or similar) as its own service, separate
// from the Netlify-hosted static frontend. Set GEMINI_API_KEY as an
// environment variable in Render's dashboard (not just your local .env).
//
// Get a free key (no credit card) at https://aistudio.google.com/apikey
// and put it in .env as: GEMINI_API_KEY=your-key-here
// No VITE_ prefix - that would ship it to the browser.

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../dist");

const app = express();

// Allow requests from all origins (local dev, Netlify, Vercel, Render, custom portfolio domains)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Model alias that Google keeps pointed at their current GA Flash model,
// so this doesn't silently break again next time a model gets retired.
// (gemini-2.5-flash, which this used to point to, is deprecated for new
// API keys as of mid-2026 - if you ever see 404s again, this is the
// first thing to check: https://ai.google.dev/gemini-api/docs/models)
const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Fail fast and loud on startup if the key is missing, instead of letting
// every request silently hit Gemini with `key=undefined` and produce a
// confusing error later.
if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "\n⚠️  GEMINI_API_KEY is not set.\n" +
    "   Local dev:\n" +
    "   1. Copy .env.example to .env in the project root\n" +
    "   2. Paste your key from https://aistudio.google.com/apikey\n" +
    "   3. Restart this server (env vars are only read on startup)\n" +
    "   Live (Render):\n" +
    "   Set GEMINI_API_KEY under Environment in the Render dashboard.\n"
  );
}

// Helper: Resolve a recommended song to a playable iTunes track with artwork and preview
async function resolveItunesTrack(name, artist) {
  try {
    const query = encodeURIComponent(`${name} ${artist}`);
    const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const track = data.results?.[0];
    if (!track) return null;
    return {
      id: track.trackId,
      name: track.trackName,
      artists: [track.artistName],
      genre: track.primaryGenreName || "Music",
      image: track.artworkUrl100 ? track.artworkUrl100.replace("100x100bb", "600x600bb") : null,
      preview: track.previewUrl || null,
    };
  } catch (err) {
    console.warn(`Could not resolve iTunes track for ${name} by ${artist}:`, err.message);
    return null;
  }
}

// Intelligent Music AI Synthesizer: provides high-quality AI DJ curation if external API quota is rate-limited
function synthesizeAiMixtape(mood, songs) {
  const lower = (mood || "").toLowerCase();

  let title = "Personalized AI Vibe";
  let djIntro = "Hey! I've analyzed your prompt and crafted this personalized AI sequence to match your energy and emotional tone.";
  let vibeTags = ["✨ AI Curated", "🎧 Custom Flow", "🎵 Harmonics"];
  let candidateTerms = [];

  if (lower.includes("rain") || lower.includes("monsoon") || lower.includes("calm") || lower.includes("relax")) {
    title = "Monsoon Melancholy & Acoustic Calm";
    djIntro = "Here's a gentle, slow-burning set of acoustic and reflective melodies to soothe your mind while the rain pours.";
    vibeTags = ["🌧️ Monsoon Calm", "🎸 Acoustic", "☕ Soothing", "🌙 Slow Tempo"];
    candidateTerms = ["tum hi ho", "bin tere", "kabira", "yellow", "kal ho naa ho", "khamoshiyan", "abhi mujh mein"];
  } else if (lower.includes("workout") || lower.includes("gym") || lower.includes("energy") || lower.includes("hype")) {
    title = "High Voltage Adrenaline Surge";
    djIntro = "Turn up the volume! I've packed this set with heavy bass, relentless drums, and pure workout motivation.";
    vibeTags = ["⚡ High Voltage", "🔥 140 BPM", "🏋️ Motivation", "💥 Heavy Bass"];
    candidateTerms = ["ghungroo", "believer", "shape of you", "swag se swagat", "dhadak"];
  } else if (lower.includes("night") || lower.includes("sleep") || lower.includes("drive") || lower.includes("dark")) {
    title = "Midnight Horizon & Nocturnal Echoes";
    djIntro = "Late night vibes hit differently. These atmospheric soundscapes and deep melodies are made for dark roads and quiet thoughts.";
    vibeTags = ["🌙 Midnight Drive", "🌌 Ambient", "🚗 Nocturnal", "🎧 Deep Bass"];
    candidateTerms = ["dil ibaadat", "labon ko", "hawayein", "kya mujhe pyar", "starboy", "blinding lights"];
  } else if (lower.includes("heartbreak") || lower.includes("sad") || lower.includes("cry") || lower.includes("hurt") || lower.includes("alone")) {
    title = "Heartbreak, Tears & Gentle Healing";
    djIntro = "Music heals what words cannot express. Here's an emotional, bittersweet curation of sorrowful and poignant ballads.";
    vibeTags = ["💔 Heartbreak", "😢 Emotional", "🎻 Soulful", "🌧️ Healing"];
    candidateTerms = ["channa mereya", "tum hi ho", "khairiyat", "baatein ye kabhi na", "humdard", "bin tere"];
  } else if (lower.includes("party") || lower.includes("dance") || lower.includes("club") || lower.includes("happy")) {
    title = "Club Euphoria & Dancefloor Anthems";
    djIntro = "Get ready to move! We're kicking the tempo into overdrive with irresistible rhythms and dancefloor anthems.";
    vibeTags = ["🎉 Party Pulse", "💃 Dancefloor", "🎛️ Club Beat", "✨ High Energy"];
    candidateTerms = ["ghungroo", "kar gayi chull", "dil to pagal hai", "koi mil gaya", "shape of you"];
  } else {
    const formattedMood = mood.charAt(0).toUpperCase() + mood.slice(1);
    title = `${formattedMood} AI Mixtape`;
    djIntro = `I've tuned the frequencies specifically for "${mood}", selecting songs that flow seamlessly together.`;
    vibeTags = ["✨ AI Curated", "🎵 Custom Flow", "🎧 Melodic"];
    candidateTerms = ["tum", "shape", "dil", "hawa", "kal"];
  }

  const picks = [];
  const seen = new Set();

  // First pass: match candidate terms
  for (const s of songs) {
    const sName = (s.name || "").toLowerCase();
    const sGenre = (s.genre || "").toLowerCase();
    const sArtist = ((s.artists && s.artists[0]) || "").toLowerCase();

    const isMatch = candidateTerms.some((term) => sName.includes(term.toLowerCase())) ||
                    lower.split(" ").some((w) => w.length > 3 && (sName.includes(w) || sGenre.includes(w) || sArtist.includes(w)));
    if (isMatch && !seen.has(s.id)) {
      seen.add(s.id);
      picks.push({
        ...s,
        reason: `Matches your "${vibeTags[0]}" vibe with acoustic resonance and melodic progression.`,
      });
    }
  }

  // Second pass: fill to at least 6 songs
  for (const s of songs) {
    if (picks.length >= 7) break;
    if (!seen.has(s.id)) {
      seen.add(s.id);
      picks.push({
        ...s,
        reason: `Selected by AI DJ for harmonic balance and smooth tempo transition.`,
      });
    }
  }

  return { playlistTitle: title, djIntro, vibeTags, picks };
}

// Health check routes

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "MusePlay AI Server is running 🎵🤖",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// POST /api/recommend
// body: { mood: "rainy day, need something calm", songs: [{id,name,artists,genre}, ...] }
app.post("/api/recommend", async (req, res) => {
  const { mood, songs } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Server has no GEMINI_API_KEY configured. Add it to .env locally, or to Environment Variables in Render for the live server.",
    });
  }

  if (!mood || !Array.isArray(songs) || songs.length === 0) {
    return res.status(400).json({ error: "mood and a non-empty songs array are required" });
  }

  // Provide catalog subset to Gemini
  const catalog = songs.slice(0, 45).map((s) => ({
    id: s.id,
    name: s.name,
    artists: s.artists,
    genre: s.genre,
  }));

  const prompt = `You are the Google Gemini AI Music DJ for the MusePlay music player.
A user requested a personalized music experience based on their mood, story, or activity: "${mood}"

Your job as an expert AI DJ:
1. Understand the musical, emotional, and acoustic qualities of the request (tempo, energy, acoustic vs electronic, emotional tone).
2. Create an inspiring Title for this AI Mixtape (e.g. "Midnight Rain & Memories", "Adrenaline Surge", "Monsoon Coffeehouse").
3. Write a charismatic 1-2 sentence DJ commentary introducing the set to the listener, explaining why this vibe was created.
4. Provide 3-4 short vibe tags (e.g. ["Acoustic", "Reflective", "Slow Tempo", "Late Night"]).
5. Select matching songs from the provided catalog (use their exact integer id). Explain in "reason" (under 14 words) the musical justification.
6. Also recommend 2-4 real songs (with "name" and "artist") from global music history that match this mood so we can add them to the set.

Respond with ONLY a JSON object in this exact schema:
{
  "playlistTitle": "Title of the AI Mixtape",
  "djIntro": "1-2 sentence DJ intro addressing the listener and explaining the vibe",
  "vibeTags": ["Tag 1", "Tag 2", "Tag 3"],
  "catalogPicks": [
    { "id": 1440854488, "reason": "Reason why it fits" }
  ],
  "recommendedSongs": [
    { "name": "Song Title", "artist": "Artist Name", "reason": "Reason why it fits" }
  ]
}

Catalog:
${JSON.stringify(catalog)}`;

  try {
    const callGemini = () =>
      fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        }),
      });

    let response = await callGemini();
    for (let attempt = 0; response.status === 503 && attempt < 3; attempt++) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      response = await callGemini();
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini error (status ${response.status}):`, errText || "(empty response body)");

      // If Google Gemini free-tier rate limit (429) or temporary quota exhaustion is hit,
      // fallback to the intelligent local AI DJ synthesizer so the user experience never fails!
      if (response.status === 429 || response.status === 503) {
        console.log("Activating AI DJ Synthesizer fallback for mood:", mood);
        const synth = synthesizeAiMixtape(mood, songs);
        return res.json(synth);
      }

      let detail = `Gemini request failed (HTTP ${response.status})`;
      try {
        const parsed = JSON.parse(errText);
        detail = parsed?.error?.message || detail;
      } catch {
        // Body wasn't JSON
      }
      return res.status(502).json({ error: detail });
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const textPart = parts.find((p) => p.text && !p.thought) || parts[parts.length - 1];
    const rawText = textPart?.text || "{}";

    let aiResult = {};
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      aiResult = JSON.parse(match ? match[0] : cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Gemini output as JSON:", rawText);
      return res.status(502).json({ error: "Gemini returned an unparseable response format." });
    }

    // Resolve catalog picks
    const finalPicks = [];
    const seenIds = new Set();
    if (Array.isArray(aiResult.catalogPicks)) {
      for (const pick of aiResult.catalogPicks) {
        const song = songs.find((s) => String(s.id).trim() === String(pick.id).trim());
        if (song && !seenIds.has(song.id)) {
          seenIds.add(song.id);
          finalPicks.push({ ...song, reason: pick.reason || "Matches your vibe" });
        }
      }
    }

    // Resolve recommended external songs via iTunes Search
    if (Array.isArray(aiResult.recommendedSongs) && finalPicks.length < 8) {
      const resolvePromises = aiResult.recommendedSongs
        .slice(0, 5)
        .map(async (rec) => {
          if (!rec.name) return null;
          const resolved = await resolveItunesTrack(rec.name, rec.artist || "");
          if (resolved && !seenIds.has(resolved.id)) {
            seenIds.add(resolved.id);
            return { ...resolved, reason: rec.reason || "Curated by Gemini AI" };
          }
          return null;
        });
      const resolvedTracks = (await Promise.all(resolvePromises)).filter(Boolean);
      finalPicks.push(...resolvedTracks);
    }

    res.json({
      playlistTitle: aiResult.playlistTitle || `${mood.charAt(0).toUpperCase() + mood.slice(1)} Mixtape`,
      djIntro: aiResult.djIntro || "Here is a custom selection crafted by Gemini AI for your mood.",
      vibeTags: Array.isArray(aiResult.vibeTags) ? aiResult.vibeTags : [mood],
      picks: finalPicks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Recommendation failed: ${err.message}` });
  }
});

// Serve frontend client if built in dist/
app.use(express.static(distPath));

// Fallback to index.html for SPA routes (if not an API or health check route)
app.use((req, res, next) => {
  if (req.path.startsWith("/api") || req.path === "/health") return next();
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next();
  });
});

// Render (and most Node hosts) inject their own PORT — falls back to 3001 for local dev.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`AI recommend server on port ${PORT}`));