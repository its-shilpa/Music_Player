// src/pages/PlayerView.jsx
// Detailed detailed Now Playing view. 
// Uses an asymmetric split layout: left column contains the glowing artwork,
// right column embeds details, progress sliders, a waveform, and controls.

import { Heart, ListMusic, Home, Sun, Moon, ListPlus } from "lucide-react";
import { makeFallbackSVG } from "../utils/fallbackArt";
import ProgressBar from "../components/ProgressBar";
import Waveform from "../components/Waveform";
import PlayerControls from "../components/PlayerControls";
import SongGrid from "../components/SongGrid";

export default function PlayerView({
  player,
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
        
        <div className="player-nav-title">Now Playing</div>
        
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
                <h1 className="player-song-title">{song.name}</h1>
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
              <Waveform isPlaying={player.isPlaying} bars={32} />
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
        </div>

        {/* Section: Related Tracks by Same Artist */}
        {relatedSongs.length > 0 && (
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
        )}

        <div className="home-footer">MusePlay • Redesigned Premium Web Interface • {songsCount} tracks loaded</div>
      </div>
    </div>
  );
}
