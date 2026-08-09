import axios from "axios";

export const searchSongs = async (query) => {
    const res = await axios.get(
        `https://api.deezer.com/search?q=${query}`
    );

    const mappedSongs = res.data.data.map((song) => ({
    id: song.id,
    name: song.title,
    artists: [song.artist.name],
    genre: "Pop", 
    color: "#8B5CF6",
    image: song.album.cover_big,
    preview: song.preview,
    }));

    return mappedSongs;
};