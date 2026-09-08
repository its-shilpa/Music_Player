// src/components/SongThumb.jsx
// A single <img> that shows a song's cover art, and silently swaps to the
// generated SVG fallback if the real image URL 404s or fails to load.
// Optimized with React.memo, lazy loading, and async decoding for smooth 60fps scrolling.
import { useState, useEffect, useMemo, memo } from "react";
import { makeFallbackSVG } from "../utils/fallbackArt";

function SongThumb({ song, className = "" }) {
  const fallback = useMemo(() => {
    return makeFallbackSVG(song?.name, song?.color);
  }, [song?.name, song?.color]);

  const [src, setSrc] = useState(song?.image || fallback);

  useEffect(() => {
    setSrc(song?.image || fallback);
  }, [song?.image, fallback]);

  return (
    <img
      src={src}
      alt={song?.name || "Track Artwork"}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setSrc(fallback)}
    />
  );
}

export default memo(SongThumb);
