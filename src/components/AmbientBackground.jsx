// src/components/AmbientBackground.jsx
// Redesigned ambient background system with cinematic crossfading layers,
// dynamic genre-based glowing orbs, grid line overlays, and floating particles.

import { useEffect, useState, useRef } from "react";
import { getGenreTheme } from "../constants/genreThemes";

const PARTICLE_SYMBOLS = ["♪", "♫", "♩", "♬", "·", "♪", "♫", "·", "♩", "♬"];

export default function AmbientBackground({ genre }) {
  // Get theme configurations based on currently active genre or song genre
  const currentTheme = getGenreTheme(genre);
  
  // Track themes for Layer A and Layer B to crossfade them
  const [themeA, setThemeA] = useState(currentTheme);
  const [themeB, setThemeB] = useState(currentTheme);
  const [activeLayer, setActiveLayer] = useState("A"); // "A" | "B"
  
  const prevThemeRef = useRef(currentTheme);

  // Sync theme changes with a state switch to trigger CSS opacity transitions
  useEffect(() => {
    if (currentTheme.name !== prevThemeRef.current.name) {
      if (activeLayer === "A") {
        setThemeB(currentTheme);
        setActiveLayer("B");
      } else {
        setThemeA(currentTheme);
        setActiveLayer("A");
      }
      prevThemeRef.current = currentTheme;
    }
  }, [currentTheme, activeLayer]);

  // Set CSS variables for gradient orbs
  const styleA = {
    "--glow-1": themeA.glow1,
    "--glow-2": themeA.glow2,
    "--glow-3": themeA.glow3,
  };

  const styleB = {
    "--glow-1": themeB.glow1,
    "--glow-2": themeB.glow2,
    "--glow-3": themeB.glow3,
  };

  return (
    <div className="ambient-bg-container">
      {/* Background Layer A */}
      <div 
        className={`ambient-bg-layer ${activeLayer === "A" ? "active" : ""}`}
        style={styleA}
      >
        <div className="bg-orb bg-orb-1" style={{ backgroundColor: "var(--glow-1)" }} />
        <div className="bg-orb bg-orb-2" style={{ backgroundColor: "var(--glow-2)" }} />
        <div className="bg-orb bg-orb-3" style={{ backgroundColor: "var(--glow-3)" }} />
      </div>

      {/* Background Layer B */}
      <div 
        className={`ambient-bg-layer ${activeLayer === "B" ? "active" : ""}`}
        style={styleB}
      >
        <div className="bg-orb bg-orb-1" style={{ backgroundColor: "var(--glow-1)" }} />
        <div className="bg-orb bg-orb-2" style={{ backgroundColor: "var(--glow-2)" }} />
        <div className="bg-orb bg-orb-3" style={{ backgroundColor: "var(--glow-3)" }} />
      </div>

      {/* Ambient Music Note Particles */}
      <div className="particles">
        {PARTICLE_SYMBOLS.map((sym, i) => (
          <span 
            key={i} 
            className="particle" 
            style={{ 
              animationDelay: `${i * 1.6}s`,
              animationDuration: `${12 + (i % 4) * 3}s` 
            }}
          >
            {sym}
          </span>
        ))}
      </div>
    </div>
  );
}
