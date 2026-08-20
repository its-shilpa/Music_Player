// src/components/Waveform.jsx
// Animated visualizer waveform that responds to playback and volume level.

import { useEffect, useRef } from "react";

export default function Waveform({ isPlaying, bars = 22, volume = 1 }) {
  const containerRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get all the child wave-bar DOM elements
    const barElements = container.querySelectorAll(".wave-bar");
    const numBars = barElements.length;

    if (!isPlaying) {
      // Set to a resting state with smooth transitions
      barElements.forEach((bar, i) => {
        bar.style.transition = "height 0.3s ease";
        bar.style.height = `${15 + Math.sin(i * 0.5) * 5}%`;
      });
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Direct DOM height animation loop (60fps with zero React re-renders!)
    const updateWave = () => {
      const t = Date.now() * 0.006;
      for (let i = 0; i < numBars; i++) {
        const bar = barElements[i];
        if (bar) {
          const wave = Math.sin(i * 0.3 + t) * Math.cos(i * 0.7 - t * 0.03);
          const amp = 40 * volume;
          const jitter = (Math.random() - 0.5) * 15 * volume;
          const finalHeight = Math.max(15, Math.min(95, 45 + wave * amp + jitter));

          bar.style.transition = "none";
          bar.style.height = `${finalHeight}%`;
        }
      }
      animationRef.current = requestAnimationFrame(updateWave);
    };

    updateWave();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, volume]);

  return (
    <div ref={containerRef} className={`waveform ${isPlaying ? "active" : ""}`}>
      {[...Array(bars)].map((_, i) => (
        <div key={i} className="wave-bar" />
      ))}
    </div>
  );
}
