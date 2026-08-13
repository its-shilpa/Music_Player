// src/hooks/useSongs.js
// Owns "what songs are loaded and what search term loaded them", so App.jsx
// doesn't need its own useEffect + useState pair for this.
import { useState, useEffect, useCallback } from "react";
import { searchSongs } from "../api/musicApi";

const DEFAULT_QUERY = "arijit singh";

export function useSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchSongs(query);
      setSongs(results);
    } catch (err) {
      console.error("Failed to fetch songs:", err);
      setError("Couldn't load songs. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a default catalog once on mount.
  useEffect(() => {
    load(DEFAULT_QUERY);
  }, [load]);

  return { songs, loading, error, reload: load };
}
