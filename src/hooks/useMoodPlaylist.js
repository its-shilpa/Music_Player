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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async () => {
    const trimmed = mood.trim();
    if (!trimmed || songs.length === 0) return;

    setLoading(true);
    setError(null);
    setPicks([]);

    try {
      const res = await fetch(RECOMMEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: trimmed, songs }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't reach the recommendation server.");
      }

      const data = await res.json();
      const resolved = (data.picks || [])
        .map((p) => ({ ...p, song: songs.find((s) => s.id === p.id) }))
        .filter((p) => p.song); // drop any id Gemini hallucinated outside the catalog

      if (resolved.length === 0) {
        setError("No matching songs found for that mood — try rephrasing it.");
      }
      setPicks(resolved);
    } catch (err) {
      // Most common cause during dev: server/index.js isn't running.
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
  }, []);

  return { mood, setMood, picks, loading, error, generate, clear };
}