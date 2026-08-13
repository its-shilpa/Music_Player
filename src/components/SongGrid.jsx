// src/components/SongGrid.jsx
// Small wrapper so "list of songs + pagination under it" isn't repeated
// three times across HomeView and PlayerView.
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
}) {
  return (
    <>
      <div className="song-grid">
        {songs.map((song) => (
          <SongRow
            key={song.id}
            song={song}
            isActive={song.id === activeSongId && isPlaying}
            onPlay={onPlay}
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
