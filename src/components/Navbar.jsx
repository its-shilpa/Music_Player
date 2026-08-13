// src/components/Navbar.jsx
// Top bar for the home page: logo, search input, dark/light toggle.
// It's "controlled" - it owns no state itself, everything comes from props
// and every change is reported back up via callbacks (onSearchChange etc).
export default function Navbar({ searchQuery, onSearchChange, onClearSearch, darkMode, onToggleDarkMode }) {
  return (
    <nav className="home-nav">
      <div className="home-nav-brand">
        <span className="brand-icon">♫</span>
        <span className="brand-name">MusePlay</span>
      </div>

      <div className="home-search-wrap">
        <span className="home-search-icon">⌕</span>
        <input
          type="text"
          className="home-search-input"
          placeholder="Search songs, artists…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button className="home-search-clear" onClick={onClearSearch}>
            ✕
          </button>
        )}
      </div>

      <button className="theme-toggle-home" onClick={onToggleDarkMode}>
        {darkMode ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}
