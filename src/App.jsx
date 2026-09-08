// src/App.jsx
//
// The coordinator of MusePlay application. It manages shared states:
//   - view navigation (Home vs Player page)
//   - theme configuration (dark vs light mode)
//   - filter states (search, genre selection, artist filter)
//   - user library states (favorites, recently played)
//   - state hooks for audio player and catalog loading
// It also sets the active theme accent colors as CSS variables dynamically.

import { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";

import { useSongs } from "./hooks/useSongs";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { buildArtists } from "./utils/buildArtists";
import { buildGenres } from "./utils/buildGenres";
import { SONGS_PER_PAGE } from "./constants/genres";
import { getGenreTheme } from "./constants/genreThemes";

import AmbientBackground, { AI_MOOD_THEMES } from "./components/AmbientBackground";
import HomeView from "./pages/HomeView";
import PlayerView from "./pages/PlayerView";
import QueueDrawer from "./components/QueueDrawer";
import FavoritesView from "./pages/FavoritesView";
import MoodPlaylist from "./components/MoodPlaylist";

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
  const artists = useMemo(() => buildArtists(songs), [songs]);
  const genres = useMemo(() => buildGenres(songs), [songs]);

  // ── Audio/Player Engine (hook handles HTML5 audio events) ─────
  const player = useAudioPlayer(songs);

  // ── View States ────────────────────────────────────────────
  const [view, setView] = useState("home"); // "home" | "player"
  const [darkMode, setDarkMode] = useState(true);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [aiMood, setAiMood] = useState(null); // "rainy" | "night" | "workout" | "party" | "cozy" | "heartbreak"
  const [geminiPlaylistIds, setGeminiPlaylistIds] = useState(new Set());

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
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (!loading && songs.length > 0) {
      setInitialLoaded(true);
    }
  }, [loading, songs]);

  const [activeGenre, setActiveGenre] = useState("All");
  const [selectedArtist, setSelectedArtist] = useState(null);
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
  const homeSongs = useMemo(() => {
    return songs.filter((s) => {
      const genreMatch = activeGenre === "All" || s.genre === activeGenre;
      const artistMatch = selectedArtist ? s.artists.includes(selectedArtist) : true;
      return genreMatch && artistMatch;
    });
  }, [songs, activeGenre, selectedArtist]);

  // ── Derived States: Related songs list on player screen ─────
  const relatedSongs = useMemo(() => {
    if (!currentSong) return [];
    return songs.filter(
      (s) => s.id !== currentSong.id && s.artists.some((a) => currentSong.artists.includes(a))
    );
  }, [currentSong, songs]);

  const relatedTotalPages = useMemo(() => {
    return Math.ceil(relatedSongs.length / SONGS_PER_PAGE) || 1;
  }, [relatedSongs.length]);

  const pagedRelatedSongs = useMemo(() => {
    return relatedSongs.slice(
      (relatedPage - 1) * SONGS_PER_PAGE,
      relatedPage * SONGS_PER_PAGE
    );
  }, [relatedSongs, relatedPage]);

  useEffect(() => {
    setRelatedPage(1);
  }, [player.songIndex]);

  // ── Library Event Handlers ──────────────────────────────────
  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  }, []);

  const handleToggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);
  const handleOpenPlayer = useCallback(() => setView("player"), []);
  const handleOpenQueue = useCallback(() => setIsQueueOpen(true), []);
  const handleCloseQueue = useCallback(() => setIsQueueOpen(false), []);
  const handleGoToFavorites = useCallback(() => setView("favorites"), []);
  const handleGoHome = useCallback(() => {
    setSearchQuery("");
    setView("home");
  }, []);
  const handleOpenGemini = useCallback(() => setIsGeminiOpen(true), []);
  const handleResetMood = useCallback(() => {
    setAiMood(null);
    setGeminiPlaylistIds(new Set());
  }, []);

  // Play from Home browse row: sets the current page/filter list as the active queue
  const playSongFromHome = useCallback((id) => {
    const idStr = String(id);
    if (aiMood && !geminiPlaylistIds.has(idStr)) {
      setAiMood(null);
      setGeminiPlaylistIds(new Set());
    }
    player.playFromQueue(id, homeSongs.map((s) => s.id));
    setView("player");
  }, [homeSongs, player, aiMood, geminiPlaylistIds]);

  // Play from Related shelves: creates a new queue with the selected song and its related songs
  const playSongFromRelated = useCallback((id) => {
    const idStr = String(id);
    if (aiMood && !geminiPlaylistIds.has(idStr)) {
      setAiMood(null);
      setGeminiPlaylistIds(new Set());
    }
    const clicked = songs.find((s) => s.id === id);
    const newRelated = songs.filter(
      (s) => s.id !== id && clicked && s.artists.some((a) => clicked.artists.includes(a))
    );
    player.playFromQueue(id, [id, ...newRelated.map((s) => s.id)]);
  }, [songs, player, aiMood, geminiPlaylistIds]);

  // If a song starts playing outside the Gemini AI playlist, automatically revert the background to normal
  useEffect(() => {
    if (aiMood && player.currentSong?.id) {
      const currentIdStr = String(player.currentSong.id);
      if (geminiPlaylistIds.size > 0 && !geminiPlaylistIds.has(currentIdStr)) {
        setAiMood(null);
        setGeminiPlaylistIds(new Set());
      }
    }
  }, [player.currentSong?.id, aiMood, geminiPlaylistIds]);

  const removeFromQueue = useCallback((songId) => {
    player.setQueue((prev) => {
      const baseQueue = prev || songs.map((s) => s.id);
      const nextQ = baseQueue.filter((id) => id !== songId);
      
      // If we removed the currently playing song, skip forward first
      if (songId === player.currentSong?.id && nextQ.length > 0) {
        player.nextSong();
      }
      return nextQ;
    });
  }, [player, songs]);

  const clearQueue = useCallback(() => {
    player.setQueue(player.currentSong ? [player.currentSong.id] : null);
  }, [player]);

  // ── Dynamic Themes: Auto-cycles every 15 seconds (reduced frequency for performance) ────────────
  const [cycleIndex, setCycleIndex] = useState(0);
  
  useEffect(() => {
    const CYCLING_THEMES = [
      "Bollywood",
      "Romantic",
      "Pop",
      "Classical",
      "Devotional & Spiritual",
      "Electronic",
      "Alternative",
      "Soundtrack",
      "Holiday"
    ];
    const timer = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % CYCLING_THEMES.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const activeBackgroundGenre = [
    "Bollywood",
    "Romantic",
    "Pop",
    "Classical",
    "Devotional & Spiritual",
    "Electronic",
    "Alternative",
    "Soundtrack",
    "Holiday"
  ][cycleIndex];

  const activeMoodTheme = aiMood && AI_MOOD_THEMES[aiMood] ? AI_MOOD_THEMES[aiMood] : null;
  const activeTheme = useMemo(() => {
    return activeMoodTheme || getGenreTheme(activeBackgroundGenre);
  }, [activeMoodTheme, activeBackgroundGenre]);

  const handleAddToQueue = useCallback((id) => {
    player.setQueue((prev) => {
      const current = player.currentSong ? [player.currentSong.id] : [];
      const baseQ = prev || current;
      if (baseQ.includes(id)) return prev;
      return [...baseQ, id];
    });
  }, [player]);

  const handlePlayAll = useCallback((id, orderedIds) => {
    setGeminiPlaylistIds(new Set((orderedIds || []).map(String)));
    player.playFromQueue(id, orderedIds);
    setView("player");
  }, [player]);

  return (
    <div 
      className={`app ${darkMode ? "dark" : "light"} ${aiMood ? `ai-mood-${aiMood}` : ""}`}
      style={{
        "--accent": activeTheme.accent,
        "--accent-rgb": hexToRgb(activeTheme.accent),
        "--accent-secondary": activeTheme.accentSecondary,
        "--accent-secondary-rgb": hexToRgb(activeTheme.accentSecondary),
      }}
    >
      <div className="app-container">
        <div className="overlay">
          {/* Cinematic dynamic background layer with weather & AI mood overlays */}
          <AmbientBackground
            genre={activeBackgroundGenre}
            aiMood={aiMood}
            onResetMood={handleResetMood}
          />

          {/* Loading Catalog State */}
          {!initialLoaded && loading && (
            <div className="app-loader-screen">
              <div className="app-loader-card">
                <div className="app-loader-logo">
                  <div className="app-loader-icon-box">
                    <span style={{ fontSize: "20px" }}>♪</span>
                  </div>
                  <span className="app-loader-brand">MusePlay</span>
                </div>
                <div className="app-loader-wave">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="app-loader-text">Loading catalog & recommendations…</div>
              </div>
            </div>
          )}

          {/* Error Loading State */}
          {error && (
            <div className="home-empty" style={{ paddingTop: "8rem", zIndex: 10 }}>
              <div className="home-empty-icon" style={{ opacity: 0.6, color: "var(--accent)" }}>⚠️</div>
              <div className="home-empty-text" style={{ fontSize: "16px", fontWeight: 600 }}>{error}</div>
            </div>
          )}

          {initialLoaded && !error && view === "home" && (
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
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              player={player}
              onPlaySong={playSongFromHome}
              onOpenPlayer={handleOpenPlayer}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              recentlyPlayed={recentlyPlayed}
              onOpenQueue={handleOpenQueue}
              onGoToFavorites={handleGoToFavorites}
              onGoHome={handleGoHome}
              activeView="home"
              onOpenGemini={handleOpenGemini}
            />
          )}

          {/* Detailed Player Screen */}
          {initialLoaded && !error && view === "player" && currentSong && (
            <PlayerView
              player={player}
              songs={songs}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onGoHome={handleGoHome}
              relatedSongs={relatedSongs}
              pagedRelatedSongs={pagedRelatedSongs}
              relatedPage={relatedPage}
              relatedTotalPages={relatedTotalPages}
              onRelatedPageChange={setRelatedPage}
              onPlayRelated={playSongFromRelated}
              songsCount={songs.length}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onOpenQueue={handleOpenQueue}
              onGoToFavorites={handleGoToFavorites}
              onOpenGemini={handleOpenGemini}
            />
          )}

          {/* Dedicated Favorites Page */}
          {initialLoaded && !error && view === "favorites" && (
            <FavoritesView
              songs={songs}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              player={player}
              onGoHome={handleGoHome}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onOpenQueue={handleOpenQueue}
              onGoToFavorites={handleGoToFavorites}
              activeView="favorites"
            />
          )}

          {/* ══ GLOBAL FLOATING GEMINI AI MOOD DJ (Active on Home, Player, Favorites) ══ */}
          {initialLoaded && !error && (
            <MoodPlaylist
              songs={songs}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onAddToQueue={handleAddToQueue}
              onPlayAll={handlePlayAll}
              hasMiniPlayer={view === "home" && !!player.currentSong}
              isOpen={isGeminiOpen}
              onToggleOpen={setIsGeminiOpen}
              onMoodChange={setAiMood}
              activeMood={aiMood}
            />
          )}

          {/* Slide-over Queue Panel */}
          <QueueDrawer
            isOpen={isQueueOpen}
            onClose={handleCloseQueue}
            songs={songs}
            queue={player.queue || songs.map((s) => s.id)}
            currentSongId={player.songIndex}
            onPlaySong={(id) => {
              if (player.playSong) {
                player.playSong(id);
              } else {
                player.setSongIndex(id);
                player.setIsPlaying(true);
              }
            }}
            onRemoveSong={removeFromQueue}
            onClearQueue={clearQueue}
          />
        </div>
      </div>
      <audio ref={player.audioRef} />
    </div>
  );
}
