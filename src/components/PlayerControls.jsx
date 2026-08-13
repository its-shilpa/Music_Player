// src/components/PlayerControls.jsx
// Shuffle / prev / play-pause / next / repeat row, plus the volume slider.
// All state lives in useAudioPlayer - this component just displays it and
// forwards clicks.
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
      <div className="controls-section">
        <button className={`control-btn ${isShuffle ? "active" : ""}`} onClick={onToggleShuffle}>
          🔀
        </button>
        <button className="control-btn prev-btn" onClick={onPrev}>
          ⏮
        </button>
        <button
          className={`control-btn play-pause-btn ${isPlaying ? "playing" : ""}`}
          onClick={onTogglePlay}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="control-btn next-btn" onClick={onNext}>
          ⏭
        </button>
        <button className={`control-btn ${isRepeat ? "active" : ""}`} onClick={onToggleRepeat}>
          🔁
        </button>
      </div>

      <div className="volume-section">
        <span className="volume-icon">{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="volume-slider"
        />
        <span className="volume-percent">{Math.round(volume * 100)}%</span>
      </div>
    </>
  );
}
