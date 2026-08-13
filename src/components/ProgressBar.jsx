// src/components/ProgressBar.jsx
// The clickable seek bar + elapsed/total time under the album art.
import { formatTime } from "../utils/formatTime";

export default function ProgressBar({ progress, currentTime, duration, onSeek }) {
  return (
    <div className="progress-section">
      <div className="progress-bar-container" onClick={onSeek}>
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <div className="progress-handle" style={{ left: `${progress}%` }} />
      </div>
      <div className="time-display">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
