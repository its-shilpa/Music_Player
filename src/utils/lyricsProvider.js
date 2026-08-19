// src/utils/lyricsProvider.js
// Precise line-by-line lyrics database synchronized with 29-second iTunes audio preview starts.

const LYRICS_DATABASE = {
  "apna bana le": [
    { time: 0, text: "Apna bana le mujhe, apna bana le mujhe" },
    { time: 4.8, text: "Apna bana le mujhe, apna bana le piya" },
    { time: 9.6, text: "Dil ke nishaan hain, toote se taare" },
    { time: 14.2, text: "Hum chal rahe hain, tere sahaare" },
    { time: 19.0, text: "Apna bana le mujhe, apna bana le mujhe" },
    { time: 23.8, text: "Apna bana le mujhe, apna bana le piya" }
  ],
  "tum hi ho": [
    { time: 0, text: "Hum tere bin ab reh nahi sakte" },
    { time: 3.5, text: "Tere bina kya wajood mera" },
    { time: 7.2, text: "Tujhse juda agar ho jaayenge" },
    { time: 11.2, text: "Toh khud se hi ho jaayenge juda" },
    { time: 15.0, text: "Kyunki tum hi ho, ab tum hi ho" },
    { time: 18.8, text: "Zindagi ab tum hi ho" },
    { time: 22.0, text: "Chain bhi, mera dard bhi" },
    { time: 25.0, text: "Meri aashiqui ab tum hi ho" }
  ],
  "kesariya": [
    { time: 0, text: "Kesariya tera ishq hai piya" },
    { time: 4.5, text: "Rang jaaun jo main haath lagaaun" },
    { time: 9.0, text: "Din beete saara teri fikr mein" },
    { time: 13.8, text: "Rain saari teri khair manaayn" },
    { time: 18.2, text: "Kesariya tera ishq hai piya" },
    { time: 22.8, text: "Rang jaaun jo main haath lagaaun" }
  ],
  "tujh mein rab dikhta hai": [
    { time: 0, text: "Tujh mein rab dikhta hai, yaara mein kya karu" },
    { time: 6.8, text: "Tujh mein rab dikhta hai, yaara mein kya karu" },
    { time: 13.5, text: "Sajde sar jhukta hai, yaara mein kya karu" },
    { time: 20.0, text: "Tujh mein rab dikhta hai, yaara mein kya karu" }
  ],
  "dil ibaadat": [
    { time: 0, text: "Dil ibaadat kar raha hai, dhadkane meri sun" },
    { time: 6.5, text: "Tujhko main kar loon haasil, mil gaya hoon main yoon" },
    { time: 13.0, text: "Dil ibaadat kar raha hai, dhadkane meri sun" },
    { time: 19.5, text: "Tujhko main kar loon haasil, mil gaya hoon main yoon" }
  ],
  "khairiyat": [
    { time: 0, text: "Khairiyat pucho, kabhi toh kaifiyat pucho" },
    { time: 6.2, text: "Tumhare bin deewane ka kya haal hai" },
    { time: 12.5, text: "Dil mera dekho, na meri haisiyat pucho" },
    { time: 18.8, text: "Tere bin ek din jaise sau saal hai" }
  ]
};

const DEFAULT_LYRICS = [
  { time: 0, text: "🎶 (Instrumental Intro) 🎶" },
  { time: 3.5, text: "Enjoying the beats of this preview..." },
  { time: 8.0, text: "Feel the music flow through you" },
  { time: 13.0, text: "Sing along! Sing your own song now" },
  { time: 18.0, text: "This premium MusePlay sound..." },
  { time: 23.0, text: "🎶 (Outro - Beat fades out) 🎶" }
];

export function getLyricsForSong(songName) {
  if (!songName) return DEFAULT_LYRICS;
  const key = songName.toLowerCase();
  
  // Try exact lookup first
  if (LYRICS_DATABASE[key]) {
    return LYRICS_DATABASE[key];
  }
  
  // Try partial search (e.g. "apna bana le (from bhediya)" matches "apna bana le")
  for (const [dbKey, lyrics] of Object.entries(LYRICS_DATABASE)) {
    if (key.includes(dbKey)) {
      return lyrics;
    }
  }
  
  return DEFAULT_LYRICS;
}
