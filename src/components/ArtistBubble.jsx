// src/components/ArtistBubble.jsx
// One circular artist profile bubble. Resolves a dynamic profile image
// from the artist's tracks, falls back to initials, and handles hover overlay play button.

import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { makeArtistFallbackSVG } from "../utils/fallbackArt";
import { ARTIST_PHOTOS } from "../constants/artistPhotos";

export default function ArtistBubble({ artist, onClick }) {
  const [photoSrc, setPhotoSrc] = useState(
    () => ARTIST_PHOTOS[artist.name] || artist.image || makeArtistFallbackSVG(artist.name, artist.color)
  );

  // Sync state if catalog reloads or query changes the artist properties
  useEffect(() => {
    setPhotoSrc(
      ARTIST_PHOTOS[artist.name] || artist.image || makeArtistFallbackSVG(artist.name, artist.color)
    );
  }, [artist.name, artist.image, artist.color]);

  return (
    <button
      type="button"
      className="artist-bubble"
      style={{ "--ac": artist.color }}
      onClick={onClick}
    >
      <div className="artist-bubble-avatar">
        {/* Play overlay shown on hover */}
        <div className="artist-hover-play">
          <Play size={20} fill="currentColor" />
        </div>

        <img
          src={photoSrc}
          alt={artist.name}
          className="artist-photo"
          onError={() => setPhotoSrc(makeArtistFallbackSVG(artist.name, artist.color))}
        />
      </div>
      <div className="artist-bubble-name">{artist.name}</div>
      <div className="artist-bubble-count">{artist.count} songs</div>
    </button>
  );
}
