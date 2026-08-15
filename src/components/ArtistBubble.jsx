// src/components/ArtistBubble.jsx
// One clickable circular artist profile bubble inside the horizontal scroll shelf.
// Features hover states, border gradient masks, and a play overlay.

import { useState } from "react";
import { Play } from "lucide-react";
import { makeArtistFallbackSVG } from "../utils/fallbackArt";
import { ARTIST_PHOTOS } from "../constants/artistPhotos";

export default function ArtistBubble({ artist, onClick }) {
  const [photoSrc, setPhotoSrc] = useState(
    () => ARTIST_PHOTOS[artist.name] || makeArtistFallbackSVG(artist.name, artist.color)
  );

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
