// src/components/AmbientBackground.jsx
// Purely decorative layer (grid lines, glowing orbs, floating music note
// particles) that sits behind every view. Pulled out of App.jsx because it
// never changes based on state - it doesn't need to be inline there.
const PARTICLE_SYMBOLS = ["♪", "♫", "♩", "♬", "·", "♪", "♫", "·", "♩", "♬"];

export default function AmbientBackground() {
  return (
    <>
      <div className="bg-grid" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />
      <div className="particles">
        {PARTICLE_SYMBOLS.map((sym, i) => (
          <span key={i} className="particle">
            {sym}
          </span>
        ))}
      </div>
    </>
  );
}
