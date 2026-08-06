import axios from "axios";

export const searchSongs = async (query) => {
    const res = await axios.get(
        `https://api.deezer.com/search?q=${query}`
    );

    return res.data.data;
};