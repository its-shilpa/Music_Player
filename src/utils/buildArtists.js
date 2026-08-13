// src/utils/buildArtists.js
// Takes the flat song list and derives a de-duplicated, sorted artist list
// (most songs first) for the "Artists" row on the home page.
export function buildArtists(songs) {
  const map = {};
  songs.forEach((song) => {
    song.artists.forEach((artist) => {
      if (!map[artist]) {
        map[artist] = { name: artist, count: 0, color: song.color };
      }
      map[artist].count++;
    });
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}
