// src/App.jsx
//
// The coordinator of MusePlay application. It manages shared states:
//   - view navigation (Home vs Player page)
//   - theme configuration (dark vs light mode)
//   - filter states (search, genre selection, artist filter)
//   - user library states (favorites, recently played)
//   - state hooks for audio player and catalog loading
// It also sets the active theme accent colors as CSS variables dynamically.

import { useState, useEffect, useCallback } from "react";
import "./App.css";

import { useSongs } from "./hooks/useSongs";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { buildArtists } from "./utils/buildArtists";
import { buildGenres } from "./utils/buildGenres";
import { SONGS_PER_PAGE } from "./constants/genres";
import { getGenreTheme } from "./constants/genreThemes";

import AmbientBackground from "./components/AmbientBackground";
import HomeView from "./pages/HomeView";
import PlayerView from "./pages/PlayerView";
import QueueDrawer from "./components/QueueDrawer";
import FavoritesView from "./pages/FavoritesView";

// Utility to convert hex color values to RGB format for CSS translucency effects
function hexToRgb(hex) {
  if (!hex) return "168, 85, 247";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "168, 85, 247";
}

export default function App() {
  // ── Data Loading: Fetch songs catalog ───────────────────────
  const { songs, loading, error, search, loadDefaultCatalog } = useSongs();
  const artists = buildArtists(songs);
  const genres = buildGenres(songs);

  // ── Audio/Player Engine (hook handles HTML5 audio events) ─────
  const player = useAudioPlayer(songs);

  // ── View States ────────────────────────────────────────────
  const [view, setView] = useState("home"); // "home" | "player"
  const [darkMode, setDarkMode] = useState(true);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // ── Library / User States ──────────────────────────────────
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("museplay_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem("museplay_recently_played");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites state changes to local storage
  useEffect(() => {
    localStorage.setItem("museplay_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Sync recently played tracks to local storage
  useEffect(() => {
    localStorage.setItem("museplay_recently_played", JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Automatically append to history when a new song starts playing
  const currentSong = player.currentSong;
  useEffect(() => {
    if (currentSong?.id) {
      setRecentlyPlayed((prev) => {
        const filtered = prev.filter((id) => id !== currentSong.id);
        return [currentSong.id, ...filtered].slice(0, 8); // Keep last 8 strictly
      });
    }
  }, [currentSong?.id]);

  // ── Home Page Filters ──────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [homePage, setHomePage] = useState(1);
  const [relatedPage, setRelatedPage] = useState(1);

  // Debounced search: fetch from iTunes API 400ms after user finishes typing
  useEffect(() => {
    const query = searchQuery.trim();
    const timer = setTimeout(() => {
      if (query) {
        search(query);
      } else {
        loadDefaultCatalog();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, search, loadDefaultCatalog]);

  // If the user is on the favorites page and starts searching, route them back to home search results
  useEffect(() => {
    if (searchQuery.trim() && view === "favorites") {
      setView("home");
    }
  }, [searchQuery, view]);

  // ── Derived States: Filter catalog for the browse screen ────
  const homeSongs = songs.filter((s) => {
    const genreMatch = activeGenre === "All" || s.genre === activeGenre;
    const artistMatch = selectedArtist ? s.artists.includes(selectedArtist) : true;
    return genreMatch && artistMatch;
  });
  const homeTotalPages = Math.ceil(homeSongs.length / SONGS_PER_PAGE) || 1;
  const pagedHomeSongs = homeSongs.slice(
    (homePage - 1) * SONGS_PER_PAGE,
    homePage * SONGS_PER_PAGE
  );

  // Reset browse view back to page 1 on filter changes
  useEffect(() => {
    setHomePage(1);
  }, [searchQuery, activeGenre, selectedArtist]);

  // ── Derived States: Related songs list on player screen ─────
  const relatedSongs = currentSong
    ? songs.filter(
        (s) => s.id !== currentSong.id && s.artists.some((a) => currentSong.artists.includes(a))
      )
    : [];
  const relatedTotalPages = Math.ceil(relatedSongs.length / SONGS_PER_PAGE) || 1;
  const pagedRelatedSongs = relatedSongs.slice(
    (relatedPage - 1) * SONGS_PER_PAGE,
    relatedPage * SONGS_PER_PAGE
  );

  useEffect(() => {
    setRelatedPage(1);
  }, [player.songIndex]);

  // ── Library Event Handlers ──────────────────────────────────
  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  }, []);

  // Play from Home browse row: sets the current page/filter list as the active queue
  const playSongFromHome = useCallback((id) => {
    player.playFromQueue(id, homeSongs.map((s) => s.id));
    setView("player");
  }, [homeSongs, player]);

  // Play from Related shelves: creates a new queue with the selected song and its related songs
  const playSongFromRelated = useCallback((id) => {
    const clicked = songs.find((s) => s.id === id);
    const newRelated = songs.filter(
      (s) => s.id !== id && clicked && s.artists.some((a) => clicked.artists.includes(a))
    );
    player.playFromQueue(id, [id, ...newRelated.map((s) => s.id)]);
  }, [songs, player]);

  // Queue modification handlers
  const removeFromQueue = useCallback((songId) => {
    if (player.queue) {
      player.setQueue((prev) => {
        if (!prev) return null;
        const nextQ = prev.filter((id) => id !== songId);
        // If we removed the currently playing song, skip forward first
        if (songId === player.songIndex && nextQ.length > 0) {
          player.nextSong();
        }
        return nextQ;
      });
    }
  }, [player]);

  const clearQueue = useCallback(() => {
    player.setQueue(player.currentSong ? [player.currentSong.id] : null);
  }, [player]);

  // ── Dynamic Themes ──────────────────────────────────────────
  // Resolve theme background based on current playing song, active genre filter, or default
  const activeBackgroundGenre = currentSong ? currentSong.genre : (activeGenre !== "All" ? activeGenre : null);
  const activeTheme = getGenreTheme(activeBackgroundGenre);

  return (
    <div 
      className={`app ${darkMode ? "dark" : "light"}`}
      style={{
        "--accent": activeTheme.accent,
        "--accent-rgb": hexToRgb(activeTheme.accent),
        "--accent-secondary": activeTheme.accentSecondary,
        "--accent-secondary-rgb": hexToRgb(activeTheme.accentSecondary),
      }}
    >
      <div className="app-container">
        <div className="overlay">
          {/* Cinematic dynamic background layer */}
          <AmbientBackground genre={activeBackgroundGenre} />

          {/* Loading Catalog State */}
          {loading && songs.length === 0 && (
            <div className="home-empty" style={{ paddingTop: "8rem", zIndex: 10 }}>
              <div className="song-row-playing-indicator" style={{ width: "24px", height: "24px", margin: "0 auto 16px" }}>
                <div className="song-row-playing-bar" style={{ width: "4px" }} />
                <div className="song-row-playing-bar" style={{ width: "4px" }} />
                <div className="song-row-playing-bar" style={{ width: "4px" }} />
              </div>
              <div className="home-empty-text" style={{ fontSize: "16px", fontWeight: 600 }}>Loading MusePlay Catalog…</div>
            </div>
          )}

          {/* Error Loading State */}
          {error && (
            <div className="home-empty" style={{ paddingTop: "8rem", zIndex: 10 }}>
              <div className="home-empty-icon" style={{ opacity: 0.6, color: "var(--accent)" }}>⚠️</div>
              <div className="home-empty-text" style={{ fontSize: "16px", fontWeight: 600 }}>{error}</div>
            </div>
          )}

          {!loading && !error && view === "home" && (
            <HomeView
              songs={songs}
              artists={artists}
              genres={genres}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeGenre={activeGenre}
              onGenreChange={setActiveGenre}
              selectedArtist={selectedArtist}
              onArtistChange={setSelectedArtist}
              homeSongs={homeSongs}
              pagedHomeSongs={pagedHomeSongs}
              homePage={homePage}
              homeTotalPages={homeTotalPages}
              onHomePageChange={setHomePage}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode((d) => !d)}
              player={player}
              onPlaySong={playSongFromHome}
              onOpenPlayer={() => setView("player")}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              recentlyPlayed={recentlyPlayed}
              onOpenQueue={() => setIsQueueOpen(true)}
              onGoToFavorites={() => setView("favorites")}
              onGoHome={() => setView("home")}
              activeView="home"
            />
          )}

          {/* Detailed Player Screen */}
          {!loading && !error && view === "player" && currentSong && (
            <PlayerView
              player={player}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode((d) => !d)}
              onGoHome={() => setView("home")}
              relatedSongs={relatedSongs}
              pagedRelatedSongs={pagedRelatedSongs}
              relatedPage={relatedPage}
              relatedTotalPages={relatedTotalPages}
              onRelatedPageChange={setRelatedPage}
              onPlayRelated={playSongFromRelated}
              songsCount={songs.length}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onOpenQueue={() => setIsQueueOpen(true)}
              onGoToFavorites={() => setView("favorites")}
            />
          )}

          {/* Dedicated Favorites Page */}
          {!loading && !error && view === "favorites" && (
            <FavoritesView
              songs={songs}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode((d) => !d)}
              player={player}
              onGoHome={() => setView("home")}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onOpenQueue={() => setIsQueueOpen(true)}
              onGoToFavorites={() => setView("favorites")}
              activeView="favorites"
            />
          )}

          {/* Slide-over Queue Panel */}
          <QueueDrawer
            isOpen={isQueueOpen}
            onClose={() => setIsQueueOpen(false)}
            songs={songs}
            queue={player.queue || songs.map((s) => s.id)}
            currentSongId={player.songIndex}
            onPlaySong={(id) => player.setSongIndex(id)}
            onRemoveSong={removeFromQueue}
            onClearQueue={clearQueue}
          />
        </div>
      </div>
      <audio ref={player.audioRef} />
    </div>
  );
}
