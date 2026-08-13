// src/components/Waveform.jsx
// Purely decorative animated bars, shown "active" (CSS handles the bounce
// animation) whenever a song is playing.
export default function Waveform({ isPlaying, bars = 22 }) {
  return (
    <div className={`waveform ${isPlaying ? "active" : ""}`}>
      {[...Array(bars)].map((_, i) => (
        <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.06}s` }} />
      ))}
    </div>
  );
}
