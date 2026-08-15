// src/components/SongGrid.jsx
// Grid wrapper component that supports both detailed table lists ("list")
// and compact square grids ("grid") based on layoutMode. Contains Pagination.

import SongRow from "./SongRow";
import SongCard from "./SongCard";
import Pagination from "./Pagination";

export default function SongGrid({
  songs,
  activeSongId,
  isPlaying,
  onPlay,
  currentPage,
  totalPages,
  onPageChange,
  favorites = [],
  onToggleFavorite,
  onAddToQueue,
  startIndex = 0,
  layoutMode = "list" // "list" | "grid"
}) {
  return (
    <>
      {layoutMode === "grid" ? (
        /* Render small cards layout for filtered screens (artist / genre view) */
        <div className="song-card-grid">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isActive={song.id === activeSongId}
              isPlaying={song.id === activeSongId && isPlaying}
              onPlay={onPlay}
              isFavorite={favorites.includes(song.id)}
              onToggleFavorite={onToggleFavorite}
              onAddToQueue={onAddToQueue}
            />
          ))}
        </div>
      ) : (
        /* Render detailed list table layout for general pages (browse / search) */
        <>
          <div className="song-table-header">
            <span className="song-table-col-num">#</span>
            <span className="song-table-col-title">Title</span>
            <span className="song-table-col-genre">Genre</span>
            <span className="song-table-col-actions" style={{ textAlign: "right" }}>Actions</span>
          </div>

          <div className="song-grid">
            {songs.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                isActive={song.id === activeSongId}
                isPlaying={song.id === activeSongId && isPlaying}
                onPlay={onPlay}
                index={startIndex + i + 1}
                isFavorite={favorites.includes(song.id)}
                onToggleFavorite={onToggleFavorite}
                onAddToQueue={onAddToQueue}
              />
            ))}
          </div>
        </>
      )}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
