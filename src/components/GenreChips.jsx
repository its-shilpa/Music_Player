// src/components/GenreChips.jsx
import { GENRES } from "../constants/genres";

export default function GenreChips({ activeGenre, onSelect }) {
  return (
    <div className="genre-chips">
      {GENRES.map((g) => (
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
