import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

const songs = [
  { id: 0,  name: "Gehra Hua",                 artists: ["Arijit Singh"],                           color: "#00d4ff", genre: "Romantic" },
  { id: 1,  name: "Ghungroo",                  artists: ["Arijit Singh"],                           color: "#14b8a6", genre: "Pop" },
  { id: 2,  name: "Dhadak",                    artists: ["Shreya Ghoshal"],                         color: "#6366f1", genre: "Romantic" },
  { id: 3,  name: "Param Sundari",             artists: ["Shreya Ghoshal"],                         color: "#22c55e", genre: "Pop" },
  { id: 4,  name: "Main Rang Sharbaton Ka",    artists: ["Arijit Singh", "Shreya Ghoshal"],         color: "#a855f7", genre: "Bollywood" },
  { id: 5,  name: "Dil To Pagal Hai",          artists: ["Udit Narayan"],                           color: "#f59e0b", genre: "Classic" },
  { id: 6,  name: "Zehnaseeb",                 artists: ["Shekhar"],                                color: "#f43f8e", genre: "Romantic" },
  { id: 7,  name: "Mere Naam Tu",              artists: ["Ajay-Atul"],                              color: "#00d4ff", genre: "Bollywood" },
  { id: 8,  name: "Titli",                     artists: ["Shreya Ghoshal"],                         color: "#14b8a6", genre: "Romantic" },
  { id: 9,  name: "Main Yahaan Hoon",          artists: ["Udit Narayan"],                           color: "#00d4ff", genre: "Romantic" },
  { id: 10, name: "Rozana",                    artists: ["Shreya Ghoshal"],                         color: "#f59e0b", genre: "Romantic" },
  { id: 11, name: "Raabta",                    artists: ["Arijit Singh"],                           color: "#00d4ff", genre: "Bollywood" },
  { id: 12, name: "Mareez-E-Ishq",             artists: ["Arijit Singh"],                           color: "#f43f8e", genre: "Romantic" },
  { id: 13, name: "Saathiya",                  artists: ["Sonu Nigam"],                             color: "#00d4ff", genre: "Romantic" },
  { id: 14, name: "Pehla Nasha Pehla",         artists: ["Udit Narayan"],                           color: "#00d4ff", genre: "Romantic" },
  { id: 15, name: "Sooraj Dooba Hain",         artists: ["Arijit Singh"],                           color: "#14b8a6", genre: "Pop" },
  { id: 16, name: "Humnava",                   artists: ["Papon"],                                  color: "#6366f1", genre: "Sufi" },
  { id: 17, name: "Khairiyat",                 artists: ["Arijit Singh"],                           color: "#6366f1", genre: "Romantic" },
  { id: 18, name: "Baatein Ye Kabhi Na",       artists: ["Arijit Singh"],                           color: "#ec4899", genre: "Bollywood" },
  { id: 19, name: "Jugraafiya",                artists: ["Shreya Ghoshal", "Udit Narayan"],         color: "#ec4899", genre: "Bollywood" },
  { id: 20, name: "Tum Hi Ho",                 artists: ["Arijit Singh"],                           color: "#22c55e", genre: "Romantic" },
  { id: 21, name: "Kaho Naa Pyaar Hai",        artists: ["Udit Narayan"],                           color: "#22c55e", genre: "Pop" },
  { id: 22, name: "Humdard",                   artists: ["Arijit Singh"],                           color: "#a855f7", genre: "Romantic" },
  { id: 23, name: "Deewani Mastani",           artists: ["Shreya Ghoshal"],                         color: "#00d4ff", genre: "Classic" },
  { id: 24, name: "Tu Jaane Na",               artists: ["Arijit Singh"],                           color: "#f43f8e", genre: "Romantic" },
  { id: 25, name: "Sathiya",                   artists: ["Shreya Ghoshal"],                         color: "#6366f1", genre: "Romantic" },
  { id: 26, name: "Moh Moh Ke Dhaage",         artists: ["Papon"],                                  color: "#00d4ff", genre: "Classic" },
  { id: 27, name: "Shape of You",              artists: ["Ed Sheeran"],                             color: "#ec4899", genre: "Pop" },
  { id: 28, name: "Koi Mil Gaya",              artists: ["Udit Narayan"],                           color: "#f43f8e", genre: "Romantic" },
  { id: 29, name: "Hawayein",                  artists: ["Arijit Singh"],                           color: "#00d4ff", genre: "Bollywood" },
  { id: 30, name: "Jeene Laga Hoon",           artists: ["Shreya Ghoshal", "Atif Aslam"],          color: "#14b8a6", genre: "Romantic" },
  { id: 31, name: "Kalank",                    artists: ["Arijit Singh"],                           color: "#f59e0b", genre: "Classic" },
  { id: 32, name: "Piya O Re Piya",            artists: ["Shreya Ghoshal", "Atif Aslam"],          color: "#6366f1", genre: "Sufi" },
  { id: 33, name: "Dil Meri Na Sune",          artists: ["Atif Aslam"],                             color: "#00d4ff", genre: "Romantic" },
  { id: 34, name: "Abhi Mujh Mein Kahin",      artists: ["Sonu Nigam", "Ajay-Atul"],               color: "#f59e0b", genre: "Classic" },
  { id: 35, name: "Tumhi Dekho Naa",           artists: ["Sonu Nigam"],                             color: "#00d4ff", genre: "Romantic" },
  { id: 36, name: "Ishq Wala Love",            artists: ["Shekhar"],                                color: "#14b8a6", genre: "Bollywood" },
  { id: 37, name: "Kal Ho Naa Ho",             artists: ["Sonu Nigam"],                             color: "#f43f8e", genre: "Romantic" },
  { id: 38, name: "Chand Chhupa Badal Mein",   artists: ["Udit Narayan"],                           color: "#f43f8e", genre: "Romantic" },
  { id: 39, name: "Main Agar Kahoon",          artists: ["Sonu Nigam", "Shreya Ghoshal"],           color: "#00d4ff", genre: "Romantic" },
  { id: 40, name: "Tumse Milke Dilka Jo Haal", artists: ["Sonu Nigam"],                             color: "#14b8a6", genre: "Bollywood" },
  { id: 41, name: "Bin Tere",                  artists: ["Shekhar"],                                color: "#f43f8e", genre: "Romantic" },
  { id: 42, name: "Aisa Deewana",              artists: ["Sonu Nigam"],                             color: "#6366f1", genre: "Romantic" },
  { id: 43, name: "Kya Mujhe Pyar",            artists: ["KK"],                                     color: "#ec4899", genre: "Pop" },
  { id: 44, name: "Tu Hi Meri Shab",           artists: ["KK"],                                     color: "#22c55e", genre: "Bollywood" },
  { id: 45, name: "Meherbaan",                 artists: ["Shekhar"],                                color: "#f59e0b", genre: "Pop" },
  { id: 46, name: "Labon Ko",                  artists: ["KK"],                                     color: "#a855f7", genre: "Romantic" },
  { id: 47, name: "Jaadu Teri Nazar",          artists: ["Udit Narayan"],                           color: "#22c55e", genre: "Bollywood" },
  { id: 48, name: "Dil Ibaadat",               artists: ["KK"],                                     color: "#f59e0b", genre: "Romantic" },
  { id: 49, name: "Bol Na Halke Halke",        artists: ["Rahat Fateh Ali Khan"],                   color: "#00d4ff", genre: "Bollywood" },
  { id: 50, name: "Tujhe Sochta Hoon",         artists: ["KK"],                                     color: "#f43f8e", genre: "Romantic" },
  { id: 51, name: "Tere Sang Yaara",           artists: ["Atif Aslam"],                             color: "#6366f1", genre: "Romantic" },
  { id: 52, name: "Surili Akhiyon Wale",       artists: ["Rahat Fateh Ali Khan"],                   color: "#14b8a6", genre: "Sufi" },
  { id: 53, name: "Tum Jo Aaye",               artists: ["Rahat Fateh Ali Khan"],                   color: "#14b8a6", genre: "Sufi" },
  { id: 54, name: "Mehndi Laga Ke Rakhna",     artists: ["Udit Narayan"],                           color: "#6366f1", genre: "Classic" },
  { id: 55, name: "Tere Mast Mast Do Nain",    artists: ["Rahat Fateh Ali Khan", "Shreya Ghoshal"], color: "#00d4ff", genre: "Classic" },
  { id: 56, name: "Khamoshiyan",               artists: ["Arijit Singh"],                           color: "#f43f8e", genre: "Bollywood" },
  { id: 57, name: "Teri Ore",                  artists: ["Rahat Fateh Ali Khan", "Shreya Ghoshal"], color: "#00d4ff", genre: "Sufi" },
  { id: 58, name: "Pehli Baar",                artists: ["Ajay-Atul"],                              color: "#6366f1", genre: "Romantic" },
  { id: 59, name: "Dagabaaz Re Dabangg",       artists: ["Rahat Fateh Ali Khan", "Shreya Ghoshal"], color: "#f59e0b", genre: "Sufi" },
];

const GENRES = ["All", "Bollywood", "Romantic", "Pop", "Classic", "Sufi"];
const SONGS_PER_PAGE = 15;

const ARTIST_PHOTOS = {
  "Shreya Ghoshal":      "/images/shreya-ghoshal.webp",
  "Arijit Singh":        "/images/arijit-singh.webp",
  "Sonu Nigam":          "/images/sonu-nigam.jpg",
  "Atif Aslam":          "/images/atif-aslam.webp",
  "Udit Narayan":        "/images/udit-narayan.webp",
  "Ajay-Atul":           "/images/ajay-atul.webp",
  "Papon":               "/images/papon.webp",
  "Rahat Fateh Ali Khan":"/images/rahat-fateh-ali-khan.webp",
  "KK":                  "/images/kk.webp",
  "Shekhar":             "/images/shekhar.webp",
  "Ed Sheeran":          "/images/ed-seeran.webp",
};

const buildArtists = () => {
  const map = {};
  songs.forEach((s) => {
    s.artists.forEach((name) => {
      if (!map[name]) map[name] = { name, count: 0, color: s.color };
      map[name].count++;
    });
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
};
const ARTISTS = buildArtists();

// ── SVG fallbacks ───────────────────────────────────────────
function makeFallbackSVG(name, color) {
  const letter = name.charAt(0).toUpperCase();
  const colorMap = { "#a855f7":"#f43f8e","#f59e0b":"#a855f7","#f43f8e":"#00d4ff","#00d4ff":"#a855f7","#14b8a6":"#6366f1","#6366f1":"#ec4899","#ec4899":"#14b8a6","#22c55e":"#00d4ff" };
  const color2 = colorMap[color] || "#a855f7";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${color}' stop-opacity='0.9'/><stop offset='100%' stop-color='${color2}' stop-opacity='0.8'/></linearGradient><linearGradient id='g2' x1='100%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='${color2}' stop-opacity='0.3'/><stop offset='100%' stop-color='${color}' stop-opacity='0.1'/></linearGradient></defs><rect width='140' height='140' rx='12' fill='%231a1a35'/><rect width='140' height='140' rx='12' fill='url(%23g2)'/><circle cx='110' cy='30' r='50' fill='${color}' opacity='0.15'/><circle cx='25' cy='110' r='40' fill='${color2}' opacity='0.12'/><circle cx='70' cy='70' r='38' fill='none' stroke='url(%23g)' stroke-width='3' opacity='0.6'/><circle cx='70' cy='70' r='28' fill='none' stroke='${color}' stroke-width='1.5' opacity='0.35'/><circle cx='70' cy='70' r='12' fill='url(%23g)' opacity='0.9'/><circle cx='70' cy='70' r='4' fill='%230a0a18'/><text x='70' y='120' font-family='Segoe UI,sans-serif' font-size='13' font-weight='700' fill='${color}' opacity='0.7' text-anchor='middle'>${letter}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function makeArtistFallbackSVG(name, color) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colorMap = { "#a855f7":"#f43f8e","#f59e0b":"#a855f7","#f43f8e":"#00d4ff","#00d4ff":"#a855f7","#14b8a6":"#6366f1","#6366f1":"#ec4899","#ec4899":"#14b8a6","#22c55e":"#00d4ff" };
  const color2 = colorMap[color] || "#a855f7";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><defs><linearGradient id='ag' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${color}' stop-opacity='0.25'/><stop offset='100%' stop-color='${color2}' stop-opacity='0.18'/></linearGradient></defs><circle cx='40' cy='40' r='40' fill='url(%23ag)'/><text x='40' y='47' font-family='Segoe UI,sans-serif' font-size='22' font-weight='800' fill='${color}' text-anchor='middle'>${initials}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const PARTICLE_SYMBOLS = ["♪","♫","♩","♬","·","♪","♫","·","♩","♬"];

// ── Reusable song thumbnail with jpg → SVG fallback ─────────
function SongThumb({ song, className = "" }) {
  const [src, setSrc] = useState(`/images/${song.name}.jpg`);
  useEffect(() => { setSrc(`/images/${song.name}.jpg`); }, [song.name]);
  return (
    <img
      src={src}
      alt={song.name}
      className={className}
      onError={() => setSrc(makeFallbackSVG(song.name, song.color))}
    />
  );
}


// ── Pagination ───────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return (
    <div className="pagination">
      <button className="page-btn page-arrow" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>‹</button>
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} className="page-ellipsis">…</span>
          : <button key={p} className={`page-btn ${currentPage === p ? "active" : ""}`} onClick={() => onPageChange(p)}>{p}</button>
      )}
      <button className="page-btn page-arrow" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
    </div>
  );
}

// ── Artist bubble with photo ─────────────────────────────────
function ArtistBubble({ artist, onClick }) {
  const [photoSrc, setPhotoSrc] = useState(ARTIST_PHOTOS[artist.name] || makeArtistFallbackSVG(artist.name, artist.color));
  return (
    <div className="artist-bubble" style={{ "--ac": artist.color }} onClick={onClick}>
      <div className="artist-bubble-avatar">
        <img
          src={photoSrc}
          alt={artist.name}
          className="artist-photo"
          onError={() => setPhotoSrc(makeArtistFallbackSVG(artist.name, artist.color))}
        />
      </div>
      <div className="artist-bubble-name">{artist.name}</div>
      <div className="artist-bubble-count">{artist.count} songs</div>
    </div>
  );
}

// ── Song row ─────────────────────────────────────────────────
function SongRow({ song, isActive, onPlay }) {
  return (
    <div className={`song-row ${isActive ? "active" : ""}`} onClick={() => onPlay(song.id)}>
      <div className="song-row-art">
        <SongThumb song={song} />
        <div className="song-row-play-icon">▶</div>
      </div>
      <div className="song-row-info">
        <div className="song-row-name">{song.name}</div>
        <div className="song-row-artist">{song.artists.join(", ")}</div>
      </div>
      <div className="song-row-genre-badge">{song.genre}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// APP
// ════════════════════════════════════════════════════════════
export default function App() {
  // ── Global player state ────────────────────────────────────
  const [view,        setView]        = useState("home");
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

  // ── Home page filters ──────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState("");
  const [activeGenre,    setActiveGenre]    = useState("All");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [homePage,       setHomePage]       = useState(1);
  const [relatedPage,    setRelatedPage]    = useState(1);

  // ── Queue context ──────────────────────────────────────────
  // Stores the ordered list of song IDs the user was browsing when they hit play.
  // nextSong/prevSong will walk through this queue.
  // null = walk through all songs (default).
  const [queue, setQueue] = useState(null); // number[] | null

  // ── Refs ───────────────────────────────────────────────────
  const audioRef      = useRef(null);
  const isRepeatRef   = useRef(isRepeat);
  const isShuffleRef  = useRef(isShuffle);
  const songIndexRef  = useRef(songIndex);
  const isPlayingRef  = useRef(isPlaying);
  const queueRef      = useRef(queue);

  useEffect(() => { isRepeatRef.current  = isRepeat;  }, [isRepeat]);
  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { songIndexRef.current = songIndex; }, [songIndex]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { queueRef.current     = queue;     }, [queue]);

  const currentSong = songs[songIndex];

  // ── Derived: full home song list (for building queue) ─────
  const q = searchQuery.toLowerCase().trim();
  const homeSongs = songs.filter((s) => {
    const genreMatch  = activeGenre === "All" || s.genre === activeGenre;
    const artistMatch = selectedArtist ? s.artists.includes(selectedArtist) : true;
    const searchMatch = q
      ? s.name.toLowerCase().includes(q) || s.artists.some(a => a.toLowerCase().includes(q))
      : true;
    return genreMatch && artistMatch && searchMatch;
  });
  const homeTotalPages  = Math.ceil(homeSongs.length / SONGS_PER_PAGE);
  const pagedHomeSongs  = homeSongs.slice((homePage - 1) * SONGS_PER_PAGE, homePage * SONGS_PER_PAGE);
  useEffect(() => { setHomePage(1); }, [searchQuery, activeGenre, selectedArtist]);

  // ── Derived: related songs on player page ─────────────────
  const relatedSongs = songs.filter(
    (s) => s.id !== currentSong.id && s.artists.some(a => currentSong.artists.includes(a))
  );
  const relatedTotalPages = Math.ceil(relatedSongs.length / SONGS_PER_PAGE);
  const pagedRelatedSongs = relatedSongs.slice((relatedPage - 1) * SONGS_PER_PAGE, relatedPage * SONGS_PER_PAGE);
  useEffect(() => { setRelatedPage(1); }, [songIndex]);

  // ── Audio helpers ──────────────────────────────────────────
  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // Walk the active queue (or all songs if queue is null)
  const nextSong = useCallback(() => {
    const activeQueue = queueRef.current;
    const current     = songIndexRef.current;
    const shuffle     = isShuffleRef.current;

    if (activeQueue && activeQueue.length > 0) {
      const pos = activeQueue.indexOf(current);
      let nextId;
      if (shuffle) {
        let rand;
        do { rand = Math.floor(Math.random() * activeQueue.length); }
        while (activeQueue[rand] === current && activeQueue.length > 1);
        nextId = activeQueue[rand];
      } else {
        const nextPos = (pos + 1) % activeQueue.length;
        nextId = activeQueue[nextPos];
      }
      setSongIndex(nextId);
    } else {
      // No queue — walk all songs
      if (shuffle) {
        let rand;
        do { rand = Math.floor(Math.random() * songs.length); }
        while (rand === current && songs.length > 1);
        setSongIndex(rand);
      } else {
        setSongIndex((current + 1) % songs.length);
      }
    }
    setIsPlaying(true);
  }, []);

  const prevSong = useCallback(() => {
    const audio       = audioRef.current;
    const activeQueue = queueRef.current;
    const current     = songIndexRef.current;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (activeQueue && activeQueue.length > 0) {
      const pos   = activeQueue.indexOf(current);
      const prev  = (pos - 1 + activeQueue.length) % activeQueue.length;
      setSongIndex(activeQueue[prev]);
    } else {
      setSongIndex((p) => (p === 0 ? songs.length - 1 : p - 1));
    }
    setIsPlaying(true);
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
  }, [nextSong]);

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

  // ── Effects ────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("timeupdate",     updateProgress);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended",          handleSongEnd);
    return () => {
      audio.removeEventListener("timeupdate",     updateProgress);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended",          handleSongEnd);
    };
  }, [updateProgress, onLoadedMetadata, handleSongEnd]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = `/music/${currentSong.name}.mp3`;
    audio.load();
    setProgress(0); setCurrentTime(0); setDuration(0);
    setImgSrc(`/images/${currentSong.name}.jpg`);
    if (isPlayingRef.current) {
      const onCanPlay = () => { audio.play().catch(() => {}); audio.removeEventListener("canplay", onCanPlay); };
      audio.addEventListener("canplay", onCanPlay);
      return () => audio.removeEventListener("canplay", onCanPlay);
    }
  }, [songIndex]); // eslint-disable-line

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      if (audio.readyState >= 2) { audio.play().catch(() => {}); }
      else {
        const onCanPlay = () => { audio.play().catch(() => {}); audio.removeEventListener("canplay", onCanPlay); };
        audio.addEventListener("canplay", onCanPlay);
        return () => audio.removeEventListener("canplay", onCanPlay);
      }
    } else { audio.pause(); }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
    const slider = document.querySelector(".volume-slider");
    if (slider) slider.style.setProperty("--val", volume * 100);
  }, [volume]);

  // ── Navigation & play actions ──────────────────────────────

  // Play from the home song list (respects active genre/artist/search filter)
  const playSongFromHome = (id) => {
    const contextQueue = homeSongs.map(s => s.id);
    setQueue(contextQueue);
    setSongIndex(id);
    setIsPlaying(true);
    setView("player");
  };

  // Play from the related section on the player page
  const playSongFromRelated = (id) => {
    // Build a queue from related songs of the newly selected song
    const newRelated = songs.filter(
      s => s.id !== id && s.artists.some(a => songs.find(x => x.id === id)?.artists.includes(a))
    );
    const contextQueue = [id, ...newRelated.map(s => s.id)];
    setQueue(contextQueue);
    setSongIndex(id);
    setIsPlaying(true);
  };

  const goHome = () => setView("home");

  // ══════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════
  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="app-container">
        <div className="overlay">
          <div className="bg-grid" />
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
          <div className="bg-orb bg-orb-4" />
          <div className="particles">
            {PARTICLE_SYMBOLS.map((sym, i) => <span key={i} className="particle">{sym}</span>)}
          </div>

          {/* ════ HOME VIEW ════ */}
          {view === "home" && (
            <div className="home-view">
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
                    onChange={(e) => { setSearchQuery(e.target.value); setActiveGenre("All"); setSelectedArtist(null); }}
                  />
                  {searchQuery && (
                    <button className="home-search-clear" onClick={() => setSearchQuery("")}>✕</button>
                  )}
                </div>
                <button className="theme-toggle-home" onClick={() => setDarkMode(d => !d)}>
                  {darkMode ? "☀️" : "🌙"}
                </button>
              </nav>

              <div className={`home-scroll-area${isPlaying ? " has-mini-player" : ""}`}>
                {!searchQuery && !selectedArtist && (
                  <div className="home-hero">
                    <h1 className="hero-title">Good evening 🎵</h1>
                    <p className="hero-sub">What are you in the mood for?</p>
                  </div>
                )}

                {!searchQuery && (
                  <div className="section-block">
                    <div className="genre-chips">
                      {GENRES.map((g) => (
                        <button key={g} className={`genre-chip ${activeGenre === g ? "active" : ""}`}
                          onClick={() => { setActiveGenre(g); setSelectedArtist(null); }}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!searchQuery && activeGenre === "All" && !selectedArtist && (
                  <div className="section-block">
                    <h2 className="section-title">Artists</h2>
                    <div className="artists-row">
                      {ARTISTS.map(artist => (
                        <ArtistBubble key={artist.name} artist={artist} onClick={() => setSelectedArtist(artist.name)} />
                      ))}
                    </div>
                  </div>
                )}

                {selectedArtist && (
                  <div className="filter-header">
                    <button className="filter-back-btn" onClick={() => setSelectedArtist(null)}>← Back</button>
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
                    <>
                      <div className="song-grid">
                        {pagedHomeSongs.map(song => (
                          <SongRow key={song.id} song={song}
                            isActive={song.id === songIndex && isPlaying}
                            onPlay={playSongFromHome} />
                        ))}
                      </div>
                      <Pagination currentPage={homePage} totalPages={homeTotalPages} onPageChange={setHomePage} />
                    </>
                  )}
                </div>

                <div className="home-footer">MusePlay · {songs.length} songs</div>
              </div>

              {/* Mini player */}
              {isPlaying && (
                <div className="mini-player-bar" onClick={() => setView("player")}>
                  <div className="mini-thumb">
                    <SongThumb song={currentSong} />
                  </div>
                  <div className="mini-player-info">
                    <div className="mini-waveform">
                      {[...Array(5)].map((_,i) => <div key={i} className="mini-wave-bar" style={{animationDelay:`${i*0.12}s`}} />)}
                    </div>
                    <div className="mini-text">
                      <div className="mini-song-name">{currentSong.name}</div>
                      <div className="mini-artist">{currentSong.artists.join(", ")}</div>
                    </div>
                  </div>
                  <div className="mini-player-controls">
                    <button className="mini-ctrl" onClick={e=>{e.stopPropagation();prevSong();}}>⏮</button>
                    <button className="mini-ctrl mini-play" onClick={e=>{e.stopPropagation();setIsPlaying(p=>!p);}}>
                      {isPlaying ? "⏸" : "▶"}
                    </button>
                    <button className="mini-ctrl" onClick={e=>{e.stopPropagation();nextSong();}}>⏭</button>
                  </div>
                  <div className="mini-progress">
                    <div className="mini-progress-fill" style={{width:`${progress}%`}} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ PLAYER VIEW ════ */}
          {view === "player" && (
            <div className="player-view">
              <div className="player-nav">
                <button className="player-back-btn" onClick={goHome}>← Home</button>
                <div className="player-nav-title">Now Playing</div>
                <button className="theme-toggle-home" onClick={() => setDarkMode(d => !d)}>
                  {darkMode ? "☀️" : "🌙"}
                </button>
              </div>

              <div className="player-scroll-area">
                <div className={`player-card-wrap ${isPlaying ? "playing" : ""}`}>
                  <div className="player-card">
                    <div className="album-container">
                      <div className="album-art">
                        <div className="album-ring" />
                        <div className="album-ring-mask" />
                        <img
                          src={imgSrc}
                          onError={() => setImgSrc(makeFallbackSVG(currentSong.name, currentSong.color))}
                          alt={currentSong.name}
                          className="cover-image"
                        />
                      </div>
                    </div>

                    <div className="song-details">
                      <h1 className="song-title">{currentSong.name}</h1>
                      <p className="song-artist-name">{currentSong.artists.join(", ")}</p>
                      <span className="song-genre-tag">{currentSong.genre}</span>
                    </div>

                    <div className="progress-section">
                      <div className="progress-bar-container" onClick={setProgressBar}>
                        <div className="progress-bar" style={{width:`${progress}%`}} />
                        <div className="progress-handle" style={{left:`${progress}%`}} />
                      </div>
                      <div className="time-display">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    <div className={`waveform ${isPlaying ? "active" : ""}`}>
                      {[...Array(22)].map((_,i) => <div key={i} className="wave-bar" style={{animationDelay:`${i*0.06}s`}} />)}
                    </div>

                    <div className="controls-section">
                      <button className={`control-btn ${isShuffle ? "active" : ""}`} onClick={() => setIsShuffle(s=>!s)}>🔀</button>
                      <button className="control-btn prev-btn" onClick={prevSong}>⏮</button>
                      <button className={`control-btn play-pause-btn ${isPlaying ? "playing" : ""}`} onClick={() => setIsPlaying(p=>!p)}>
                        {isPlaying ? "⏸" : "▶"}
                      </button>
                      <button className="control-btn next-btn" onClick={nextSong}>⏭</button>
                      <button className={`control-btn ${isRepeat ? "active" : ""}`} onClick={() => setIsRepeat(r=>!r)}>🔁</button>
                    </div>

                    <div className="volume-section">
                      <span className="volume-icon">{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</span>
                      <input type="range" min="0" max="1" step="0.01" value={volume}
                        onChange={e => setVolume(parseFloat(e.target.value))} className="volume-slider" />
                      <span className="volume-percent">{Math.round(volume * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Related songs — clicking these sets a new related queue */}
                {relatedSongs.length > 0 && (
                  <div className="related-section">
                    <h2 className="related-title">
                      More by {currentSong.artists.length === 1 ? currentSong.artists[0] : currentSong.artists.join(" & ")}
                    </h2>
                    <div className="song-grid">
                      {pagedRelatedSongs.map(song => (
                        <SongRow key={song.id} song={song} isActive={false} onPlay={playSongFromRelated} />
                      ))}
                    </div>
                    <Pagination currentPage={relatedPage} totalPages={relatedTotalPages} onPageChange={setRelatedPage} />
                  </div>
                )}

                <div className="home-footer">MusePlay · {songs.length} songs</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <audio ref={audioRef} loop={isRepeat} />
    </div>
  );
}