// src/components/GenreChips.jsx
// Upgraded Genre Cards. Renders Spotify-style visual category blocks
// with colorful linear gradients, bold labels, and matching thematic Lucide icons.

import { 
  Film, Zap, Heart, Disc, Music, Sun, Radio, Snowflake, 
  Library, Clapperboard, Compass, Flame, Sparkles
} from "lucide-react";

// Pre-defined colorful linear gradients mapping to common genres
const GENRE_GRADIENTS = {
  All: "linear-gradient(135deg, #8a2be2, #4a0e4e)",
  Bollywood: "linear-gradient(135deg, #f857a6, #ff5858)",
  Romantic: "linear-gradient(135deg, #ff0844, #ffb199)",
  Romance: "linear-gradient(135deg, #ff0844, #ffb199)",
  Pop: "linear-gradient(135deg, #f6d365, #fda085)",
  Classical: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  "Classical / Instrumental": "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  "Devotional & Spiritual": "linear-gradient(135deg, #11998e, #38ef7d)",
  Electronic: "linear-gradient(135deg, #30cfd0, #330867)",
  Dance: "linear-gradient(135deg, #30cfd0, #330867)",
  Alternative: "linear-gradient(135deg, #ff9966, #ff5e62)",
  Soundtrack: "linear-gradient(135deg, #4facfe, #00f2fe)",
  Holiday: "linear-gradient(135deg, #fbc2eb, #a6c1ee)"
};

// Programmatic colorful gradients fallback list to guarantee no black cards
const VIBRANT_GRADIENTS = [
  "linear-gradient(135deg, #ff9a9e, #fecfef)",
  "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  "linear-gradient(135deg, #ff0844, #ffb199)",
  "linear-gradient(135deg, #11998e, #38ef7d)",
  "linear-gradient(135deg, #30cfd0, #330867)",
  "linear-gradient(135deg, #ff9966, #ff5e62)",
  "linear-gradient(135deg, #2af598, #009efd)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
  "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
  "linear-gradient(135deg, #fa709a, #fee140)",
  "linear-gradient(135deg, #4facfe, #00f2fe)"
];

// Map genre titles to matching Lucide icons
const GENRE_ICONS = {
  All: Library,
  Bollywood: Film,
  Romantic: Heart,
  Romance: Heart,
  Pop: Zap,
  Classical: Music,
  "Classical / Instrumental": Music,
  "Devotional & Spiritual": Sun,
  Electronic: Disc,
  Dance: Disc,
  Alternative: Radio,
  Soundtrack: Clapperboard,
  Holiday: Snowflake,
  Country: Compass,
  "Fitness & Workout": Flame,
  Inspirational: Sparkles
};

function getGenreGradient(name) {
  if (!name) return VIBRANT_GRADIENTS[0];
  const matchedKey = Object.keys(GENRE_GRADIENTS).find(k => 
    k.toLowerCase() === name.toLowerCase() ||
    name.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(name.toLowerCase())
  );
  if (matchedKey) return GENRE_GRADIENTS[matchedKey];
  
  // Dynamic string hashing fallback
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % VIBRANT_GRADIENTS.length;
  return VIBRANT_GRADIENTS[idx];
}

function getGenreIconComponent(name) {
  if (!name) return Music;
  const matchedKey = Object.keys(GENRE_ICONS).find(k =>
    k.toLowerCase() === name.toLowerCase() ||
    name.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(name.toLowerCase())
  );
  return matchedKey ? GENRE_ICONS[matchedKey] : Music;
}

export default function GenreChips({ genres, activeGenre, onSelect }) {
  // Ensure "All" is in the list to reset filtering
  const genresList = genres.includes("All") ? genres : ["All", ...genres];

  return (
    <>
      {genresList.map((g) => {
        const gradient = getGenreGradient(g);
        const isActive = activeGenre === g;
        const IconComponent = getGenreIconComponent(g);
        
        return (
          <button
            key={g}
            className={`genre-card-item ${isActive ? "active" : ""}`}
            style={{ 
              background: gradient,
            }}
            onClick={() => onSelect(g)}
            type="button"
          >
            <span className="genre-card-name">{g}</span>
            <div className="genre-card-icon-wrap">
              <IconComponent size={64} strokeWidth={2.5} />
            </div>
          </button>
        );
      })}
    </>
  );
}
