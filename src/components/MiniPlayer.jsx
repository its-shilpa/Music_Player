// src/components/MiniPlayer.jsx
// Persistent sticky bar at the bottom of browsing views.
// Renders song info, play controls, progress line, and volume slider.

import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import SongThumb from "./SongThumb";

export default function MiniPlayer({
  song,
  isPlaying,
  progress,
  onOpenPlayer,
  onPrev,
  onTogglePlay,
  onNext,
  volume = 1,
  onVolumeChange,
}) {
  return (
    <div className="mini-player-bar" onClick={onOpenPlayer}>
      {/* Top thin progress line */}
      <div className="mini-progress">
        <div className="mini-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Left Column: Artwork and Info */}
      <div className="mini-player-left">
        <div className="mini-thumb">
          <SongThumb song={song} />
        </div>
        <div className="mini-text">
          <div className="mini-song-name">{song.name}</div>
          <div className="mini-artist">{song.artists.join(", ")}</div>
        </div>
      </div>

      {/* Center Column: Control Buttons */}
      <div className="mini-player-center">
        <div className="mini-player-controls">
          <button 
            className="mini-ctrl-btn" 
            title="Previous song"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <SkipBack size={18} fill="currentColor" />
          </button>
          
          <button 
            className="mini-ctrl-btn play-pause" 
            title={isPlaying ? "Pause" : "Play"}
            onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
          >
            {isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
          </button>
          
          <button 
            className="mini-ctrl-btn" 
            title="Next song"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Right Column: Volume Slider */}
      <div className="mini-player-right" onClick={(e) => e.stopPropagation()}>
        <div className="mini-vol-container">
          <button 
            className="mini-ctrl-btn" 
            style={{ padding: "4px" }}
            title={volume === 0 ? "Unmute" : "Mute"}
            onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)}
          >
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="mini-vol-slider"
          />
        </div>
      </div>
    </div>
  );
}
