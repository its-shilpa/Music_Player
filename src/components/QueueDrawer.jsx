// src/components/QueueDrawer.jsx
// Slide-over drawer displaying the queue ("Up Next"), current song,
// and providing queue management controls (play, remove, clear).

import { X, Trash2, Play, Music } from "lucide-react";
import SongThumb from "./SongThumb";

export default function QueueDrawer({
  isOpen,
  onClose,
  songs,
  queue,
  currentSongId,
  onPlaySong,
  onRemoveSong,
  onClearQueue,
}) {
  // Resolve currently playing track
  const currentSong = songs.find((s) => s.id === currentSongId);

  // Determine index of current song to slice upcoming tracks
  const currentIdx = queue.indexOf(currentSongId);
  const upNextIds = currentIdx !== -1 ? queue.slice(currentIdx + 1) : queue;
  
  // Resolve song objects for the upcoming queue
  const upNextSongs = upNextIds
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div 
      className={`queue-drawer-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div 
        className="queue-drawer"
        onClick={(e) => e.stopPropagation()} // Prevent closing drawer on clicking inside
      >
        <div className="queue-drawer-header">
          <h2 className="queue-drawer-title">Play Queue</h2>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {upNextSongs.length > 0 && (
              <button 
                className="queue-close-btn"
                title="Clear queue"
                onClick={onClearQueue}
              >
                <Trash2 size={16} />
              </button>
            )}
            <button 
              className="queue-close-btn"
              title="Close panel"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="queue-items-container">
          {/* Section: Now Playing */}
          {currentSong && (
            <div style={{ marginBottom: "20px" }}>
              <h3 className="queue-section-label">Now Playing</h3>
              <div className="queue-card active">
                <div className="queue-card-art">
                  <SongThumb song={currentSong} />
                </div>
                <div className="queue-card-info">
                  <div className="queue-card-title">{currentSong.name}</div>
                  <div className="queue-card-artist">{currentSong.artists.join(", ")}</div>
                </div>
                <div className="song-row-playing-indicator" style={{ marginRight: "8px" }}>
                  <div className="song-row-playing-bar" />
                  <div className="song-row-playing-bar" />
                  <div className="song-row-playing-bar" />
                </div>
              </div>
            </div>
          )}

          {/* Section: Up Next */}
          <div>
            <h3 className="queue-section-label">
              Up Next {upNextSongs.length > 0 && `(${upNextSongs.length})`}
            </h3>
            
            {upNextSongs.length === 0 ? (
              <div className="queue-empty-state">
                <Music size={24} style={{ opacity: 0.3, marginBottom: "8px" }} />
                <div>Queue is empty</div>
                <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
                  Add songs from the home screen
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {upNextSongs.map((song, idx) => (
                  <div key={`${song.id}-${idx}`} className="queue-card">
                    <div className="queue-card-art">
                      <SongThumb song={song} />
                      <button 
                        className="queue-card-play-btn"
                        onClick={() => onPlaySong(song.id)}
                      >
                        <Play size={10} fill="currentColor" />
                      </button>
                    </div>
                    <div className="queue-card-info">
                      <div className="queue-card-title">{song.name}</div>
                      <div className="queue-card-artist">{song.artists.join(", ")}</div>
                    </div>
                    <button 
                      className="queue-card-btn"
                      title="Remove from queue"
                      onClick={() => onRemoveSong(song.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
