// src/components/SongThumb.jsx
// A single <img> that shows a song's cover art, and silently swaps to the
// generated SVG fallback if the real image URL 404s or fails to load.
import { useState, useEffect } from "react";
import { makeFallbackSVG } from "../utils/fallbackArt";

export default function SongThumb({ song, className = "" }) {
  const fallback = makeFallbackSVG(song.name, song.color);
  const [src, setSrc] = useState(song.image || fallback);

  // If the song prop changes (e.g. user picked a different song), reset
  // back to the real image before trying the fallback again.
  useEffect(() => {
    setSrc(song.image || fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.image, song.name, song.color]);

  return (
    <img
      src={src}
      alt={song.name}
      className={className}
      onError={() => setSrc(makeFallbackSVG(song.name, song.color))}
    />
  );
}
