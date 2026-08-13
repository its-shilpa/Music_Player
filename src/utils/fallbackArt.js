// src/utils/fallbackArt.js
//
// Pulled straight out of your App.jsx. These two functions build a little
// SVG "avatar" (as a data: URL) so a song/artist without a real photo still
// looks intentional instead of showing a broken image icon.
// Nothing about the logic changed - only the location moved so App.jsx
// doesn't have to carry ~40 lines of SVG string-building.

const NEXT_COLOR = {
  "#a855f7": "#f43f8e",
  "#f59e0b": "#a855f7",
  "#f43f8e": "#00d4ff",
  "#00d4ff": "#a855f7",
  "#14b8a6": "#6366f1",
  "#6366f1": "#ec4899",
  "#ec4899": "#14b8a6",
  "#22c55e": "#00d4ff",
};

export function makeFallbackSVG(name, color) {
  const letter = name.charAt(0).toUpperCase();
  const color2 = NEXT_COLOR[color] || "#a855f7";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${color}' stop-opacity='0.9'/><stop offset='100%' stop-color='${color2}' stop-opacity='0.8'/></linearGradient><linearGradient id='g2' x1='100%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='${color2}' stop-opacity='0.3'/><stop offset='100%' stop-color='${color}' stop-opacity='0.1'/></linearGradient></defs><rect width='140' height='140' rx='12' fill='%231a1a35'/><rect width='140' height='140' rx='12' fill='url(%23g2)'/><circle cx='110' cy='30' r='50' fill='${color}' opacity='0.15'/><circle cx='25' cy='110' r='40' fill='${color2}' opacity='0.12'/><circle cx='70' cy='70' r='38' fill='none' stroke='url(%23g)' stroke-width='3' opacity='0.6'/><circle cx='70' cy='70' r='28' fill='none' stroke='${color}' stroke-width='1.5' opacity='0.35'/><circle cx='70' cy='70' r='12' fill='url(%23g)' opacity='0.9'/><circle cx='70' cy='70' r='4' fill='%230a0a18'/><text x='70' y='120' font-family='Segoe UI,sans-serif' font-size='13' font-weight='700' fill='${color}' opacity='0.7' text-anchor='middle'>${letter}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export function makeArtistFallbackSVG(name, color) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color2 = NEXT_COLOR[color] || "#a855f7";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><defs><linearGradient id='ag' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${color}' stop-opacity='0.25'/><stop offset='100%' stop-color='${color2}' stop-opacity='0.18'/></linearGradient></defs><circle cx='40' cy='40' r='40' fill='url(%23ag)'/><text x='40' y='47' font-family='Segoe UI,sans-serif' font-size='22' font-weight='800' fill='${color}' text-anchor='middle'>${initials}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
