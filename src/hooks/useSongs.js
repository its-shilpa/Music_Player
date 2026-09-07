// src/hooks/useSongs.js
import { useState, useEffect, useCallback } from "react";
import { searchSongs, searchMultiple } from "../api/musicApi";
import { DEFAULT_QUERIES } from "../constants/defaultQueries";

const CACHE_KEY = "museplay_catalog_cache_v2";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

export function useSongs() {
  // Initialize immediately from localStorage if available for 0ms instantaneous load
  const [songs, setSongs] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        if (Array.isArray(data) && data.length > 0) {
          return false;
        }
      }
    } catch {
      // ignore
    }
    return true;
  });

  const [error, setError] = useState(null);

  // Load the diverse default catalog (seed queries merged together).
  const loadDefaultCatalog = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Array.isArray(data) && data.length > 0) {
            setSongs(data);
            setLoading(false);
            // If cache is fresh (< 6 hours), don't refetch
            if (Date.now() - (timestamp || 0) < CACHE_TTL) {
              return;
            }
          }
        }
      } catch {
        // ignore
      }
    }

    setLoading(true);
    setError(null);
    try {
      const results = await searchMultiple(DEFAULT_QUERIES, 15);
      if (results && results.length > 0) {
        setSongs(results);
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: results, timestamp: Date.now() })
          );
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Failed to fetch default catalog:", err);
      // Only set visible error if we don't have any cached songs
      if (songs.length === 0) {
        setError("Couldn't load songs. Check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [songs.length]);

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
