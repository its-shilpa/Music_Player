// src/components/MoodPlaylist.jsx
//
// AI FEATURE: "Gemini AI Mood DJ"
// A floating, beautifully branded AI assistant powered by Google Gemini.
// Users can click the floating pill or open it from the home search bar to
// describe a mood in natural language or pick from quick vibe chips.
// Gemini curates a matching playlist from the existing catalog.

import { useState, useEffect } from "react";
import { Sparkles, Loader2, Play, X, Heart, ListPlus, Radio, Flame, Moon, CloudRain, Coffee, HeartCrack } from "lucide-react";
import { useMoodPlaylist } from "../hooks/useMoodPlaylist";
import SongThumb from "./SongThumb";

const QUICK_MOODS = [
  { label: "Rainy & Calm", icon: CloudRain, prompt: "rainy day, gentle and soothing acoustic tracks" },
  { label: "Late Night Chill", icon: Moon, prompt: "late night deep chill and ambient vibes" },
  { label: "Workout Energy", icon: Flame, prompt: "high energy workout upbeat driving rhythm" },
  { label: "Cafe & Acoustic", icon: Coffee, prompt: "warm coffee shop acoustic indie melodies" },
  { label: "Heartbreak & Soul", icon: HeartCrack, prompt: "emotional heartbreak soulful sad melodies" },
  { label: "Party Dance", icon: Radio, prompt: "energetic party dance crowd pleasing bangers" },
];

export function detectMoodType(moodText, tags = []) {
  const combined = `${moodText || ""} ${(tags || []).join(" ")}`.toLowerCase();
  if (/rain|monsoon|drizzle|storm|water|thunder|cloud/.test(combined)) return "rainy";
  if (/workout|gym|fire|adrenaline|beast|fitness|heavy|power/.test(combined)) return "workout";
  if (/night|midnight|stars|space|dark|nocturnal|sleep|deep/.test(combined)) return "night";
  if (/party|dance|club|disco|electro|banger/.test(combined)) return "party";
  if (/coffee|cafe|acoustic|cozy|warm|sun|morning|autumn/.test(combined)) return "cozy";
  if (/sad|heartbreak|cry|grief|pain|alone|lonely|hurt/.test(combined)) return "heartbreak";
  return null;
}

export default function MoodPlaylist({
  songs,
  favorites = [],
  toggleFavorite,
  onAddToQueue,
  onPlayAll, // (firstId, orderedIds) => void
  hasMiniPlayer = false,
  isOpen: controlledIsOpen,
  onToggleOpen,
  onMoodChange,
  activeMood,
}) {
  const { mood, setMood, picks, playlistTitle, djIntro, vibeTags, loading, error, generate, clear } = useMoodPlaylist(songs);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsModalOpen = (val) => {
    if (onToggleOpen) onToggleOpen(val);
    else setInternalIsOpen(val);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Sync detected mood when vibeTags change
  useEffect(() => {
    if (vibeTags.length > 0 && onMoodChange) {
      const detected = detectMoodType(mood, vibeTags);
      if (detected) onMoodChange(detected);
    }
  }, [vibeTags, mood, onMoodChange]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!mood.trim()) return;
    const detected = detectMoodType(mood);
    if (detected && onMoodChange) onMoodChange(detected);
    generate();
  };

  const handleChipClick = (promptText) => {
    setMood(promptText);
    const detected = detectMoodType(promptText);
    if (detected && onMoodChange) onMoodChange(detected);
    setTimeout(() => {
      generate(promptText);
    }, 50);
  };

  const handlePlayAll = () => {
    if (picks.length === 0) return;
    const detected = detectMoodType(mood, vibeTags);
    if (detected && onMoodChange) onMoodChange(detected);
    onPlayAll(picks[0].song.id, picks.map((p) => p.song.id));
  };

  return (
    <>
      {/* ══ FLOATING ACTION TRIGGER ══ */}
      <button
        type="button"
        className={`gemini-floating-trigger ${hasMiniPlayer ? "with-mini-player" : ""} ${isModalOpen ? "active" : ""}`}
        onClick={() => setIsModalOpen(!isModalOpen)}
        title="Curate music with Gemini AI"
        aria-label="Open Gemini AI Mood DJ"
      >
        <span className="gemini-trigger-sparkle">
          <Sparkles size={17} />
        </span>
        <span className="gemini-trigger-label">Gemini AI DJ</span>
        <span className="gemini-trigger-badge">AI</span>
      </button>

      {/* ══ FLOATING GLASS MODAL / PANEL ══ */}
      {isModalOpen && (
        <div className="gemini-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="gemini-floating-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header with Gemini Branding */}
            <div className="gemini-panel-header">
              <div className="gemini-panel-brand">
                <div className="gemini-logo-icon">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="gemini-panel-title-row">
                    <h3 className="gemini-panel-title">Gemini AI Mood DJ</h3>
                    <span className="gemini-model-badge">Gemini 3.8 Flash</span>
                  </div>
                  <p className="gemini-panel-subtitle">
                    Tell Gemini your mood or vibe, and it curates a custom playlist while transforming the atmosphere.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="gemini-close-btn"
                onClick={() => setIsModalOpen(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Inspiration Mood Chips */}
            <div className="gemini-mood-chips-section">
              <div className="gemini-chips-label">Quick Vibes</div>
              <div className="gemini-mood-chips">
                {QUICK_MOODS.map(({ label, icon: Icon, prompt }) => (
                  <button
                    key={label}
                    type="button"
                    className={`gemini-mood-chip ${mood === prompt ? "active" : ""}`}
                    onClick={() => handleChipClick(prompt)}
                  >
                    <Icon size={13} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ambient Atmosphere Mode Toggle */}
            <div className="gemini-atmosphere-section">
              <div className="gemini-chips-label">Ambient UI Atmosphere</div>
              <div className="gemini-atmosphere-buttons">
                {[
                  { id: "rainy", label: "Rainy & Monsoon", icon: "🌧️" },
                  { id: "night", label: "Midnight Stars", icon: "🌙" },
                  { id: "workout", label: "Adrenaline Fire", icon: "⚡" },
                  { id: "cozy", label: "Warm Acoustic", icon: "☕" },
                  { id: "party", label: "Neon Party", icon: "🎉" },
                  { id: "heartbreak", label: "Heartbreak", icon: "💔" },
                ].map(({ id, label, icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`gemini-atmosphere-btn ${activeMood === id ? "active" : ""}`}
                    onClick={() => onMoodChange?.(activeMood === id ? null : id)}
                    title={`Toggle ${label} atmosphere`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Generator Form */}
            <form className="gemini-input-form" onSubmit={handleSubmit}>
              <div className="gemini-input-wrap">
                <Sparkles size={16} className="gemini-input-icon" />
                <input
                  type="text"
                  className="gemini-input"
                  placeholder="e.g. “sunset drive with friends, uplifting beats”"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  autoFocus
                />
                {mood && (
                  <button
                    type="button"
                    className="gemini-clear-btn"
                    onClick={() => {
                      setMood("");
                      clear();
                    }}
                    title="Clear"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="gemini-generate-btn"
                disabled={loading || !mood.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Curating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Curate Playlist</span>
                  </>
                )}
              </button>
            </form>

            {/* Status / Loading / Error Messages */}
            {loading && (
              <div className="gemini-status-box gemini-loading">
                <div className="gemini-ai-pulse-bar" />
                <div className="gemini-status-text">
                  <Loader2 size={16} className="spin" />
                  <span>Gemini is analyzing tempo, harmonics, and mood for “{mood}”...</span>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="gemini-status-box gemini-error">
                <span>{error}</span>
              </div>
            )}

            {/* Curated Results List */}
            {!loading && picks.length > 0 && (
              <div className="gemini-results-container">
                {/* AI DJ Mixtape Header & Commentary */}
                <div className="gemini-mixtape-card">
                  <div className="gemini-mixtape-header-row">
                    <div className="gemini-mixtape-badge">
                      <Sparkles size={13} />
                      <span>AI DJ Mixtape</span>
                    </div>
                    {vibeTags.length > 0 && (
                      <div className="gemini-vibe-tags-row">
                        {vibeTags.map((tag) => (
                          <span key={tag} className="gemini-vibe-tag-badge">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h4 className="gemini-mixtape-title">{playlistTitle || "Custom Vibe Mixtape"}</h4>

                  {djIntro && (
                    <div className="gemini-dj-commentary-box">
                      <div className="gemini-dj-avatar">🎧</div>
                      <div className="gemini-dj-text">
                        <strong>AI DJ:</strong> “{djIntro}”
                      </div>
                    </div>
                  )}
                </div>

                <div className="gemini-results-header">
                  <div className="gemini-results-count">
                    <Sparkles size={14} />
                    <span>{picks.length} songs picked for you</span>
                  </div>
                  <button
                    type="button"
                    className="btn-primary gemini-play-all-btn"
                    onClick={handlePlayAll}
                  >
                    <Play size={14} fill="currentColor" /> Play All
                  </button>
                </div>

                <div className="gemini-results-list">
                  {picks.map(({ song, reason }) => (
                    <div
                      key={song.id}
                      className="gemini-song-card"
                      onClick={() => onPlayAll(song.id, picks.map((p) => p.song.id))}
                    >
                      <div className="gemini-song-thumb">
                        <SongThumb song={song} />
                        <div className="gemini-thumb-play-overlay">
                          <Play size={16} fill="#fff" color="#fff" />
                        </div>
                      </div>

                      <div className="gemini-song-info">
                        <div className="gemini-song-title-row">
                          <span className="gemini-song-name">{song.name}</span>
                          <span className="gemini-song-genre">{song.genre}</span>
                        </div>
                        <div className="gemini-song-artist">{(song.artists || []).join(", ")}</div>
                        <div className="gemini-reason-tag">
                          <span>“{reason}”</span>
                        </div>
                      </div>

                      <div className="gemini-song-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className={`gemini-action-btn ${favorites.includes(song.id) ? "active" : ""}`}
                          onClick={() => toggleFavorite(song.id)}
                          title="Favorite"
                        >
                          <Heart
                            size={15}
                            fill={favorites.includes(song.id) ? "var(--accent)" : "none"}
                            color={favorites.includes(song.id) ? "var(--accent)" : "currentColor"}
                          />
                        </button>
                        <button
                          type="button"
                          className="gemini-action-btn"
                          onClick={() => onAddToQueue(song.id)}
                          title="Add to queue"
                        >
                          <ListPlus size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
