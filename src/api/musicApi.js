// src/api/musicApi.js
//
// iTunes Search API only supports SEARCH (you give it a term, it gives you
// matches) - there's no "browse everything" endpoint. So to build a
// diverse home catalog (many artists/genres, not just one search term), we
// fire several different searches in parallel and merge the results,
// removing duplicates by song id.

import axios from "axios";

const BASE_URL = import.meta.env.VITE_MUSIC_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Raw single search against iTunes.
 */
export async function searchSongsRaw(query, limit = 25) {
  if (!query || !query.trim()) return [];
  const { data } = await api.get("/search", {
    params: { term: query, media: "music", entity: "song", limit },
  });
  return data.results ?? [];
}

/**
 * Search + normalize a single query.
 */
export async function searchSongs(query, limit = 25) {
  const raw = await searchSongsRaw(query, limit);
  return raw.map(normalizeItunesTrack);
}

/**
 * Search MULTIPLE queries in parallel and merge into one deduplicated,
 * normalized list. This is how we build a catalog with real variety
 * (different artists, different genres) instead of one artist's results.
 */
export async function searchMultiple(queries, limitPerQuery = 15) {
  const results = await Promise.allSettled(
    queries.map((q) => searchSongsRaw(q, limitPerQuery))
  );

  const seen = new Set();
  const merged = [];
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const track of result.value) {
      if (seen.has(track.trackId)) continue;
      seen.add(track.trackId);
      merged.push(normalizeItunesTrack(track));
    }
  }
  return merged;
}

const ACCENT_COLORS = [
  "#00d4ff", "#14b8a6", "#6366f1", "#22c55e",
  "#a855f7", "#f59e0b", "#f43f8e", "#ec4899",
];

function colorForId(id) {
  const index = Math.abs(Number(id) || 0) % ACCENT_COLORS.length;
  return ACCENT_COLORS[index];
}

export function normalizeItunesTrack(track) {
  return {
    id: track.trackId,
    name: track.trackName,
    artists: [track.artistName],
    // No fallback to "Pop" here anymore - if iTunes doesn't give us a
    // genre, we label it honestly instead of silently miscategorizing it.
    genre: track.primaryGenreName || "Unknown",
    color: colorForId(track.trackId),
    image: track.artworkUrl100 ? track.artworkUrl100.replace("100x100bb", "600x600bb") : null,
    preview: track.previewUrl || null,
  };
}
