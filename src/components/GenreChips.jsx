// src/components/GenreChips.jsx
// Genres now come from props (derived live from loaded songs via
// utils/buildGenres.js) instead of a hardcoded constant.
export default function GenreChips({ genres, activeGenre, onSelect }) {
  return (
    <div className="genre-chips">
      {genres.map((g) => (
        <button
          key={g}
          className={`genre-chip ${activeGenre === g ? "active" : ""}`}
          onClick={() => onSelect(g)}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
