// src/api/musicApi.js
//
// WHY THIS FILE CHANGED
// ----------------------
// Your old code called Deezer directly from the browser:
//     axios.get(`https://api.deezer.com/search?q=${query}`)
// Deezer's API does NOT send the CORS headers browsers require, so every
// request gets blocked by the browser itself before it even reaches your
// code (open devtools -> Network/Console and you'd see a CORS error, not a
// 404 or 500). That is why "the api is not working" even though the code
// looks correct.
//
// iTunes Search API (Apple) DOES allow cross-origin browser requests, is
// completely free, needs NO api key, and gives you a real 30s audio preview
// url, cover art, artist and track name. That makes it the easiest drop-in
// replacement for a learning project like this.
//
// The base URL lives in .env (see .env.example) instead of being hard-coded,
// so you can swap providers later without touching this file's logic.

import axios from "axios";

const BASE_URL = import.meta.env.VITE_MUSIC_API_BASE_URL;

// Create one configured axios instance instead of calling axios.get()
// everywhere. This is a common pattern: if you ever need to add headers,
// a timeout, or auth, you only change it in one place.
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Search iTunes for songs matching a text query.
 * @param {string} query - what the user typed (artist name, song name...)
 * @param {number} limit - how many results to fetch (max 200 for iTunes)
 * @returns {Promise<Array>} array of "raw" iTunes track objects
 */
export async function searchSongsRaw(query, limit = 25) {
  if (!query || !query.trim()) return [];

  const { data } = await api.get("/search", {
    params: {
      term: query,
      media: "music",
      entity: "song",
      limit,
    },
  });

  // iTunes wraps results in { resultCount, results: [...] }
  return data.results ?? [];
}

/**
 * Search songs AND shape the response into the exact shape the rest of
 * this app expects: { id, name, artists, genre, color, image, preview }.
 * Doing the mapping here (not in App.jsx) means every component that uses
 * a song can rely on this shape no matter which API is behind it.
 */
export async function searchSongs(query, limit = 25) {
  const raw = await searchSongsRaw(query, limit);
  return raw.map(normalizeItunesTrack);
}

// A handful of nice accent colors we cycle through, since iTunes doesn't
// give us a "brand color" for a song the way your old hardcoded list did.
const ACCENT_COLORS = [
  "#00d4ff",
  "#14b8a6",
  "#6366f1",
  "#22c55e",
  "#a855f7",
  "#f59e0b",
  "#f43f8e",
  "#ec4899",
];

function colorForId(id) {
  const index = Math.abs(Number(id) || 0) % ACCENT_COLORS.length;
  return ACCENT_COLORS[index];
}

/**
 * Convert one raw iTunes result into this app's song shape.
 * iTunes fields we use:
 *  - trackId            -> id
 *  - trackName          -> name
 *  - artistName         -> artists (iTunes only gives one artist string)
 *  - primaryGenreName   -> genre
 *  - artworkUrl100      -> image (we upsize it to a bigger image)
 *  - previewUrl         -> preview (a real playable 30s mp3 clip)
 */
export function normalizeItunesTrack(track) {
  return {
    id: track.trackId,
    name: track.trackName,
    artists: [track.artistName],
    genre: track.primaryGenreName || "Pop",
    color: colorForId(track.trackId),
    image: track.artworkUrl100
      ? track.artworkUrl100.replace("100x100bb", "600x600bb")
      : null,
    preview: track.previewUrl || null,
  };
}
