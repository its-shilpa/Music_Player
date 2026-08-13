// src/utils/formatTime.js
// Turns 125.4 (seconds, what <audio> gives you) into "2:05" for display.
export function formatTime(t) {
  if (!t || isNaN(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}
