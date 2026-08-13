// src/App.jsx
//
// This file used to be ~750 lines doing everything: fetching songs, all
// player state, and the full JSX for both screens. Now it's the
// "coordinator" - it owns the pieces of state that multiple screens need
// to share (which view is open, what's selected, current filters), and
// delegates:
//   - audio/player logic      -> hooks/useAudioPlayer.js
//   - fetching songs          -> hooks/useSongs.js
//   - rendering the browse UI -> pages/HomeView.jsx
//   - rendering the player UI -> pages/PlayerView.jsx
//
// If you want to trace a feature end to end, start here, then follow the
// prop names into the page/hook that actually implements it.

import { useState, useEffect } from "react";
import "./App.css";

import { useSongs } from "./hooks/useSongs";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { buildArtists } from "./utils/buildArtists";
import { SONGS_PER_PAGE } from "./constants/genres";

import AmbientBackground from "./components/AmbientBackground";
import HomeView from "./pages/HomeView";
import PlayerView from "./pages/PlayerView";

export default function App() {
  // ── Data: songs coming from the API ───────────────────────
  const { songs, loading, error, reload } = useSongs();
  const artists = buildArtists(songs);

  // ── Audio/player engine (see hooks/useAudioPlayer.js) ─────
  const player = useAudioPlayer(songs);

  // ── Which screen is showing ────────────────────────────────
  const [view, setView] = useState("home"); // "home" | "player"
  const [darkMode, setDarkMode] = useState(true);

  // ── Home page filters ──────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [homePage, setHomePage] = useState(1);
  const [relatedPage, setRelatedPage] = useState(1);

  // Debounced live search: 400ms after the user stops typing, re-query the
  // API instead of only filtering the initially-loaded catalog. Clearing
  // the box goes back to the default catalog.
  useEffect(() => {
    const query = searchQuery.trim();
    const timer = setTimeout(() => {
      reload(query || "arijit singh");
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, reload]);

  // ── Derived: home song list (search box only narrows what's already
  // loaded for genre/artist, since the API call above already narrowed by
  // search text) ──────────────────────────────────────────────
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
  useEffect(() => {
    setHomePage(1);
  }, [searchQuery, activeGenre, selectedArtist]);

  // ── Derived: related songs on the player page ─────────────
  const currentSong = player.currentSong;
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

  // ── Play actions ────────────────────────────────────────────
  // Play from the home list -> "up next" queue is whatever's currently
  // filtered/visible on the home page.
  const playSongFromHome = (id) => {
    player.playFromQueue(id, homeSongs.map((s) => s.id));
    setView("player");
  };

  // Play from the "More by X" section -> new queue built from that song's
  // own related songs.
  const playSongFromRelated = (id) => {
    const clicked = songs.find((s) => s.id === id);
    const newRelated = songs.filter(
      (s) => s.id !== id && clicked && s.artists.some((a) => clicked.artists.includes(a))
    );
    player.playFromQueue(id, [id, ...newRelated.map((s) => s.id)]);
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="app-container">
        <div className="overlay">
          <AmbientBackground />

          {loading && songs.length === 0 && (
            <div className="home-empty" style={{ paddingTop: "4rem" }}>
              <div className="home-empty-icon">♪</div>
              <div className="home-empty-text">Loading songs…</div>
            </div>
          )}

          {error && (
            <div className="home-empty" style={{ paddingTop: "4rem" }}>
              <div className="home-empty-text">{error}</div>
            </div>
          )}

          {!loading && !error && view === "home" && (
            <HomeView
              songs={songs}
              artists={artists}
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
            />
          )}

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
            />
          )}
        </div>
      </div>
      <audio ref={player.audioRef} />
    </div>
  );
}
