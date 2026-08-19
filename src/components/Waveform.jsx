// src/components/Waveform.jsx
// Animated visualizer waveform that responds to playback and volume level.

import { useEffect, useState, useRef } from "react";

export default function Waveform({ isPlaying, bars = 22, volume = 1 }) {
  const [heights, setHeights] = useState(() => Array(bars).fill(20));
  const animationRef = useRef();

  useEffect(() => {
    if (!isPlaying) {
      // Return to a resting state with subtle variation
      setHeights(Array(bars).fill(0).map((_, i) => 15 + Math.sin(i * 0.5) * 5));
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const updateWave = () => {
      setHeights((prev) =>
        prev.map((h, i) => {
          // Create a wave that moves over time
          const t = Date.now() * 0.006;
          // Combine multiple sine waves for complexity
          const wave = Math.sin(i * 0.3 + t) * Math.cos(i * 0.7 - t * 0.5);
          // Scale by volume
          const amp = 40 * volume;
          // Add some organic noise/jitter
          const jitter = (Math.random() - 0.5) * 15 * volume;
          // Map to a final height range (e.g. 15% to 95%)
          const finalHeight = Math.max(15, Math.min(95, 45 + wave * amp + jitter));
          return finalHeight;
        })
      );
      animationRef.current = requestAnimationFrame(updateWave);
    };

    updateWave();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, bars, volume]);

  return (
    <div className={`waveform ${isPlaying ? "active" : ""}`}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{
            height: `${h}%`,
            transition: isPlaying ? "none" : "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}
