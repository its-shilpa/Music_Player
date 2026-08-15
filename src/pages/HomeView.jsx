// src/pages/HomeView.jsx
// Redesigned browsing and music discovery dashboard.
// Features a featured song Hero, scrollable carousels with chevron buttons
// (Recently Played, Explore Genres, Artists), and a responsive song table.

import { Play, Pause, Heart, Plus, Compass, History, ListMusic } from "lucide-react";
import Navbar from "../components/Navbar";
import GenreChips from "../components/GenreChips";
import ArtistBubble from "../components/ArtistBubble";
import SongGrid from "../components/SongGrid";
import MiniPlayer from "../components/MiniPlayer";
import SongThumb from "../components/SongThumb";
import CarouselContainer from "../components/CarouselContainer";
import { SONGS_PER_PAGE } from "../constants/genres";

export default function HomeView({
  songs,
  artists,
  genres,
  searchQuery,
  onSearchChange,
  activeGenre,
  onGenreChange,
  selectedArtist,
  onArtistChange,
  homeSongs,
  pagedHomeSongs,
  homePage,
  homeTotalPages,
  onHomePageChange,
  darkMode,
  onToggleDarkMode,
  player,
  onPlaySong,
  onOpenPlayer,
  favorites = [],
  toggleFavorite,
  recentlyPlayed = [],
  onOpenQueue,
  onGoToFavorites,
  onGoHome,
  activeView = "home",
}) {
  // Determine Featured Hero song (prefer current playing song, otherwise the first track in catalog)
  const featuredSong = player.currentSong || songs[0];
  const isFeaturedPlaying = player.isPlaying && player.currentSong?.id === featuredSong?.id;

  // Resolve recently played tracks from history cache (max 8)
  const historySongs = recentlyPlayed
    .map((rid) => songs.find((s) => s.id === rid))
    .filter(Boolean)
    // Filter out the currently playing song to avoid showing duplicates
    .filter((s) => s.id !== player.currentSong?.id)
    .slice(0, 8);

  // Helper to append a track to the upcoming audio player queue
  const handleAddToQueue = (id) => {
    player.setQueue((prev) => {
      const current = player.currentSong ? [player.currentSong.id] : [];
      const baseQ = prev || current;
      if (baseQ.includes(id)) return prev; // Avoid duplicate queue insertions
      return [...baseQ, id];
    });
  };

  return (
    <div className="home-view">
      {/* Top Header Bar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          onSearchChange(value);
          onGenreChange("All");
          onArtistChange(null);
        }}
        onClearSearch={() => onSearchChange("")}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        songs={songs}
        onPlaySong={onPlaySong}
        onOpenQueue={onOpenQueue}
        onGoToFavorites={onGoToFavorites}
        onGoHome={onGoHome}
        activeView={activeView}
      />

      <div className={`home-scroll-area ${player.isPlaying ? "has-mini-player" : ""}`}>
        {/* Render Discovery components only if no search queries and artist filters are active */}
        {!searchQuery && !selectedArtist && (
          <>
            {/* Featured Hero Section */}
            {featuredSong && (
              <div className="featured-hero-container">
                <div className="featured-hero">
                  <div className="featured-art-wrapper">
                    <SongThumb song={featuredSong} className="featured-cover-img" />
                  </div>
                  <div className="featured-content">
                    <span className="featured-badge">Featured Music</span>
                    <h1 className="featured-title">{featuredSong.name}</h1>
                    <p className="featured-artist">{featuredSong.artists.join(", ")}</p>
                    <div className="featured-meta">
                      <span>{featuredSong.genre}</span>
                      <span className="featured-meta-dot" />
                      <span>iTunes catalog selection</span>
                    </div>
                    <div className="featured-actions">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          if (isFeaturedPlaying) {
                            player.setIsPlaying(false);
                          } else if (player.currentSong?.id === featuredSong.id) {
                            player.setIsPlaying(true);
                          } else {
                            onPlaySong(featuredSong.id);
                          }
                        }}
                      >
                        {isFeaturedPlaying ? (
                          <>
                            <Pause size={16} fill="currentColor" /> Pause
                          </>
                        ) : (
                          <>
                            <Play size={16} fill="currentColor" /> Play Now
                          </>
                        )}
                      </button>
                      
                      <button
                        className={`btn-outline ${favorites.includes(featuredSong.id) ? "active" : ""}`}
                        title="Add to Favorites"
                        onClick={() => toggleFavorite(featuredSong.id)}
                      >
                        <Heart size={18} fill={favorites.includes(featuredSong.id) ? "currentColor" : "none"} />
                      </button>

                      <button
                        className="btn-outline"
                        title="Queue song"
                        onClick={() => handleAddToQueue(featuredSong.id)}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shelf: Recently Played (excluding currently playing, max 8, carousel-arrow-driven) */}
            {historySongs.length > 0 && (
              <div className="section-block">
                <h2 className="section-title">
                  <History size={18} style={{ color: "var(--accent)" }} />
                  <span>Recently Played</span>
                </h2>
                <CarouselContainer paddingClass="recently-played-carousel-content">
                  {historySongs.map((song) => (
                    <div key={`hist-${song.id}`} className="shelf-card" style={{ width: "290px", flexShrink: 0 }} onClick={() => onPlaySong(song.id)}>
                      <div className="shelf-art">
                        <SongThumb song={song} />
                        <div className="shelf-hover-play">
                          <Play size={14} fill="currentColor" />
                        </div>
                      </div>
                      <div className="shelf-details">
                        <div className="shelf-title">{song.name}</div>
                        <div className="shelf-artist">{song.artists.join(", ")}</div>
                      </div>
                      <div className="shelf-actions" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className={`shelf-btn fav-btn ${favorites.includes(song.id) ? "active" : ""}`} 
                          onClick={() => toggleFavorite(song.id)}
                        >
                          <Heart size={14} fill={favorites.includes(song.id) ? "currentColor" : "none"} />
                        </button>
                        <button className="shelf-btn" onClick={() => handleAddToQueue(song.id)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </CarouselContainer>
              </div>
            )}
          </>
        )}

        {/* Shelf: Genre Filter Strip (wrapped in scrollbar-free carousel with chevrons) */}
        {!searchQuery && (
          <div className="section-block">
            <h2 className="section-title">
              <Compass size={18} style={{ color: "var(--accent)" }} />
              <span>Explore Genres</span>
            </h2>
            <CarouselContainer paddingClass="genre-carousel-content">
              <GenreChips
                genres={genres}
                activeGenre={activeGenre}
                onSelect={(g) => {
                  onGenreChange(g);
                  onArtistChange(null);
                }}
              />
            </CarouselContainer>
          </div>
        )}

        {/* Shelf: Popular Artists bubbles (wrapped in scrollbar-free carousel with chevrons) */}
        {!searchQuery && activeGenre === "All" && !selectedArtist && (
          <div className="section-block">
            <h2 className="section-title">Popular Artists</h2>
            <CarouselContainer paddingClass="artists-carousel-content">
              {artists.map((artist) => (
                <ArtistBubble
                  key={artist.name}
                  artist={artist}
                  onClick={() => onArtistChange(artist.name)}
                />
              ))}
            </CarouselContainer>
          </div>
        )}

        {/* Search & Filter Header states */}
        {selectedArtist && (
          <div className="filter-header" style={{ padding: "16px 32px 8px" }}>
            <button className="filter-back-btn" onClick={() => onArtistChange(null)}>
              ← Back to Dashboard
            </button>
            <div className="filter-label">
              <span className="filter-label-text">Artist: {selectedArtist}</span>
              <span className="filter-count">{homeSongs.length} songs</span>
            </div>
          </div>
        )}

        {searchQuery && (
          <div className="filter-header" style={{ padding: "16px 32px 8px" }}>
            <span className="filter-label-text">Results for "{searchQuery}"</span>
            <span className="filter-count">{homeSongs.length} tracks</span>
          </div>
        )}

        {/* Songs List Section */}
        <div className="section-block songs-section">
          {!searchQuery && !selectedArtist && (
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ListMusic size={18} style={{ color: "var(--accent)" }} />
              <span>{activeGenre === "All" ? "All Songs" : activeGenre}</span>
            </h2>
          )}

          {homeSongs.length === 0 ? (
            <div className="home-empty" style={{ background: "var(--bg-surface)", borderRadius: "12px", border: "1px dashed var(--border-medium)" }}>
              <div className="home-empty-icon" style={{ color: "var(--accent)", fontSize: "28px" }}>♪</div>
              <div className="home-empty-text">No tracks match your query</div>
            </div>
          ) : (
            <SongGrid
              songs={pagedHomeSongs}
              activeSongId={player.currentSong?.id}
              isPlaying={player.isPlaying}
              onPlay={onPlaySong}
              currentPage={homePage}
              totalPages={homeTotalPages}
              onPageChange={onHomePageChange}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onAddToQueue={handleAddToQueue}
              startIndex={(homePage - 1) * SONGS_PER_PAGE}
            />
          )}
        </div>

        <div className="home-footer">MusePlay • Redesigned Premium Web Interface • {songs.length} tracks loaded</div>
      </div>

      {/* Pinned Bottom Mini Player */}
      {player.currentSong && (
        <MiniPlayer
          song={player.currentSong}
          isPlaying={player.isPlaying}
          progress={player.progress}
          onOpenPlayer={onOpenPlayer}
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
