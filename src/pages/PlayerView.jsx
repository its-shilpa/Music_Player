// src/pages/PlayerView.jsx
// The full "Now Playing" screen: big album art, progress bar, transport
// controls, volume, and a "More by <artist>" related-songs grid.
import { makeFallbackSVG } from "../utils/fallbackArt";
import ProgressBar from "../components/ProgressBar";
import Waveform from "../components/Waveform";
import PlayerControls from "../components/PlayerControls";
import SongGrid from "../components/SongGrid";

export default function PlayerView({
  player,
  darkMode,
  onToggleDarkMode,
  onGoHome,
  relatedSongs,
  pagedRelatedSongs,
  relatedPage,
  relatedTotalPages,
  onRelatedPageChange,
  onPlayRelated,
  songsCount,
}) {
  const song = player.currentSong;
  if (!song) return null;

  return (
    <div className="player-view">
      <div className="player-nav">
        <button className="player-back-btn" onClick={onGoHome}>
          ← Home
        </button>
        <div className="player-nav-title">Now Playing</div>
        <button className="theme-toggle-home" onClick={onToggleDarkMode}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="player-scroll-area">
        <div className={`player-card-wrap ${player.isPlaying ? "playing" : ""}`}>
          <div className="player-card">
            <div className="album-container">
              <div className="album-art">
                <div className="album-ring" />
                <div className="album-ring-mask" />
                <img
                  src={player.imgSrc || makeFallbackSVG(song.name, song.color)}
                  onError={() => player.setImgSrc(makeFallbackSVG(song.name, song.color))}
                  alt={song.name}
                  className="cover-image"
                />
              </div>
            </div>

            <div className="song-details">
              <h1 className="song-title">{song.name}</h1>
              <p className="song-artist-name">{song.artists.join(", ")}</p>
              <span className="song-genre-tag">{song.genre}</span>
            </div>

            <ProgressBar
              progress={player.progress}
              currentTime={player.currentTime}
              duration={player.duration}
              onSeek={player.seek}
            />

            <Waveform isPlaying={player.isPlaying} />

            <PlayerControls
              isShuffle={player.isShuffle}
              isRepeat={player.isRepeat}
              isPlaying={player.isPlaying}
              onToggleShuffle={() => player.setIsShuffle((s) => !s)}
              onPrev={player.prevSong}
              onTogglePlay={() => player.setIsPlaying((p) => !p)}
              onNext={player.nextSong}
              onToggleRepeat={() => player.setIsRepeat((r) => !r)}
              volume={player.volume}
              onVolumeChange={player.setVolume}
            />
          </div>
        </div>

        {relatedSongs.length > 0 && (
          <div className="related-section">
            <h2 className="related-title">
              More by {song.artists.length === 1 ? song.artists[0] : song.artists.join(" & ")}
            </h2>
            <SongGrid
              songs={pagedRelatedSongs}
              activeSongId={-1}
              isPlaying={false}
              onPlay={onPlayRelated}
              currentPage={relatedPage}
              totalPages={relatedTotalPages}
              onPageChange={onRelatedPageChange}
            />
          </div>
        )}

        <div className="home-footer">MusePlay · {songsCount} songs</div>
      </div>
    </div>
  );
}
