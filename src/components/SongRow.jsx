// src/components/SongRow.jsx
// One clickable row representing a song. 
// Structures columns: Index/Equalizer/Play, Info (art + title + artists), Genre badge, Actions.

import { Play, Pause, Heart, ListPlus } from "lucide-react";
import SongThumb from "./SongThumb";

export default function SongRow({
  song,
  isActive,
  isPlaying,
  onPlay,
  index,
  isFavorite,
  onToggleFavorite,
  onAddToQueue,
}) {
  return (
    <div
      className={`song-row ${isActive ? "active" : ""}`}
      onClick={() => onPlay(song.id)}
    >
      {/* Column 1: Track index or equalizer visualizer if active, play icon on hover */}
      <div className="song-row-num">
        {isActive && isPlaying ? (
          <div className="song-row-playing-indicator">
            <div className="song-row-playing-bar" style={{ animationDelay: "0.1s" }} />
            <div className="song-row-playing-bar" style={{ animationDelay: "0.3s" }} />
            <div className="song-row-playing-bar" style={{ animationDelay: "0.5s" }} />
          </div>
        ) : (
          <div className="song-row-index-container">
            <span className="song-index-number">{index}</span>
            <span className="song-index-play-icon">
              <Play size={12} fill="currentColor" />
            </span>
          </div>
        )}
      </div>

      {/* Column 2: Artwork & details */}
      <div className="song-row-title-cell">
        <div className="song-row-art">
          <SongThumb song={song} />
          <div className="song-row-play-btn">
            {isPlaying ? (
              <Pause size={14} fill="currentColor" />
            ) : (
              <Play size={14} fill="currentColor" />
            )}
          </div>
        </div>
        <div className="song-row-text">
          <div className="song-row-name">{song.name}</div>
          <div className="song-row-artists">
            {song.artists.join(", ")}
          </div>
        </div>
      </div>

      {/* Column 3: Genre tag */}
      <div className="song-row-genre">
        <span className="song-row-genre-badge">{song.genre}</span>
      </div>

      {/* Column 4: Favorite & Queue action buttons */}
      <div className="song-row-actions" onClick={(e) => e.stopPropagation()}>
        {/* Heart Favorite toggle */}
        <button
          className={`song-row-action-btn fav-btn ${isFavorite ? "active" : ""}`}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          onClick={() => onToggleFavorite(song.id)}
          type="button"
        >
          <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* ListPlus Queue adder */}
        <button
          className="song-row-action-btn"
          title="Add to Play Queue (Up Next)"
          onClick={() => onAddToQueue(song.id)}
          type="button"
        >
          <ListPlus size={15} />
        </button>
      </div>
    </div>
  );
}
