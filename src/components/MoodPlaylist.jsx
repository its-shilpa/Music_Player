// src/components/MoodPlaylist.jsx
//
// AI FEATURE #2 UI: a text box where the user describes a mood/vibe in
// plain language ("rainy day, need something calm"), and Gemini (via
// server/index.js) picks up to 8 matching songs from the ALREADY LOADED
// catalog - no song is ever invented, only selected.

import { useState } from "react";
import { Sparkles, Loader2, Play, X, Heart, ListPlus } from "lucide-react";
import { useMoodPlaylist } from "../hooks/useMoodPlaylist";
import SongThumb from "./SongThumb";

export default function MoodPlaylist({
  songs,
  favorites = [],
  toggleFavorite,
  onAddToQueue,
  onPlayAll, // (firstId, orderedIds) => void
}) {
  const { mood, setMood, picks, loading, error, generate, clear } = useMoodPlaylist(songs);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setExpanded(true);
    generate();
  };

  const handlePlayAll = () => {
    if (picks.length === 0) return;
    onPlayAll(picks[0].song.id, picks.map((p) => p.song.id));
  };

  return (
    <div className="mood-playlist-card">
      <form className="mood-playlist-form" onSubmit={handleSubmit}>
        <Sparkles size={18} className="mood-playlist-icon" />
        <input
          type="text"
          className="mood-playlist-input"
          placeholder="Describe a mood… e.g. “rainy day, need something calm”"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          onFocus={() => setExpanded(true)}
        />
        {mood && (
          <button
            type="button"
            className="mood-playlist-clear"
            onClick={() => { setMood(""); clear(); }}
          >
            <X size={14} />
          </button>
        )}
        <button type="submit" className="btn-primary mood-playlist-submit" disabled={loading || !mood.trim()}>
          {loading ? <Loader2 size={15} className="spin" /> : "Generate"}
        </button>
      </form>

      {expanded && (
        <div className="mood-playlist-results">
          {loading && (
            <div className="mood-playlist-status">
              <Loader2 size={16} className="spin" /> Finding songs that fit the mood…
            </div>
          )}

          {!loading && error && (
            <div className="mood-playlist-status mood-playlist-error">{error}</div>
          )}

          {!loading && picks.length > 0 && (
            <>
              <div className="mood-playlist-results-header">
                <span>{picks.length} songs picked for you</span>
                <button className="btn-primary" style={{ padding: "6px 14px" }} onClick={handlePlayAll}>
                  <Play size={13} fill="currentColor" /> Play All
                </button>
              </div>
              <div className="mood-playlist-row">
                {picks.map(({ song, reason }) => (
                  <div key={song.id} className="mood-pick-card" onClick={() => onPlayAll(song.id, picks.map((p) => p.song.id))}>
                    <div className="mood-pick-thumb">
                      <SongThumb song={song} />
                    </div>
                    <div className="mood-pick-info">
                      <div className="mood-pick-name">{song.name}</div>
                      <div className="mood-pick-artist">{song.artists.join(", ")}</div>
                      <div className="mood-pick-reason">{reason}</div>
                    </div>
                    <div className="mood-pick-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`shelf-btn fav-btn ${favorites.includes(song.id) ? "active" : ""}`}
                        onClick={() => toggleFavorite(song.id)}
                        title="Add to Favorites"
                      >
                        <Heart size={13} fill={favorites.includes(song.id) ? "currentColor" : "none"} />
                      </button>
                      <button
                        className="shelf-btn"
                        onClick={() => onAddToQueue(song.id)}
                        title="Add to Play Queue"
                      >
                        <ListPlus size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
