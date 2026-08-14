// src/utils/buildGenres.js
// Derives the genre chip list from whatever songs actually got loaded,
// instead of a hardcoded list that may not match real API data. "All" is
// always first; the rest are whatever genres are present, alphabetized.
export function buildGenres(songs) {
  const set = new Set(songs.map((s) => s.genre).filter(Boolean));
  return ["All", ...Array.from(set).sort()];
}
