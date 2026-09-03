// src/components/AmbientBackground.jsx
// Ambient background system with cinematic crossfading layers,
// dynamic genre/AI-mood glowing orbs, and generative weather overlays
// (smooth falling rain, twinkling midnight stars, fiery embers, warm bokeh).

import { useEffect, useState, useRef } from "react";
import { getGenreTheme } from "../constants/genreThemes";
import { X, Sparkles } from "lucide-react";

export const AI_MOOD_THEMES = {
  rainy: {
    id: "rainy",
    name: "Rainy Day",
    icon: "🌧️",
    accent: "#60a5fa",
    accentSecondary: "#38bdf8",
    glow1: "rgba(30, 64, 110, 0.55)",
    glow2: "rgba(18, 38, 72, 0.65)",
    glow3: "rgba(45, 90, 140, 0.45)",
    vibeText: "Monsoon Melancholy & Soothing Rain",
  },
  night: {
    id: "night",
    name: "Midnight Stars",
    icon: "🌙",
    accent: "#a78bfa",
    accentSecondary: "#818cf8",
    glow1: "rgba(35, 20, 75, 0.6)",
    glow2: "rgba(16, 12, 45, 0.7)",
    glow3: "rgba(60, 30, 110, 0.45)",
    vibeText: "Nocturnal Ambience & Starlight Drift",
  },
  workout: {
    id: "workout",
    name: "High Voltage Fire",
    icon: "⚡",
    accent: "#f97316",
    accentSecondary: "#ef4444",
    glow1: "rgba(140, 35, 20, 0.6)",
    glow2: "rgba(95, 15, 10, 0.7)",
    glow3: "rgba(165, 65, 15, 0.5)",
    vibeText: "Adrenaline & Ember Pulses",
  },
  party: {
    id: "party",
    name: "Neon Euphoria",
    icon: "🎉",
    accent: "#f43f5e",
    accentSecondary: "#ec4899",
    glow1: "rgba(140, 20, 110, 0.55)",
    glow2: "rgba(20, 110, 150, 0.55)",
    glow3: "rgba(130, 15, 160, 0.5)",
    vibeText: "Club Lights & Dancefloor Beats",
  },
  cozy: {
    id: "cozy",
    name: "Warm Acoustic",
    icon: "☕",
    accent: "#f59e0b",
    accentSecondary: "#d97706",
    glow1: "rgba(130, 80, 25, 0.5)",
    glow2: "rgba(90, 50, 15, 0.6)",
    glow3: "rgba(150, 100, 35, 0.45)",
    vibeText: "Coffeehouse & Soft Sunlit Bokeh",
  },
  heartbreak: {
    id: "heartbreak",
    name: "Heartbreak & Healing",
    icon: "💔",
    accent: "#94a3b8",
    accentSecondary: "#64748b",
    glow1: "rgba(40, 48, 75, 0.55)",
    glow2: "rgba(22, 28, 48, 0.65)",
    glow3: "rgba(60, 75, 105, 0.45)",
    vibeText: "Emotional Waves & Melancholic Drift",
  },
};

const PARTICLE_SYMBOLS = ["♪", "♫", "♩", "♬", "·", "♪", "♫", "·", "♩", "♬"];

export default function AmbientBackground({ genre, aiMood, onResetMood }) {
  // If an AI Mood is active, use its palette; otherwise fall back to genre themes
  const activeMoodTheme = aiMood && AI_MOOD_THEMES[aiMood] ? AI_MOOD_THEMES[aiMood] : null;
  const currentTheme = activeMoodTheme || getGenreTheme(genre);

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
    <div className={`ambient-bg-container ${aiMood ? `ai-mood-${aiMood}` : ""}`}>
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

      {/* ══ WEATHER & VIBE GENERATIVE CANVASES ══ */}
      {aiMood === "rainy" && <RainCanvas />}
      {aiMood === "night" && <StarCanvas />}
      {aiMood === "workout" && <EmberCanvas />}
      {aiMood === "cozy" && <BokehCanvas />}

      {/* Default Music Note Particles (hidden when weather canvases are running) */}
      {!aiMood && (
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
      )}

      {/* Floating Active Atmosphere Indicator */}
      {activeMoodTheme && onResetMood && (
        <div className="ai-atmosphere-pill-badge" title="AI Ambient Atmosphere is active">
          <Sparkles size={13} className="ai-pill-sparkle" />
          <span className="ai-pill-icon">{activeMoodTheme.icon}</span>
          <span className="ai-pill-title">{activeMoodTheme.name} Vibe</span>
          <button
            type="button"
            className="ai-pill-reset-btn"
            onClick={onResetMood}
            title="Reset to default theme"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── 🌧️ GENERATIVE RAIN CANVAS (Smooth drops + splash ripples) ─────────────
function RainCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Number of falling drops adapted to screen width
    const count = Math.min(85, Math.floor(width / 16));
    const drops = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 26 + 18,
      speed: Math.random() * 9 + 14,
      opacity: Math.random() * 0.35 + 0.15,
      wind: 1.8,
    }));

    const ripples = [];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update falling raindrops
      ctx.lineWidth = 1.2;
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.strokeStyle = `rgba(186, 215, 248, ${d.opacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.wind * (d.length / d.speed), d.y + d.length);
        ctx.stroke();

        d.x += d.wind;
        d.y += d.speed;

        // Splashes at the bottom
        if (d.y > height - 12) {
          if (Math.random() < 0.28) {
            ripples.push({
              x: d.x,
              y: height - Math.random() * 16,
              radius: 1,
              maxRadius: Math.random() * 7 + 4,
              opacity: 0.45,
            });
          }
          d.y = -30;
          d.x = Math.random() * width;
        }
      }

      // Draw splash ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        ctx.strokeStyle = `rgba(186, 215, 248, ${r.opacity})`;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius * 2.2, r.radius * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();

        r.radius += 0.4;
        r.opacity -= 0.022;
        if (r.opacity <= 0) {
          ripples.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-weather-canvas ambient-rain-canvas" />;
}

// ── 🌙 GENERATIVE MIDNIGHT STARS CANVAS ──────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const count = Math.min(70, Math.floor(width / 22));
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.6,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.angle += s.pulseSpeed;
        const currentOpacity = s.opacity + Math.sin(s.angle) * 0.25;

        ctx.fillStyle = `rgba(224, 215, 255, ${Math.max(0.1, currentOpacity)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-weather-canvas ambient-star-canvas" />;
}

// ── ⚡ GENERATIVE EMBER PARTICLES CANVAS (Workout/Fire) ──────────────────
function EmberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const count = Math.min(50, Math.floor(width / 25));
    const embers = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 40,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 1.8 + 0.8,
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        ctx.fillStyle = `rgba(255, 120, 50, ${e.opacity})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();

        e.y -= e.speedY;
        e.x += e.speedX;

        if (e.y < -10) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-weather-canvas ambient-ember-canvas" />;
}

// ── ☕ GENERATIVE WARM BOKEH CANVAS (Cozy/Acoustic) ──────────────────────
function BokehCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const count = Math.min(35, Math.floor(width / 35));
    const orbs = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 30 + 15,
      speedY: (Math.random() - 0.5) * 0.4,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.12 + 0.04,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        ctx.fillStyle = `rgba(245, 180, 80, ${o.opacity})`;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
        ctx.fill();

        o.x += o.speedX;
        o.y += o.speedY;

        if (o.x < -40) o.x = width + 40;
        if (o.x > width + 40) o.x = -40;
        if (o.y < -40) o.y = height + 40;
        if (o.y > height + 40) o.y = -40;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-weather-canvas ambient-bokeh-canvas" />;
}

