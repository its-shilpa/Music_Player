// src/components/SongGrid.jsx
// Grid wrapper that renders a responsive table headers list, 
// maps individual tracks to SongRow components, and renders Pagination controls.

import SongRow from "./SongRow";
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
}) {
  return (
    <>
      {/* Table header visible on desktop only */}
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
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
