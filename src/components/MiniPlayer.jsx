// src/components/MiniPlayer.jsx
// The small sticky bar at the bottom of the Home view. Clicking it opens
// the full PlayerView; the transport buttons stop that click from bubbling
// up (e.stopPropagation) so pressing "next" doesn't also open the player.
import SongThumb from "./SongThumb";

export default function MiniPlayer({
  song,
  isPlaying,
  progress,
  onOpenPlayer,
  onPrev,
  onTogglePlay,
  onNext,
}) {
  return (
    <div className="mini-player-bar" onClick={onOpenPlayer}>
      <div className="mini-thumb">
        <SongThumb song={song} />
      </div>

      <div className="mini-player-info">
        <div className="mini-waveform">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="mini-wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
        <div className="mini-text">
          <div className="mini-song-name">{song.name}</div>
          <div className="mini-artist">{song.artists.join(", ")}</div>
        </div>
      </div>

      <div className="mini-player-controls">
        <button className="mini-ctrl" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
          ⏮
        </button>
        <button className="mini-ctrl mini-play" onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="mini-ctrl" onClick={(e) => { e.stopPropagation(); onNext(); }}>
          ⏭
        </button>
      </div>

      <div className="mini-progress">
        <div className="mini-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
