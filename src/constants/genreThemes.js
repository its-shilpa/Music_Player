// src/constants/genreThemes.js
// Reusable genre -> theme configuration system for dynamic cinematic backgrounds.

export const GENRE_THEMES = {
  Bollywood: {
    name: "Bollywood",
    glow1: "rgba(128, 0, 32, 0.4)",      // Burgundy
    glow2: "rgba(75, 0, 130, 0.4)",      // Deep Purple
    glow3: "rgba(255, 140, 0, 0.25)",    // Orange
    accent: "#ff9f43",                   // Warm Gold
    accentSecondary: "#ee5253"           // Soft Red
  },
  "Indian Pop": {
    name: "Indian Pop",
    glow1: "rgba(10, 186, 181, 0.35)",   // Teal
    glow2: "rgba(142, 68, 173, 0.4)",    // Amethyst
    glow3: "rgba(241, 196, 15, 0.25)",   // Golden Highlights
    accent: "#00d4ff",                   // Cyan
    accentSecondary: "#8e44ad"
  },
  Pop: {
    name: "Pop",
    glow1: "rgba(244, 63, 142, 0.4)",    // Pink
    glow2: "rgba(168, 85, 247, 0.35)",   // Purple
    glow3: "rgba(0, 212, 255, 0.25)",    // Cyan/Blue
    accent: "#f43f8e",                   // Pink
    accentSecondary: "#00d4ff"
  },
  "Hip-Hop/Rap": {
    name: "Hip-Hop",
    glow1: "rgba(15, 15, 15, 0.6)",      // Black/Dark Carbon
    glow2: "rgba(120, 10, 10, 0.4)",     // Dark Red
    glow3: "rgba(99, 102, 241, 0.3)",    // Indigo
    accent: "#ef4444",                   // Electric Red
    accentSecondary: "#6366f1"
  },
  "Hip Hop": {
    name: "Hip-Hop",
    glow1: "rgba(15, 15, 15, 0.6)",
    glow2: "rgba(120, 10, 10, 0.4)",
    glow3: "rgba(99, 102, 241, 0.3)",
    accent: "#ef4444",
    accentSecondary: "#6366f1"
  },
  "R&B/Soul": {
    name: "R&B/Soul",
    glow1: "rgba(43, 24, 80, 0.5)",      // Velvet Purple
    glow2: "rgba(12, 12, 28, 0.6)",      // Deep Night
    glow3: "rgba(224, 86, 36, 0.25)",    // Saffron Gold
    accent: "#a855f7",
    accentSecondary: "#e05624"
  },
  Classical: {
    name: "Classical",
    glow1: "rgba(11, 22, 64, 0.5)",      // Deep Navy
    glow2: "rgba(39, 10, 60, 0.4)",      // Dark Violet
    glow3: "rgba(218, 165, 32, 0.22)",   // Soft Gold
    accent: "#f59e0b",                   // Amber Gold
    accentSecondary: "#8b5cf6"
  },
  "Classical / Instrumental": {
    name: "Classical",
    glow1: "rgba(11, 22, 64, 0.5)",
    glow2: "rgba(39, 10, 60, 0.4)",
    glow3: "rgba(218, 165, 32, 0.22)",
    accent: "#f59e0b",
    accentSecondary: "#8b5cf6"
  },
  Classic: {
    name: "Classical",
    glow1: "rgba(11, 22, 64, 0.5)",
    glow2: "rgba(39, 10, 60, 0.4)",
    glow3: "rgba(218, 165, 32, 0.22)",
    accent: "#f59e0b",
    accentSecondary: "#8b5cf6"
  },
  "Devotional & Spiritual": {
    name: "Devotional",
    glow1: "rgba(230, 92, 0, 0.45)",     // Deep Saffron
    glow2: "rgba(255, 179, 0, 0.3)",     // Orange Gold
    glow3: "rgba(94, 35, 157, 0.25)",    // Muted Purple
    accent: "#f39c12",                   // Saffron
    accentSecondary: "#d35400"
  },
  Inspirational: {
    name: "Inspirational",
    glow1: "rgba(230, 92, 0, 0.45)",
    glow2: "rgba(255, 179, 0, 0.3)",
    glow3: "rgba(94, 35, 157, 0.25)",
    accent: "#f39c12",
    accentSecondary: "#d35400"
  },
  "K-Pop": {
    name: "K-Pop",
    glow1: "rgba(255, 105, 180, 0.45)",  // Hot Pink
    glow2: "rgba(147, 112, 219, 0.4)",   // Medium Purple
    glow3: "rgba(0, 206, 209, 0.25)",    // Turquoise
    accent: "#ff6b6b",                   // Vibrant Pink
    accentSecondary: "#00d2d3"
  },
  Country: {
    name: "Country",
    glow1: "rgba(101, 67, 33, 0.45)",    // Earthy Brown
    glow2: "rgba(34, 139, 34, 0.35)",    // Forest Green
    glow3: "rgba(255, 165, 0, 0.22)",    // Warm Amber
    accent: "#d35400",                   // Rust Orange
    accentSecondary: "#27ae60"
  },
  Electronic: {
    name: "Electronic",
    glow1: "rgba(0, 255, 255, 0.35)",    // Neon Cyan
    glow2: "rgba(128, 0, 128, 0.4)",     // Deep Violet
    glow3: "rgba(255, 0, 255, 0.25)",    // Magenta
    accent: "#00d4ff",                   // Cyan
    accentSecondary: "#ec4899"
  },
  Dance: {
    name: "Dance",
    glow1: "rgba(0, 255, 255, 0.35)",
    glow2: "rgba(128, 0, 128, 0.4)",
    glow3: "rgba(255, 0, 255, 0.25)",
    accent: "#00d4ff",
    accentSecondary: "#ec4899"
  },
  Romantic: {
    name: "Romantic",
    glow1: "rgba(192, 41, 43, 0.45)",    // Velvet Rose Red
    glow2: "rgba(75, 25, 100, 0.4)",     // Plum Purple
    glow3: "rgba(244, 179, 194, 0.25)",  // Blush Pink
    accent: "#ee5253",                   // Deep Pink
    accentSecondary: "#a855f7"
  },
  Sufi: {
    name: "Sufi",
    glow1: "rgba(93, 20, 80, 0.45)",     // Deep Wine
    glow2: "rgba(212, 175, 55, 0.3)",    // Ochre Gold
    glow3: "rgba(38, 70, 83, 0.25)",     // Dark Sand
    accent: "#f1c40f",                   // Gold
    accentSecondary: "#e74c3c"
  },
  Soundtrack: {
    name: "Soundtrack",
    glow1: "rgba(27, 38, 59, 0.5)",      // Dark Slate
    glow2: "rgba(65, 90, 119, 0.4)",     // Gray Blue
    glow3: "rgba(224, 225, 221, 0.15)",   // Platinum Glow
    accent: "#4ea8de",                   // Cool Blue
    accentSecondary: "#90e0ef"
  },
  Unknown: {
    name: "Default",
    glow1: "rgba(168, 85, 247, 0.22)",   // Purple
    glow2: "rgba(0, 212, 255, 0.15)",    // Cyan
    glow3: "rgba(244, 63, 142, 0.16)",   // Pink
    accent: "#00d4ff",                   // Cyan
    accentSecondary: "#a855f7"
  }
};

export function getGenreTheme(genreName) {
  if (!genreName) return GENRE_THEMES.Unknown;
  
  // Find match (case-insensitive or substring)
  const keys = Object.keys(GENRE_THEMES);
  const matchedKey = keys.find(k => 
    k.toLowerCase() === genreName.toLowerCase() || 
    genreName.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(genreName.toLowerCase())
  );

  return matchedKey ? GENRE_THEMES[matchedKey] : GENRE_THEMES.Unknown;
}
