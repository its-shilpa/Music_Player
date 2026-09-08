# 🎵 MusePlay

A modern music streaming web app built with React, featuring an AI-powered mood DJ (Gemini) that curates personalized playlists from a natural-language prompt.

**Live Site:** [reactjs-musicapp.netlify.app](https://reactjs-musicapp.netlify.app/)
**Backend API:** [museplay-ai-server.onrender.com](https://museplay-ai-server.onrender.com/)

---

## ✨ Features

- **🎧 Gemini AI Mood DJ** — Describe a mood, vibe, or activity ("sunset drive with friends, uplifting beats") and get a custom-curated playlist with an AI-written title, DJ intro, and vibe tags.
- **⚡ Quick Vibes & Ambient Atmosphere** — One-tap mood presets (Rainy & Calm, Late Night Chill, Workout Energy, Heartbreak & Soul, Party Dance, and more) that also shift the app's ambient UI theme to match.
- **🔍 Smart Search** — Search songs, artists, and genres, with voice search support.
- **🎼 Song Discovery** — Browse by genre, explore featured music, and check out popular artists.
- **🕓 Recently Played** — Quickly jump back into what you were listening to.
- **❤️ Favorites** — Save songs you love for quick access.
- **📃 Queue Management** — View and manage your play queue.
- **🌗 Light/Dark Mode** — Toggle between themes for comfortable listening at any time of day.
- **🍏 iTunes Integration** — AI recommendations are automatically resolved to real, playable tracks (with artwork and previews) via the iTunes Search API.
- **🛡️ Resilient AI Backend** — If the Gemini API is rate-limited or briefly unavailable, an intelligent local fallback synthesizer keeps playlist curation working seamlessly.

---

## 🛠️ Tech Stack

**Frontend**
- React (Create React App)
- CSS

**Backend**
- Node.js + Express
- Google Gemini API (`gemini-flash-latest`) for AI playlist curation
- iTunes Search API for track resolution/artwork/previews

**Hosting**
- Frontend: [Netlify](https://www.netlify.com/)
- Backend: [Render](https://render.com/)

---

## 📂 Project Structure

```
musicapp/
├── public/
├── src/                  # React frontend
├── server/
│   └── index.js          # Express backend (Gemini AI DJ + iTunes resolver)
├── .env                  # Frontend env vars (VITE_API_URL, etc.)
├── .env.example
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) (no credit card required)

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/musicapp.git
cd musicapp
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd server
npm install express cors dotenv
cd ..
```

### 4. Set up environment variables

**Frontend** — create a `.env` file in the project root:
```
VITE_API_URL=http://localhost:3001
```

**Backend** — create a `.env` file inside `server/`:
```
GEMINI_API_KEY=your-key-here
```
> ⚠️ Do not prefix this with `VITE_` — that would expose the key in the browser bundle.

### 5. Run the backend server
```bash
node server/index.js
```
You should see: `AI recommend server on port 3001`

### 6. Run the frontend
In a separate terminal:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🌐 Deployment

This project is deployed as two separate services:

- **Frontend (Netlify):** builds and serves the static React app.
- **Backend (Render):** runs the Express server that talks to the Gemini API, since Netlify only serves static files and can't keep a persistent Node server running.

### Frontend (Netlify)
1. Connect the repo to Netlify.
2. Build command: `npm run build`
3. Publish directory: `build`
4. Add environment variable `VITE_API_URL` set to `https://museplay-ai-server.onrender.com`.

### Backend (Render)
1. Create a new **Web Service** on Render, connected to this repo.
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variable `GEMINI_API_KEY` with your Gemini API key.

> The backend restricts CORS to known frontend origins: `http://localhost:5173` (or `:3000`, depending on your dev server) and `https://reactjs-musicapp.netlify.app`. Update the `allowedOrigins` list in `server/index.js` if you deploy under a different domain.

---

## 📜 Available Scripts (Frontend)

In the project directory, you can run:

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page reloads on changes, and lint errors show in the console.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder, bundling and minifying React for the best performance.

### `npm run eject`
**One-way operation.** Copies all config files (webpack, Babel, ESLint, etc.) into the project for full control. Not recommended unless necessary.

---

## 🔑 Environment Variables Summary

| Variable | Location | Value | Purpose |
|---|---|---|---|
| `VITE_API_URL` | project root `.env` (local) | `http://localhost:3001` | URL the frontend uses to reach the AI backend locally |
| `VITE_API_URL` | Netlify env vars / `.env.production` (live) | `https://museplay-ai-server.onrender.com` | URL the frontend uses to reach the AI backend in production |
| `GEMINI_API_KEY` | `server/.env` (local) or Render dashboard (live) | your Gemini key | Auth key for Google Gemini API calls |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or file an issue.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- Built with [Create React App](https://github.com/facebook/create-react-app)
- AI curation powered by [Google Gemini](https://ai.google.dev/)
- Track data and previews via the [iTunes Search API](https://performance-partners.apple.com/search-api)