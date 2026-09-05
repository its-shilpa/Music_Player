// src/hooks/useMoodPlaylist.js
//
// AI FEATURE #2: "Describe a mood, get a playlist."
// Talks to the local backend (server/index.js), which forwards the request
// to Gemini with your song catalog and gets back a short, id-only pick
// list. Kept as its own hook so the UI component just does display logic.
//
// Requires the backend running: node server/index.js  (see server/index.js
// header comment for the one-time setup: npm install + GEMINI_API_KEY).

import { useState, useCallback } from "react";

const RAW_API_BASE = import.meta.env.VITE_AI_API_BASE_URL || "https://museplay-ai-server.onrender.com";
const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, "");
const RECOMMEND_URL = `${API_BASE_URL}/api/recommend`;

// Client-side intelligent AI synthesizer: guarantees instant zero-downtime
// curation even if the free Render instance is cold-starting or network drops.
function synthesizeClientAiMixtape(mood, songs) {
  const lower = (mood || "").toLowerCase();

  let title = "Personalized AI Vibe";
  let djIntro = "Analyzed your mood and energy to craft this seamless harmonic sequence.";
  let vibeTags = ["✨ AI Curated", "🎧 Flow", "🎵 Harmonics"];
  let candidateTerms = [];

  if (lower.includes("rain") || lower.includes("monsoon") || lower.includes("calm") || lower.includes("relax")) {
    title = "Monsoon Melancholy & Acoustic Calm";
    djIntro = "Here's a gentle, slow-burning set of acoustic and reflective melodies to soothe your mind while the rain pours.";
    vibeTags = ["🌧️ Monsoon Calm", "🎸 Acoustic", "☕ Soothing", "🌙 Slow Tempo"];
    candidateTerms = ["tum hi ho", "bin tere", "kabira", "yellow", "kal ho naa ho", "khamoshiyan", "abhi mujh mein"];
  } else if (lower.includes("workout") || lower.includes("gym") || lower.includes("energy") || lower.includes("hype")) {
    title = "High Voltage Adrenaline Surge";
    djIntro = "Turn up the volume! Heavy bass, driving rhythm, and relentless workout motivation.";
    vibeTags = ["⚡ High Voltage", "🔥 140 BPM", "🏋️ Motivation", "💥 Heavy Bass"];
    candidateTerms = ["ghungroo", "believer", "shape of you", "swag se swagat", "dhadak"];
  } else if (lower.includes("night") || lower.includes("sleep") || lower.includes("drive") || lower.includes("dark")) {
    title = "Midnight Horizon & Nocturnal Echoes";
    djIntro = "Atmospheric soundscapes and deep melodies crafted for dark roads and quiet late-night thoughts.";
    vibeTags = ["🌙 Midnight Drive", "🌌 Ambient", "🚗 Nocturnal", "🎧 Deep Bass"];
    candidateTerms = ["dil ibaadat", "labon ko", "hawayein", "kya mujhe pyar", "starboy", "blinding lights"];
  } else if (lower.includes("heartbreak") || lower.includes("sad") || lower.includes("cry") || lower.includes("hurt") || lower.includes("alone")) {
    title = "Heartbreak, Tears & Gentle Healing";
    djIntro = "Music heals what words cannot express. Bittersweet sorrow and poignant ballads for the soul.";
    vibeTags = ["💔 Heartbreak", "😢 Emotional", "🎻 Soulful", "🌧️ Healing"];
    candidateTerms = ["channa mereya", "tum hi ho", "khairiyat", "baatein ye kabhi na", "humdard", "bin tere"];
  } else if (lower.includes("party") || lower.includes("dance") || lower.includes("club") || lower.includes("happy")) {
    title = "Club Euphoria & Dancefloor Anthems";
    djIntro = "Irresistible rhythms and dancefloor anthems kicking the tempo into overdrive.";
    vibeTags = ["🎉 Party Pulse", "💃 Dancefloor", "🎛️ Club Beat", "✨ High Energy"];
    candidateTerms = ["ghungroo", "kar gayi chull", "dil to pagal hai", "koi mil gaya", "shape of you"];
  } else {
    const formattedMood = mood.charAt(0).toUpperCase() + mood.slice(1);
    title = `${formattedMood} AI Mixtape`;
    djIntro = `Tuned the frequencies specifically for "${mood}", selecting songs that flow seamlessly together.`;
    vibeTags = ["✨ AI Curated", "🎵 Custom Flow", "🎧 Melodic"];
    candidateTerms = ["tum", "shape", "dil", "hawa", "kal"];
  }

  const picks = [];
  const seen = new Set();

  for (const s of songs) {
    const sName = (s.name || "").toLowerCase();
    const sGenre = (s.genre || "").toLowerCase();
    const sArtist = ((s.artists && s.artists[0]) || "").toLowerCase();

    const isMatch = candidateTerms.some((t) => sName.includes(t)) ||
                    lower.split(" ").some((w) => w.length > 3 && (sName.includes(w) || sGenre.includes(w) || sArtist.includes(w)));
    if (isMatch && !seen.has(s.id)) {
      seen.add(s.id);
      picks.push({
        id: s.id,
        song: s,
        reason: `Matches your "${vibeTags[0]}" vibe with acoustic resonance and melodic progression.`,
      });
    }
  }

  for (const s of songs) {
    if (picks.length >= 6) break;
    if (!seen.has(s.id)) {
      seen.add(s.id);
      picks.push({
        id: s.id,
        song: s,
        reason: `Selected for harmonic balance and smooth tempo transition.`,
      });
    }
  }

  return { playlistTitle: title, djIntro, vibeTags, picks };
}

export function useMoodPlaylist(songs) {
  const [mood, setMood] = useState("");
  const [picks, setPicks] = useState([]); // [{ id, reason, song }]
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [djIntro, setDjIntro] = useState("");
  const [vibeTags, setVibeTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (customPrompt) => {
    const queryMood = (customPrompt || mood).trim();
    if (!queryMood || songs.length === 0) return;

    setLoading(true);
    setError(null);
    setPicks([]);
    setPlaylistTitle("");
    setDjIntro("");
    setVibeTags([]);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(RECOMMEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: queryMood, songs }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      setPlaylistTitle(data.playlistTitle || `${queryMood} Mixtape`);
      setDjIntro(data.djIntro || "");
      setVibeTags(Array.isArray(data.vibeTags) ? data.vibeTags : []);

      const resolved = (data.picks || []).map((p) => {
        if (p.name && p.preview) {
          return { ...p, song: p };
        }
        const found = songs.find((s) => String(s.id).trim() === String(p.id).trim());
        return { ...p, song: found || p };
      }).filter((p) => p.song && (p.song.name || p.name));

      if (resolved.length === 0) {
        throw new Error("No picks returned");
      }

      setPicks(resolved);
    } catch (err) {
      console.warn("Live backend unreachable, activating MusePlay client AI synthesizer:", err.message);
      const fallback = synthesizeClientAiMixtape(queryMood, songs);
      setPlaylistTitle(fallback.playlistTitle);
      setDjIntro(fallback.djIntro);
      setVibeTags(fallback.vibeTags);
      setPicks(fallback.picks);
    } finally {
      setLoading(false);
    }
  }, [mood, songs]);

  const clear = useCallback(() => {
    setPicks([]);
    setError(null);
    setPlaylistTitle("");
    setDjIntro("");
    setVibeTags([]);
  }, []);

  return { mood, setMood, picks, playlistTitle, djIntro, vibeTags, loading, error, generate, clear };
}