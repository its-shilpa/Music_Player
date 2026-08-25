// src/components/Navbar.jsx
// Redesigned navigation bar containing the MusePlay brand header,
// an interactive search bar with matching live suggestions,
// dark/light mode toggle, play queue toggle, and favorites page route.

import { useState, useRef, useEffect } from "react";
import { Search, X, Sun, Moon, ListMusic, Music, Heart, Mic } from "lucide-react";
import SongThumb from "./SongThumb";
import { useVoiceSearch } from "../hooks/useVoiceSearch";

export default function Navbar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  darkMode,
  onToggleDarkMode,
  songs = [],
  onPlaySong,
  onOpenQueue,
  onGoToFavorites,
  onGoHome,
  activeView = "home",
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // AI FEATURE: voice search. Runs entirely in-browser (Web Speech API),
  // no key/backend needed. Speaking a query fills the search box exactly
  // like typing it would, so it plugs into the existing debounced search.
  const { isListening, isSupported, start, stop } = useVoiceSearch((transcript) => {
    onSearchChange(transcript);
    setShowSuggestions(true);
  });

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter first 5 tracks matching the search query as suggestions
  const suggestions = searchQuery.trim()
    ? songs
        .filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.artists.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleBrandClick = () => {
    if (onGoHome) onGoHome();
    if (onClearSearch) onClearSearch();
  };

  return (
    <nav className="home-nav">
      {/* Brand Logo & Title */}
      <div className="home-nav-brand" onClick={handleBrandClick}>
        <span className="brand-icon">
          <Music size={24} strokeWidth={2.5} />
        </span>
        <span className="brand-name">MusePlay</span>
      </div>

      {/* Controlled Search Box with suggestions dropdown */}
      <div className="home-search-container" ref={searchContainerRef}>
        <div className="home-search-wrap">
          <span className="home-search-icon">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="home-search-input"
            placeholder="Search songs, artists, genres..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {searchQuery && (
            <button className="home-search-clear" onClick={onClearSearch}>
              <X size={16} />
            </button>
          )}

          {/* Voice search mic - only rendered if the browser actually supports it */}
          {isSupported && (
            <button
              type="button"
              className={`home-search-mic ${isListening ? "listening" : ""}`}
              title={isListening ? "Listening… click to stop" : "Search by voice"}
              onClick={() => (isListening ? stop() : start())}
            >
              <Mic size={16} />
            </button>
          )}
        </div>

        

        {/* Live Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions-dropdown">
            <div 
              style={{ 
                padding: "4px 16px 8px", 
                fontSize: "11px", 
                fontWeight: 700, 
                color: "var(--text-tertiary)", 
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Suggested Tracks
            </div>
            {suggestions.map((song) => (
              <button
                key={song.id}
                className="suggestion-item"
                onClick={() => {
                  if (onPlaySong) onPlaySong(song.id);
                  setShowSuggestions(false);
                }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                  <SongThumb song={song} />
                </div>
                <div>
                  <div className="suggestion-text-main">{song.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    {song.artists.join(", ")}
                  </div>
                </div>
                <span className="suggestion-text-sub">{song.genre}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Header Actions: Favorites, Theme, Queue */}
      <div className="nav-actions">
        {/* Toggle Favorites Page */}
        {onGoToFavorites && (
          <button 
            className={`nav-btn ${activeView === "favorites" ? "active" : ""}`} 
            title="Favorite Songs"
            onClick={onGoToFavorites}
            type="button"
          >
            <Heart 
              size={18} 
              fill={activeView === "favorites" ? "#ee5253" : "none"} 
              style={activeView === "favorites" ? { color: "#ee5253" } : {}}
            />
          </button>
        )}

        {/* Toggle Play Queue panel */}
        {onOpenQueue && (
          <button 
            className="nav-btn" 
            title="Open Queue"
            onClick={onOpenQueue}
            type="button"
          >
            <ListMusic size={18} />
          </button>
        )}

        {/* Light/Dark Toggle */}
        <button 
          className="nav-btn" 
          onClick={onToggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          type="button"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
