import axios from 'axios';

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

// page 매개변수 추가됨!
export const fetchPopularMovies = (page = 1) => tmdbApi.get(`/movie/popular?page=${page}`);
export const fetchNowPlaying = () => tmdbApi.get('/movie/now_playing');
export const fetchTopRated = () => tmdbApi.get('/movie/top_rated');
export const fetchActionMovies = () => tmdbApi.get('/discover/movie?with_genres=28');
export const searchMovies = (query) => tmdbApi.get(`/search/movie?query=${query}`);
export const fetchGenres = () => tmdbApi.get('/genre/movie/list'); // 장르 목록용 추가

export const getImageUrl = (path, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';
};