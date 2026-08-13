// src/components/SongRow.jsx
// One clickable row/card representing a song in a list (home grid, related
// songs grid, search results...). isActive highlights the currently playing
// song and swaps the icon to a pause symbol.
export default function SongRow({ song, isActive, onPlay }) {
  return (
    <button
      type="button"
      className={`song-row ${isActive ? "active" : ""}`}
      onClick={() => onPlay(song.id)}
    >
      <span className="song-play-icon">{isActive ? "⏸" : "▶"}</span>
      <span className="song-name">{song.name}</span>
      <span className="song-artists">{song.artists.join(", ")}</span>
      <span className="song-genre">{song.genre}</span>
    </button>
  );
}
