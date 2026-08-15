// src/components/SongFlipCard.jsx
// A premium card representing a track that flips 180 degrees on hover.
// Front face: Full-size artwork with bottom details overlay.
// Back face: Blurred backdrop, centered play/pause controls, and action buttons.

import { Play, Pause, Heart, ListPlus } from "lucide-react";
import SongThumb from "./SongThumb";

export default function SongFlipCard({
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
      className={`song-flip-card-container ${isActive ? "active" : ""}`}
      onClick={() => onPlay(song.id)}
    >
      <div className="song-flip-card-inner">
        {/* FRONT FACE: Sleek visual display */}
        <div className="song-flip-card-front">
          <div className="song-card-art-full">
            <SongThumb song={song} />
          </div>
          <div className="song-card-front-overlay">
            <div className="song-card-front-title">{song.name}</div>
            <div className="song-card-front-artist">{song.artists.join(", ")}</div>
          </div>
          {isFavorite && (
            <div className="song-card-front-badge">
              <Heart size={12} fill="#ee5253" color="#ee5253" />
            </div>
          )}
        </div>

        {/* BACK FACE: Detailed controls and actions */}
        <div className="song-flip-card-back" onClick={(e) => e.stopPropagation()}>
          {/* Blurred artwork layer acting as backface texture */}
          <div className="song-card-back-blur">
            <SongThumb song={song} />
          </div>
          
          <div className="song-card-back-overlay" onClick={() => onPlay(song.id)}>
            <div className="song-card-back-play-btn">
              {isActive && isPlaying ? (
                <Pause size={26} fill="currentColor" />
              ) : (
                <Play size={26} fill="currentColor" style={{ marginLeft: "3px" }} />
              )}
            </div>
            
            <div className="song-card-back-info">
              <div className="song-card-back-title">{song.name}</div>
              <div className="song-card-back-artist">{song.artists.join(", ")}</div>
            </div>
          </div>

          <div className="song-card-back-actions">
            <button
              className={`song-card-btn fav-btn ${isFavorite ? "active" : ""}`}
              onClick={() => onToggleFavorite(song.id)}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              type="button"
            >
              <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            
            <button
              className="song-card-btn"
              onClick={() => onAddToQueue(song.id)}
              title="Add to Play Queue (Up Next)"
              type="button"
            >
              <ListPlus size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
