// src/components/SongGrid.jsx
// Grid coordinator component supporting list rows, 3D flip card grids, and flat card grids.
// layoutMode options: "list" | "grid-flip" | "grid-simple"

import SongRow from "./SongRow";
import SongFlipCard from "./SongFlipCard";
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
  layoutMode = "list"
}) {
  return (
    <>
      {layoutMode === "grid-flip" && (
        /* Render 3D flip cards layout for general home grids */
        <div className="song-card-grid">
          {songs.map((song) => (
            <SongFlipCard
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
      )}

      {layoutMode === "grid-simple" && (
        /* Render flat cards layout with hover gradient border for filtered views */
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
      )}

      {layoutMode === "list" && (
        /* Render detailed list table layout */
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
