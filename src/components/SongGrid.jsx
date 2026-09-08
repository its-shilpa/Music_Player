// src/components/SongGrid.jsx
// Grid coordinator component supporting list rows, 3D flip card grids, and flat card grids with smooth infinite scrolling.
// layoutMode options: "list" | "grid-flip" | "grid-simple"

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import SongRow from "./SongRow";
import SongFlipCard from "./SongFlipCard";
import SongCard from "./SongCard";

const BATCH_SIZE = 24;

function SongGrid({
  songs = [],
  activeSongId,
  isPlaying,
  onPlay,
  favorites = [],
  onToggleFavorite,
  onAddToQueue,
  startIndex = 0,
  layoutMode = "list",
  onFetchMore,
}) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  // Keep loadingRef in sync with state
  useEffect(() => {
    loadingRef.current = isLoadingMore;
  }, [isLoadingMore]);

  // When song catalog or active filter changes, reset visible count to initial batch
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    setIsLoadingMore(false);
    loadingRef.current = false;
  }, [songs]);

  const hasMore = visibleCount < songs.length || Boolean(onFetchMore);
  const visibleSongs = useMemo(() => {
    return songs.slice(0, visibleCount);
  }, [songs, visibleCount]);

  const handleLoadMore = useCallback(() => {
    if (loadingRef.current) return;

    if (visibleCount < songs.length) {
      loadingRef.current = true;
      setIsLoadingMore(true);

      // Frame-aligned batch append for smooth 60fps rendering without hitching
      requestAnimationFrame(() => {
        setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, songs.length));
        setIsLoadingMore(false);
        loadingRef.current = false;
      });
    } else if (onFetchMore) {
      loadingRef.current = true;
      setIsLoadingMore(true);
      Promise.resolve(onFetchMore()).finally(() => {
        setIsLoadingMore(false);
        loadingRef.current = false;
      });
    }
  }, [visibleCount, songs.length, onFetchMore]);

  // Primary trigger: IntersectionObserver with 450px rootMargin for seamless preloading
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const scrollContainer = sentinel.closest(".home-scroll-area, .player-scroll-area");

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting && !loadingRef.current) {
          handleLoadMore();
        }
      },
      {
        root: scrollContainer || null,
        rootMargin: "450px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, handleLoadMore]);

  return (
    <>
      {layoutMode === "grid-flip" && (
        /* Render 3D flip cards layout for general home grids */
        <div className="song-card-grid">
          {visibleSongs.map((song) => (
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
          {visibleSongs.map((song) => (
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
            {visibleSongs.map((song, i) => (
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

      {/* Sentinel element to trigger infinite scroll load */}
      {hasMore && (
        <div ref={sentinelRef} className="infinite-scroll-sentinel" />
      )}

      {/* Loading indicator while loading next batch */}
      {isLoadingMore && (
        <div className="infinite-scroll-loader">
          <div className="infinite-scroll-wave">
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="infinite-scroll-text">Loading more tracks…</span>
        </div>
      )}
    </>
  );
}

export default memo(SongGrid);
