// src/components/SongCard.jsx
// A compact card representing a track in a grid.
// Features a large square artwork, hover play overlay, track details,
// genre badge, heart favorite toggle, and plus queue buttons.

import { Play, Pause, Heart, Plus } from "lucide-react";
import SongThumb from "./SongThumb";

export default function SongCard({
  song,
  isActive,
  isPlaying,
  onPlay,
  isFavorite,
  onToggleFavorite,
  onAddToQueue,
}) {
  return (
    <div
      className={`song-card ${isActive ? "active" : ""}`}
      onClick={() => onPlay(song.id)}
    >
      {/* Artwork container with hover play overlay */}
      <div className="song-card-art">
        <SongThumb song={song} />
        <div className="song-card-hover-play">
          {isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
        </div>
      </div>

      {/* Song details (Title, Artist) */}
      <div className="song-card-details">
        <div className="song-card-title" title={song.name}>
          {song.name}
        </div>
        <div className="song-card-artist" title={song.artists.join(", ")}>
          {song.artists.join(", ")}
        </div>
      </div>

      {/* Footer block: Genre badge & actions */}
      <div className="song-card-footer" onClick={(e) => e.stopPropagation()}>
        <span className="song-card-genre">{song.genre}</span>
        <div className="song-card-actions">
          {/* Heart Favorite toggle */}
          <button
            className={`song-card-btn fav-btn ${isFavorite ? "active" : ""}`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            onClick={() => onToggleFavorite(song.id)}
            type="button"
          >
            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          {/* Plus Queue adder */}
          <button
            className="song-card-btn"
            title="Add to queue"
            onClick={() => onAddToQueue(song.id)}
            type="button"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
