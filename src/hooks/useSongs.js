// src/hooks/useSongs.js
import { useState, useEffect, useCallback } from "react";
import { searchSongs, searchMultiple } from "../api/musicApi";
import { DEFAULT_QUERIES } from "../constants/defaultQueries";

export function useSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the diverse default catalog (many seed queries merged together).
  const loadDefaultCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMultiple(DEFAULT_QUERIES, 15);
      setSongs(results);
    } catch (err) {
      console.error("Failed to fetch default catalog:", err);
      setError("Couldn't load songs. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load results for ONE specific user-typed search term.
  const search = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchSongs(query, 30);
      setSongs(results);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Couldn't load songs. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDefaultCatalog();
  }, [loadDefaultCatalog]);

  return { songs, loading, error, search, loadDefaultCatalog };
}
