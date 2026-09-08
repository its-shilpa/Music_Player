// src/hooks/useSongs.js
import { useState, useEffect, useCallback, useRef } from "react";
import { searchSongs, searchMultiple } from "../api/musicApi";
import { DEFAULT_QUERIES } from "../constants/defaultQueries";

const CACHE_KEY = "museplay_catalog_cache_v2";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

// In-memory query cache & in-flight promise deduplication to prevent duplicate API requests
const searchCache = new Map();
let activeDefaultPromise = null;
const activeSearchPromises = new Map();

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
  const songsRef = useRef(songs);
  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

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

    // Deduplicate in-flight default catalog request
    if (activeDefaultPromise) {
      try {
        const results = await activeDefaultPromise;
        if (results && results.length > 0) setSongs(results);
      } catch {
        // ignore
      }
      return;
    }

    setLoading(true);
    setError(null);
    activeDefaultPromise = searchMultiple(DEFAULT_QUERIES, 15);

    try {
      const results = await activeDefaultPromise;
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
      if (songsRef.current.length === 0) {
        setError("Couldn't load songs. Check your connection and try again.");
      }
    } finally {
      activeDefaultPromise = null;
      setLoading(false);
    }
  }, []);

  // Load results for ONE specific user-typed search term with deduping & caching.
  const search = useCallback(async (query) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    // Cache hit: instant return without network request
    if (searchCache.has(trimmed)) {
      setSongs(searchCache.get(trimmed));
      setLoading(false);
      return;
    }

    // Reuse in-flight search request if same query is already fetching
    if (activeSearchPromises.has(trimmed)) {
      setLoading(true);
      try {
        const results = await activeSearchPromises.get(trimmed);
        setSongs(results);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    const promise = searchSongs(query, 50);
    activeSearchPromises.set(trimmed, promise);

    try {
      const results = await promise;
      searchCache.set(trimmed, results);
      setSongs(results);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Couldn't load songs. Check your connection and try again.");
    } finally {
      activeSearchPromises.delete(trimmed);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDefaultCatalog();
  }, [loadDefaultCatalog]);

  return { songs, loading, error, search, loadDefaultCatalog };
}
