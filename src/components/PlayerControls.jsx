// src/components/PlayerControls.jsx
// Control buttons shelf containing Shuffle, Skip Back, Play/Pause, Skip Forward, Repeat,
// and a volume slider with interactive mute controls.

import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, VolumeX } from "lucide-react";

export default function PlayerControls({
  isShuffle,
  isRepeat,
  isPlaying,
  onToggleShuffle,
  onPrev,
  onTogglePlay,
  onNext,
  onToggleRepeat,
  volume,
  onVolumeChange,
}) {
  return (
    <>
      {/* Audio Playback Controls */}
      <div className="player-controls-section">
        {/* Shuffle Toggle */}
        <button 
          className={`player-ctrl-btn ${isShuffle ? "active" : ""}`} 
          title="Shuffle"
          onClick={onToggleShuffle}
        >
          <Shuffle size={18} />
        </button>

        {/* Previous Song */}
        <button 
          className="player-ctrl-btn" 
          title="Previous song"
          onClick={onPrev}
        >
          <SkipBack size={22} fill="currentColor" />
        </button>

        {/* Big Play / Pause Toggle */}
        <button
          className="player-ctrl-btn play-pause"
          title={isPlaying ? "Pause" : "Play"}
          onClick={onTogglePlay}
        >
          {isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" />
          )}
        </button>

        {/* Next Song */}
        <button 
          className="player-ctrl-btn" 
          title="Next song"
          onClick={onNext}
        >
          <SkipForward size={22} fill="currentColor" />
        </button>

        {/* Repeat Toggle */}
        <button 
          className={`player-ctrl-btn ${isRepeat ? "active" : ""}`} 
          title="Repeat"
          onClick={onToggleRepeat}
        >
          <Repeat size={18} />
        </button>
      </div>

      {/* Volume Section */}
      <div className="player-volume-section">
        <button 
          className="player-ctrl-btn volume-btn" 
          title={volume === 0 ? "Unmute" : "Mute"}
          onClick={() => onVolumeChange(volume === 0 ? 0.75 : 0)}
        >
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="player-volume-slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="mini-vol-slider"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${volume * 100}%, var(--border-medium) ${volume * 100}%, var(--border-medium) 100%)`
            }}
          />
        </div>
        <span className="volume-percentage">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </>
  );
}
