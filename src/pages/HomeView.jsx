// src/pages/HomeView.jsx
// The browse/search screen: nav, genre chips, artist bubbles, song grid,
// and the mini player pinned to the bottom. All the "what should be
// visible right now" logic (search vs genre vs artist filter) lives here,
// close to the JSX that renders it - App.jsx just hands down data + setters.
import Navbar from "../components/Navbar";
import GenreChips from "../components/GenreChips";
import ArtistBubble from "../components/ArtistBubble";
import SongGrid from "../components/SongGrid";
import MiniPlayer from "../components/MiniPlayer";

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
}) {
  return (
    <div className="home-view">
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
      />

      <div className={`home-scroll-area${player.isPlaying ? " has-mini-player" : ""}`}>
        {!searchQuery && !selectedArtist && (
          <div className="home-hero">
            <h1 className="hero-title">Good evening 🎵</h1>
            <p className="hero-sub">What are you in the mood for?</p>
          </div>
        )}

        {!searchQuery && (
          <div className="section-block">
            <GenreChips
              genres={genres}
              activeGenre={activeGenre}
              onSelect={(g) => {
                onGenreChange(g);
                onArtistChange(null);
              }}
            />
          </div>
        )}

        {!searchQuery && activeGenre === "All" && !selectedArtist && (
          <div className="section-block">
            <h2 className="section-title">Artists</h2>
            <div className="artists-row">
              {artists.map((artist) => (
                <ArtistBubble
                  key={artist.name}
                  artist={artist}
                  onClick={() => onArtistChange(artist.name)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedArtist && (
          <div className="filter-header">
            <button className="filter-back-btn" onClick={() => onArtistChange(null)}>
              ← Back
            </button>
            <div className="filter-label">
              <span className="filter-label-text">{selectedArtist}</span>
              <span className="filter-count">{homeSongs.length} songs</span>
            </div>
          </div>
        )}

        {searchQuery && (
          <div className="filter-header">
            <span className="filter-label-text">Results for "{searchQuery}"</span>
            <span className="filter-count">{homeSongs.length} found</span>
          </div>
        )}

        <div className="section-block">
          {!searchQuery && !selectedArtist && (
            <h2 className="section-title">{activeGenre === "All" ? "All Songs" : activeGenre}</h2>
          )}

          {homeSongs.length === 0 ? (
            <div className="home-empty">
              <div className="home-empty-icon">♪</div>
              <div className="home-empty-text">No songs found</div>
            </div>
          ) : (
            <SongGrid
              songs={pagedHomeSongs}
              activeSongId={player.songIndex}
              isPlaying={player.isPlaying}
              onPlay={onPlaySong}
              currentPage={homePage}
              totalPages={homeTotalPages}
              onPageChange={onHomePageChange}
            />
          )}
        </div>

        <div className="home-footer">MusePlay · {songs.length} songs</div>
      </div>

      {player.isPlaying && player.currentSong && (
        <MiniPlayer
          song={player.currentSong}
          isPlaying={player.isPlaying}
          progress={player.progress}
          onOpenPlayer={onOpenPlayer}
          onPrev={player.prevSong}
          onTogglePlay={() => player.setIsPlaying((p) => !p)}
          onNext={player.nextSong}
        />
      )}
    </div>
  );
}
