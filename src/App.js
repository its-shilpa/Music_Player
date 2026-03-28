import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

const songs = [ 
  { name: "Gehra Hua", artist: "Shreya Ghosal", color: "#00d4ff" },
  { name: "Ghungroo", artist: "Arijit Singh", color: "#14b8a6" },
  { name: "Dhadak", artist: "Shreya Ghosal", color: "#6366f1" },
  { name: "Shape of You", artist: "Ed Sheeran", color: "#ec4899" },
  { name: "Param Sundari", artist: "Shreya Ghosal", color: "#22c55e" },
  { name: "Main Rang Sharbaton Ka", artist: "Arijit Singh", color: "#a855f7" },
  { name: "Dil To Pagal Hai",  artist: "Udit Narayan", color: "#f59e0b" },
  { name: "Zehnaseeb", artist: "Shekhar", color: "#f43f8e" },
  { name: "Mere Naam Tu", artist: "Ajay-Atul", color: "#00d4ff" },
  { name: "Titli", artist: "Shreya Ghosal", color: "#14b8a6" },
  { name: "Humnava", artist: "Papon", color: "#6366f1" },
  { name: "Deewani Mastani", artist: "Shreya Ghosal", color: "#00d4ff" },
];

function makeFallbackSVG(name, color) {
  const letter = name.charAt(0).toUpperCase();
  const colorMap = {
    "#a855f7": "#f43f8e", "#f59e0b": "#a855f7", "#f43f8e": "#00d4ff",
    "#00d4ff": "#a855f7", "#14b8a6": "#6366f1", "#6366f1": "#ec4899",
    "#ec4899": "#14b8a6", "#22c55e": "#00d4ff",
  };
  const color2 = colorMap[color] || "#a855f7";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${color}' stop-opacity='0.9'/><stop offset='100%' stop-color='${color2}' stop-opacity='0.8'/></linearGradient><linearGradient id='g2' x1='100%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='${color2}' stop-opacity='0.3'/><stop offset='100%' stop-color='${color}' stop-opacity='0.1'/></linearGradient></defs><rect width='140' height='140' rx='12' fill='%231a1a35'/><rect width='140' height='140' rx='12' fill='url(%23g2)'/><circle cx='110' cy='30' r='50' fill='${color}' opacity='0.15'/><circle cx='25' cy='110' r='40' fill='${color2}' opacity='0.12'/><circle cx='70' cy='70' r='38' fill='none' stroke='url(%23g)' stroke-width='3' opacity='0.6'/><circle cx='70' cy='70' r='28' fill='none' stroke='${color}' stroke-width='1.5' opacity='0.35'/><circle cx='70' cy='70' r='12' fill='url(%23g)' opacity='0.9'/><circle cx='70' cy='70' r='4' fill='%230a0a18'/><text x='70' y='120' font-family='Segoe UI,sans-serif' font-size='13' font-weight='700' fill='${color}' opacity='0.7' text-anchor='middle'>${letter}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const PARTICLE_SYMBOLS = ["♪", "♫", "♩", "♬", "·", "♪", "♫", "·", "♩", "♬"];

function App() {
  // ── All state ──────────────────────────────────────────────
  const [songIndex,   setSongIndex]   = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [darkMode,    setDarkMode]    = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [volume,      setVolume]      = useState(1);
  const [isShuffle,   setIsShuffle]   = useState(false);
  const [isRepeat,    setIsRepeat]    = useState(false);
  const [imgSrc,      setImgSrc]      = useState("");

  // ── Refs ───────────────────────────────────────────────────
  const audioRef    = useRef(null);
  // Store latest values in refs so callbacks don't go stale
  const isRepeatRef  = useRef(isRepeat);
  const isShuffleRef = useRef(isShuffle);
  const songIndexRef = useRef(songIndex);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => { isRepeatRef.current  = isRepeat;  }, [isRepeat]);
  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { songIndexRef.current = songIndex; }, [songIndex]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const currentSong = songs[songIndex];

  // ── Helpers defined BEFORE any useEffect that uses them ───

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // nextSong — reads from refs so it's always fresh even as a stable callback
  const nextSong = useCallback(() => {
    const shuffle = isShuffleRef.current;
    const current = songIndexRef.current;
    let next;
    if (shuffle) {
      do { next = Math.floor(Math.random() * songs.length); }
      while (next === current && songs.length > 1);
    } else {
      next = (current + 1) % songs.length;
    }
    setSongIndex(next);
    setIsPlaying(true);
  }, []); // stable — no deps needed because we use refs

  const prevSong = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      setSongIndex((p) => (p === 0 ? songs.length - 1 : p - 1));
      setIsPlaying(true);
    }
  }, []);

  const updateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
  }, []);

  const handleSongEnd = useCallback(() => {
    if (!isRepeatRef.current) nextSong();
  }, [nextSong]); // nextSong is stable, so this is stable too

  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  }, []);

  const setProgressBar = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  const changeVolume = (e) => setVolume(parseFloat(e.target.value));

  // ── Effects ────────────────────────────────────────────────

  // Attach persistent audio event listeners once
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("timeupdate",    updateProgress);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended",         handleSongEnd);
    return () => {
      audio.removeEventListener("timeupdate",    updateProgress);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended",         handleSongEnd);
    };
  }, [updateProgress, onLoadedMetadata, handleSongEnd]);

  // Load new src when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = `/music/${currentSong.name}.mp3`;
    audio.load();
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setImgSrc(`/images/${currentSong.name}.jpg`);
    if (isPlayingRef.current) {
      const onCanPlay = () => {
        audio.play().catch(() => {});
        audio.removeEventListener("canplay", onCanPlay);
      };
      audio.addEventListener("canplay", onCanPlay);
      return () => audio.removeEventListener("canplay", onCanPlay);
    }
  }, [songIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play / pause toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      if (audio.readyState >= 2) {
        audio.play().catch(() => {});
      } else {
        const onCanPlay = () => {
          audio.play().catch(() => {});
          audio.removeEventListener("canplay", onCanPlay);
        };
        audio.addEventListener("canplay", onCanPlay);
        return () => audio.removeEventListener("canplay", onCanPlay);
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume sync
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
    const slider = document.querySelector(".volume-slider");
    if (slider) slider.style.setProperty("--val", volume * 100);
  }, [volume]);

  // Scroll active song into view
  useEffect(() => {
    const el = document.querySelector(".song-item.active");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [songIndex]);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="app-container">
        <div className="overlay">

          {/* Animated Background */}
          <div className="bg-grid" />
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
          <div className="bg-orb bg-orb-4" />
          <div className="particles">
            {PARTICLE_SYMBOLS.map((sym, i) => (
              <span key={i} className="particle">{sym}</span>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <div className="layout">

            {/* PLAYLIST */}
            <div className="playlist-section">
              <div className="playlist-scroll">
                {songs.map((song, index) => (
                  <div
                    key={index}
                    className={`song-item ${index === songIndex ? "active" : ""}`}
                    onClick={() => { setSongIndex(index); setIsPlaying(true); }}
                  >
                    <div className="song-num">{index + 1}</div>
                    <div className="song-info">
                      <div className="song-name">{song.name}</div>
                      <div className="song-artist">{song.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PLAYER */}
            <div className={`player-section ${isPlaying ? "playing" : ""}`}>
              <div className="player-card">

                {/* Album Art */}
                <div className="album-container">
                  <div className="album-art">
                    <div className="album-ring" />
                    <div className="album-ring-mask" />
                    <img
                      src={imgSrc}
                      onError={() =>
                        setImgSrc(makeFallbackSVG(currentSong.name, currentSong.color))
                      }
                      alt={currentSong.name}
                      className="cover-image"
                    />
                  </div>
                </div>

                {/* Song Info */}
                <div className="song-details">
                  <h1 className="song-title">{currentSong.name}</h1>
                  <p className="song-artist-name">{currentSong.artist}</p>
                </div>

                {/* Progress */}
                <div className="progress-section">
                  <div
                    className="progress-bar-container"
                    onClick={setProgressBar}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                    <div className="progress-handle" style={{ left: `${progress}%` }} />
                  </div>
                  <div className="time-display">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Waveform */}
                <div className={`waveform ${isPlaying ? "active" : ""}`}>
                  {[...Array(22)].map((_, i) => (
                    <div
                      key={i}
                      className="wave-bar"
                      style={{ animationDelay: `${i * 0.06}s` }}
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="controls-section">
                  <button
                    className={`control-btn ${isShuffle ? "active" : ""}`}
                    onClick={() => setIsShuffle((s) => !s)}
                    title="Shuffle"
                  >
                    <span>🔀</span>
                  </button>
                  <button className="control-btn prev-btn" onClick={prevSong} title="Previous">
                    <span>⏮</span>
                  </button>
                  <button
                    className={`control-btn play-pause-btn ${isPlaying ? "playing" : ""}`}
                    onClick={() => setIsPlaying((p) => !p)}
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    <span>{isPlaying ? "⏸" : "▶"}</span>
                  </button>
                  <button className="control-btn next-btn" onClick={nextSong} title="Next">
                    <span>⏭</span>
                  </button>
                  <button
                    className={`control-btn ${isRepeat ? "active" : ""}`}
                    onClick={() => setIsRepeat((r) => !r)}
                    title="Repeat"
                  >
                    <span>🔁</span>
                  </button>
                </div>

                {/* Volume */}
                <div className="volume-section">
                  <span className="volume-icon">
                    {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
                  </span>
                  <input
                    type="range" min="0" max="1" step="0.01" value={volume}
                    onChange={changeVolume}
                    className="volume-slider"
                    aria-label="Volume"
                  />
                  <span className="volume-percent">{Math.round(volume * 100)}%</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio — no src prop, managed via ref */}
      <audio ref={audioRef} loop={isRepeat} />
    </div>
  );
}

export default App;