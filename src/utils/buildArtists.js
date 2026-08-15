// src/utils/buildArtists.js
// Takes the flat song list and derives a de-duplicated, sorted artist list
// (most songs first) for the "Artists" row. Attaches a dynamic image from their tracks.

export function buildArtists(songs) {
  const map = {};
  songs.forEach((song) => {
    song.artists.forEach((artist) => {
      if (!map[artist]) {
        map[artist] = { 
          name: artist, 
          count: 0, 
          color: song.color,
          image: song.image // Use song artwork as the dynamic artist profile photo
        };
      }
      map[artist].count++;
    });
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}
