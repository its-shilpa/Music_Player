// src/components/GenreChips.jsx
// Genre chips list. Renders as a flat list of button elements inside a React Fragment,
// allowing it to be wrapped cleanly inside a scrolling CarouselContainer.

const GENRE_ICONS = {
  All: "🎵",
  Bollywood: "🎬",
  Romantic: "💖",
  Romance: "💖",
  Pop: "⚡",
  Classical: "🎻",
  Classic: "🎻",
  "Classical / Instrumental": "🎻",
  "Devotional & Spiritual": "🪕",
  Inspirational: "🪕",
  "K-Pop": "🌌",
  Country: "🤠",
  Electronic: "🎧",
  Dance: "🎧",
  "Indian Pop": "🌟",
  Sufi: "🕌",
  Alternative: "🎸",
  "R&B/Soul": "🎷",
  Soundtrack: "🎥",
  Holiday: "❄️"
};

// Resolve custom icon prefix based on genre name
function getGenreIcon(name) {
  if (!name) return "💿";
  const matched = Object.keys(GENRE_ICONS).find(k => 
    k.toLowerCase() === name.toLowerCase() || 
    name.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(name.toLowerCase())
  );
  return matched ? GENRE_ICONS[matched] : "💿";
}

export default function GenreChips({ genres, activeGenre, onSelect }) {
  return (
    <>
      {genres.map((g) => (
        <button
          key={g}
          className={`genre-chip ${activeGenre === g ? "active" : ""}`}
          onClick={() => onSelect(g)}
          type="button"
        >
          <span style={{ fontSize: "14px" }}>{getGenreIcon(g)}</span>
          <span>{g}</span>
        </button>
      ))}
    </>
  );
}
