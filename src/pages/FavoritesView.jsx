// src/pages/FavoritesView.jsx
// Dedicated Favorites Page. Lists all tracks the user has marked as favorites.
// Integrates play commands, toggle favorite triggers, and clear/empty state screens.

import { Heart, Compass, Home } from "lucide-react";
import Navbar from "../components/Navbar";
import SongGrid from "../components/SongGrid";
import MiniPlayer from "../components/MiniPlayer";

export default function FavoritesView({
  songs,
  searchQuery,
  onSearchChange,
  darkMode,
  onToggleDarkMode,
  player,
  onGoHome,
  favorites = [],
  toggleFavorite,
  onOpenQueue,
  onGoToFavorites,
}) {
  // Resolve song objects for the user's favorites list
  const favoriteSongs = favorites
    .map((fid) => songs.find((s) => s.id === fid))
    .filter(Boolean);

  // Play favorites track, populating the queue with all favorited songs
  const playFavoriteTrack = (id) => {
    player.playFromQueue(
      id,
      favoriteSongs.map((s) => s.id)
    );
  };

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
    <div className="home-view">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onClearSearch={() => onSearchChange("")}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        songs={songs}
        onPlaySong={playFavoriteTrack}
        onOpenQueue={onOpenQueue}
        onGoToFavorites={onGoToFavorites}
        onGoHome={onGoHome}
        activeView="favorites"
      />

      <div className={`home-scroll-area ${player.isPlaying ? "has-mini-player" : ""}`}>
        {/* Dedicated Favorites Page Header Block */}
        <div className="favorites-header-block">
          <button className="favorites-back-btn" onClick={onGoHome}>
            <Home size={14} />
            <span>Dashboard</span>
          </button>
          <div className="favorites-title-row">
            <div className="favorites-title-left">
              <Heart size={28} style={{ color: "#ee5253" }} fill="#ee5253" />
              <h1 className="favorites-title-text">Favorite Songs</h1>
            </div>
            <span className="favorites-count-badge">
              {favoriteSongs.length} {favoriteSongs.length === 1 ? "track" : "tracks"}
            </span>
          </div>
        </div>

        {/* Songs List Section */}
        <div className="section-block songs-section">
          {favoriteSongs.length === 0 ? (
            <div 
              className="home-empty" 
              style={{ 
                background: "var(--bg-surface)", 
                borderRadius: "16px", 
                border: "1px dashed var(--border-medium)",
                padding: "64px 24px"
              }}
            >
              <Heart size={44} style={{ color: "var(--text-tertiary)", opacity: 0.4, marginBottom: "12px" }} />
              <div className="home-empty-text" style={{ fontSize: "16px", fontWeight: 700 }}>Your favorites list is empty</div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "20px", marginTop: "-4px" }}>
                Browse songs on the dashboard and click the heart icon to add them here.
              </p>
              <button className="btn-primary" onClick={onGoHome} type="button">
                <Compass size={16} /> Explore Catalog
              </button>
            </div>
          ) : (
            <SongGrid
              songs={favoriteSongs}
              activeSongId={player.currentSong?.id}
              isPlaying={player.isPlaying}
              onPlay={playFavoriteTrack}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onAddToQueue={handleAddToQueue}
              startIndex={0}
            />
          )}
        </div>

        <div className="home-footer">MusePlay • Redesigned Premium Web Interface</div>
      </div>

      {/* Pinned Bottom Mini Player */}
      {player.currentSong && (
        <MiniPlayer
          song={player.currentSong}
          isPlaying={player.isPlaying}
          progress={player.progress}
          onOpenPlayer={onGoHome} // Return to home page or detailed player if clicked
          onPrev={player.prevSong}
          onTogglePlay={() => player.setIsPlaying((p) => !p)}
          onNext={player.nextSong}
          volume={player.volume}
          onVolumeChange={player.setVolume}
        />
      )}
    </div>
  );
}
