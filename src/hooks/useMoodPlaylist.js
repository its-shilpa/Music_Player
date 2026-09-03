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

const RECOMMEND_URL = "http://localhost:3001/api/recommend";

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
      const res = await fetch(RECOMMEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: queryMood, songs }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Couldn't reach the AI recommendation server.");
      }

      setPlaylistTitle(data.playlistTitle || `${queryMood} Mixtape`);
      setDjIntro(data.djIntro || "");
      setVibeTags(Array.isArray(data.vibeTags) ? data.vibeTags : []);

      const resolved = (data.picks || []).map((p) => {
        // If the server already resolved the full song object (with image, preview, name)
        if (p.name && p.preview) {
          return { ...p, song: p };
        }
        // Otherwise look up in catalog
        const found = songs.find((s) => String(s.id).trim() === String(p.id).trim());
        return { ...p, song: found || p };
      }).filter((p) => p.song && (p.song.name || p.name));

      if (resolved.length === 0) {
        setError("No matching songs found for that mood — try another vibe or description!");
      }
      setPicks(resolved);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Can't reach the AI server. Is `node server/index.js` running?"
          : err.message
      );
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