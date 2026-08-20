// src/pages/PlayerView.jsx
// Detailed detailed Now Playing view. 
// Uses an asymmetric split layout: left column contains the glowing artwork,
// right column embeds details, progress sliders, a waveform, and controls.

import { useState, useRef, useEffect } from "react";
import { Heart, ListMusic, Home, Sun, Moon, ListPlus } from "lucide-react";
import { makeFallbackSVG } from "../utils/fallbackArt";
import { getLyricsForSong } from "../utils/lyricsProvider";
import ProgressBar from "../components/ProgressBar";
import Waveform from "../components/Waveform";
import PlayerControls from "../components/PlayerControls";
import SongGrid from "../components/SongGrid";

export default function PlayerView({
  player,
  songs = [],
  darkMode,
  onToggleDarkMode,
  onGoHome,
  relatedSongs,
  pagedRelatedSongs,
  relatedPage,
  relatedTotalPages,
  onRelatedPageChange,
  onPlayRelated,
  songsCount,
  favorites = [],
  toggleFavorite,
  onOpenQueue,
  onGoToFavorites,
}) {
  const song = player.currentSong;
  if (!song) return null;

  const isFavorite = favorites.includes(song.id);

  const [activeTab, setActiveTab] = useState("queue"); // "queue" | "lyrics"
  const titleRef = useRef(null);
  const [scrollDist, setScrollDist] = useState(0);
  const lyricsContainerRef = useRef(null);

  // Measure title overflow marquee distance
  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      const overflow = el.scrollWidth - el.clientWidth;
      setScrollDist(overflow > 0 ? overflow : 0);
    }
  }, [song.name]);

  const lyrics = getLyricsForSong(song.name);
  // Find the active lyric line based on current playback time in seconds
  let activeLineIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (player.currentTime >= lyrics[i].time) {
      activeLineIndex = i;
    } else {
      break;
    }
  }

  useEffect(() => {
    const container = lyricsContainerRef.current;
    const activeEl = container?.querySelector(".lyric-line.active");
    if (container && activeEl) {
      const containerHeight = container.clientHeight;
      const elemTop = activeEl.offsetTop;
      const elemHeight = activeEl.clientHeight;
      
      container.scrollTo({
        top: elemTop - containerHeight / 2 + elemHeight / 2,
        behavior: "smooth",
      });
    }
  }, [activeLineIndex]);

  const queueIds = player.queue || [];
  const currentPos = queueIds.indexOf(song.id);
  const nextIds = currentPos !== -1 ? queueIds.slice(currentPos + 1, currentPos + 6) : [];
  const nextSongs = nextIds.map(id => songs.find(s => s.id === id)).filter(Boolean);

  // Helper to add a song to the current play queue
  const handleAddToQueue = (id) => {
    player.setQueue((prev) => {
      const current = player.currentSong ? [player.currentSong.id] : [];
      const baseQ = prev || current;
      if (baseQ.includes(id)) return prev;
      return [...baseQ, id];
    });
  };

  return (
    <div className="player-view">
      {/* Top Navbar */}
      <div className="player-nav">
        <button className="player-back-btn" onClick={onGoHome}>
          <Home size={16} />
          <span>Dashboard</span>
        </button>
        
        <div className="player-nav-title live-now">
          <span className="live-indicator">
            <span className="live-dot" />
            <span className="live-pulse" />
          </span>
          <span className="live-text">Now Playing</span>
          {player.isPlaying && (
            <div className="live-equalizer">
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
            </div>
          )}
        </div>
        
        <div className="nav-actions">
          {/* Open Favorites Page */}
          {onGoToFavorites && (
            <button 
              className="nav-btn" 
              title="Favorite Songs"
              onClick={onGoToFavorites}
            >
              <Heart size={18} />
            </button>
          )}

          {/* Open Queue panel */}
          {onOpenQueue && (
            <button 
              className="nav-btn" 
              title="Open Queue"
              onClick={onOpenQueue}
            >
              <ListMusic size={18} />
            </button>
          )}

          {/* Dark mode toggle */}
          <button className="nav-btn" onClick={onToggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <div className="player-scroll-area">
        {/* Main Panel: Artwork & Detail Panel */}
        <div className="player-main-layout">
          
          {/* Left Column: Artwork with pulsing dynamic glow */}
          <div className="player-artwork-column">
            <div className="player-artwork-glow-wrapper">
              <div className="player-artwork-ambient-glow" />
              {/* Rotating 3D orbit rings */}
              <div className={`player-artwork-orbit-rings ${player.isPlaying ? "playing" : "paused"}`}>
                <div className="orbit-ring ring-1" />
                <div className="orbit-ring ring-2" />
                <div className="orbit-ring ring-3" />
              </div>
              <div className={`player-artwork-card ${player.isPlaying ? "playing" : ""}`}>
                <img
                  src={player.imgSrc || makeFallbackSVG(song.name, song.color)}
                  onError={() => player.setImgSrc(makeFallbackSVG(song.name, song.color))}
                  alt={song.name}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Song metadata + sliders + playback buttons */}
          <div className="player-details-column">
            <div className="player-song-header">
              <div className="player-song-info">
                <div className="player-song-title-wrap">
                  <h1 
                    ref={titleRef}
                    className={`player-song-title ${scrollDist > 0 ? "marquee-active" : ""}`}
                    style={{ "--scroll-dist": `-${scrollDist}px` }}
                    title={song.name}
                  >
                    {song.name}
                  </h1>
                </div>
                <p className="player-song-artist">{song.artists.join(", ")}</p>
                <span className="player-genre-pill">{song.genre}</span>
              </div>
              
              <div className="player-header-actions">
                <button
                  className={`btn-outline ${isFavorite ? "active" : ""}`}
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  onClick={() => toggleFavorite(song.id)}
                >
                  <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                <button
                  className="btn-outline"
                  title="Add to Play Queue (Up Next)"
                  onClick={() => handleAddToQueue(song.id)}
                >
                  <ListPlus size={20} />
                </button>
              </div>
            </div>

            {/* Playback Seek slider */}
            <ProgressBar
              progress={player.progress}
              currentTime={player.currentTime}
              duration={player.duration}
              onSeek={player.seek}
            />

            {/* Audio Waveform visualization */}
            <div className="waveform-container">
              <Waveform isPlaying={player.isPlaying} volume={player.volume} bars={32} />
            </div>

            {/* Playback action controls & volume panel */}
            <PlayerControls
              isShuffle={player.isShuffle}
              isRepeat={player.isRepeat}
              isPlaying={player.isPlaying}
              onToggleShuffle={() => player.setIsShuffle((s) => !s)}
              onPrev={player.prevSong}
              onTogglePlay={() => player.setIsPlaying((p) => !p)}
              onNext={player.nextSong}
              onToggleRepeat={() => player.setIsRepeat((r) => !r)}
              volume={player.volume}
              onVolumeChange={player.setVolume}
            />
          </div>

          {/* Side Panel: Up Next & Synced Lyrics */}
          <div className="player-side-panel">
            <div className="side-panel-tabs">
              <button 
                className={`side-tab ${activeTab === "queue" ? "active" : ""}`}
                onClick={() => setActiveTab("queue")}
                type="button"
              >
                Up Next
              </button>
              <button 
                className={`side-tab ${activeTab === "lyrics" ? "active" : ""}`}
                onClick={() => setActiveTab("lyrics")}
                type="button"
              >
                Lyrics
              </button>
            </div>
            
            <div className="side-panel-content">
              {activeTab === "queue" && (
                <div className="up-next-list">
                  {nextSongs.length === 0 ? (
                    <div className="empty-side-state">
                      <p>Queue is empty.</p>
                      <button className="btn-outline" onClick={onGoHome} style={{ fontSize: "11px", padding: "6px 12px" }} type="button">
                        Browse Songs
                      </button>
                    </div>
                  ) : (
                    nextSongs.map((ns, idx) => (
                      <div 
                        key={ns.id} 
                        className="up-next-item" 
                        onClick={() => player.setSongIndex(ns.id)}
                      >
                        <span className="up-next-num">{idx + 1}</span>
                        <div className="up-next-thumb">
                          <img src={ns.image || makeFallbackSVG(ns.name, ns.color)} alt={ns.name} />
                        </div>
                        <div className="up-next-info">
                          <div className="up-next-name">{ns.name}</div>
                          <div className="up-next-artist">{ns.artists.join(", ")}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {activeTab === "lyrics" && (
                <div className="lyrics-display" ref={lyricsContainerRef}>
                  {lyrics.map((line, idx) => (
                    <p 
                      key={idx} 
                      className={`lyric-line ${idx === activeLineIndex ? "active" : ""}`}
                    >
                      {line.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section: Related Tracks by Same Artist */}
        {/* {relatedSongs.length > 0 && (
          <div className="player-related-section">
            <h2 className="related-title">
              More by {song.artists.length === 1 ? song.artists[0] : song.artists.join(" & ")}
            </h2>
            <SongGrid
              songs={pagedRelatedSongs}
              activeSongId={player.currentSong?.id}
              isPlaying={player.isPlaying}
              onPlay={player.setSongIndex}
              currentPage={relatedPage}
              totalPages={relatedTotalPages}
              onPageChange={onRelatedPageChange}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onAddToQueue={handleAddToQueue}
              startIndex={(relatedPage - 1) * 15}
            />
          </div>
        )} */}

        <div className="home-footer">MusePlay • Redesigned Premium Web Interface • {songsCount} tracks loaded</div>
      </div>
    </div>
  );
}
