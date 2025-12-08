import axios from 'axios';

// 👇 여기에 본인의 TMDB API 키를 직접 붙여넣으세요 (따옴표 안에!)
const API_KEY = '873823c4e95a50521bdb6dc92de74d3e';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    },
    params: {
        api_key: API_KEY,
        language: 'ko-KR',
    },
});

export const fetchPopularMovies = () => tmdbApi.get('/movie/popular');
export const fetchNowPlaying = () => tmdbApi.get('/movie/now_playing');
export const fetchTopRated = () => tmdbApi.get('/movie/top_rated');
export const fetchActionMovies = () => tmdbApi.get('/discover/movie?with_genres=28');
export const searchMovies = (query) => tmdbApi.get(`/search/movie?query=${query}`);

export const getImageUrl = (path, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
};