// src/hooks/useAudioPlayer.js
//
// This is ALL the <audio> element wiring that used to live directly inside
// App.jsx (10+ useState/useRef/useEffect blocks). Pulling it into a "custom
// hook" doesn't change what it does - it just gives that whole chunk of
// logic a name and its own file, so App.jsx can say:
//
//     const player = useAudioPlayer(songs);
//
// and use player.isPlaying, player.nextSong(), etc, without needing to
// see HOW that works while reading the component tree.
//
// WHY SO MANY REFS?
// The nextSong/handleSongEnd functions are attached as event listeners to
// the <audio> element. Event listeners "close over" whatever state existed
// the moment they were attached - if we read `songIndex` directly inside
// nextSong, it would always see the OLD value from when the listener was
// first added, not the latest one. Refs (songIndexRef.current) always hold
// the latest value, so functions read from the ref instead of the stale
// closed-over state.

import { useState, useRef, useEffect, useCallback } from "react";

export function useAudioPlayer(songs) {
  const songsRef = useRef(songs);
  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  // Queue = the ordered list of song ids the user was browsing when they
  // pressed play. next/prev walk through THIS list instead of the full
  // song array, so "up next" respects whatever filter/search was active.
  const [queue, setQueue] = useState(null); // number[] | null

  const audioRef = useRef(null);
  const isRepeatRef = useRef(isRepeat);
  const isShuffleRef = useRef(isShuffle);
  const songIndexRef = useRef(songIndex);
  const isPlayingRef = useRef(isPlaying);
  const queueRef = useRef(queue);

  useEffect(() => { isRepeatRef.current = isRepeat; }, [isRepeat]);
  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { songIndexRef.current = songIndex; }, [songIndex]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { queueRef.current = queue; }, [queue]);

  const currentSong = songs[songIndex] ?? null;

  const nextSong = useCallback(() => {
    const list = songsRef.current;
    if (!list.length) return;
    const activeQueue = queueRef.current;
    const current = songIndexRef.current;
    const shuffle = isShuffleRef.current;

    if (activeQueue?.length) {
      const pos = activeQueue.indexOf(current);
      if (shuffle) {
        let rand;
        do {
          rand = Math.floor(Math.random() * activeQueue.length);
        } while (activeQueue[rand] === current && activeQueue.length > 1);
        setSongIndex(activeQueue[rand]);
      } else {
        const nextPos = (pos + 1) % activeQueue.length;
        setSongIndex(activeQueue[nextPos]);
      }
    } else if (shuffle) {
      let rand;
      do {
        rand = Math.floor(Math.random() * list.length);
      } while (rand === current && list.length > 1);
      setSongIndex(rand);
    } else {
      setSongIndex((current + 1) % list.length);
    }
    setIsPlaying(true);
  }, []);

  const prevSong = useCallback(() => {
    const list = songsRef.current;
    if (!list.length) return;
    const activeQueue = queueRef.current;
    const current = songIndexRef.current;

    if (activeQueue?.length) {
      const pos = activeQueue.indexOf(current);
      const prevPos = (pos - 1 + activeQueue.length) % activeQueue.length;
      setSongIndex(activeQueue[prevPos]);
    } else {
      setSongIndex((current - 1 + list.length) % list.length);
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
    if (isRepeatRef.current) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
      return;
    }
    nextSong();
  }, [nextSong]);

  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  }, []);

  const seek = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  }, []);

  // Attach/detach native <audio> event listeners once.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", handleSongEnd);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [updateProgress, onLoadedMetadata, handleSongEnd]);

  // Whenever the current song changes, load its preview url into <audio>.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    audio.pause();
    audio.src = currentSong.preview;
    audio.load();
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setImgSrc(currentSong.image);
    if (isPlayingRef.current) {
      const onCanPlay = () => {
        audio.play().catch(() => {});
        audio.removeEventListener("canplay", onCanPlay);
      };
      audio.addEventListener("canplay", onCanPlay);
      return () => audio.removeEventListener("canplay", onCanPlay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songIndex]);

  // Play/pause whenever isPlaying flips.
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

  // Keep the <audio> element's volume in sync.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  // Start playing a specific song id, using the given ordered id list as
  // the "up next" queue.
  const playFromQueue = useCallback((id, orderedIds) => {
    setQueue(orderedIds);
    setSongIndex(id);
    setIsPlaying(true);
  }, []);

  return {
    audioRef,
    currentSong,
    songIndex,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isShuffle,
    isRepeat,
    imgSrc,
    setImgSrc,
    setIsPlaying,
    setVolume,
    setIsShuffle,
    setIsRepeat,
    nextSong,
    prevSong,
    seek,
    playFromQueue,
  };
}
