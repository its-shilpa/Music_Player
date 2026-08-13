// src/components/ArtistBubble.jsx
// One clickable circular artist card in the home page's "Artists" row.
import { useState } from "react";
import { makeArtistFallbackSVG } from "../utils/fallbackArt";
import { ARTIST_PHOTOS } from "../constants/artistPhotos";

export default function ArtistBubble({ artist, onClick }) {
  const [photoSrc, setPhotoSrc] = useState(
    ARTIST_PHOTOS[artist.name] || makeArtistFallbackSVG(artist.name, artist.color)
  );

  return (
    <button
      type="button"
      className="artist-bubble"
      style={{ "--ac": artist.color }}
      onClick={onClick}
    >
      <div className="artist-bubble-avatar">
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
