// src/components/ProgressBar.jsx
// Clickable progress/seek slider bar with elapsed and remaining time readouts.

import { formatTime } from "../utils/formatTime";

export default function ProgressBar({ progress, currentTime, duration, onSeek }) {
  return (
    <div className="player-progress-section">
      <div 
        className="player-progress-bar-container" 
        onClick={onSeek}
        title="Seek track"
      >
        <div className="player-progress-bar-fill" style={{ width: `${progress}%` }} />
        <div className="player-progress-handle" style={{ left: `${progress}%` }} />
      </div>
      <div className="player-time-display">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
