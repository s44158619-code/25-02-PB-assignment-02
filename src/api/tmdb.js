import axios from 'axios';

// 👇 여기에 본인 API 키가 잘 들어있는지 확인하세요!
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

// ✅ 영화 목록 조회
export const fetchPopularMovies = (page = 1) => tmdbApi.get(`/movie/popular?page=${page}`);
export const fetchNowPlaying = () => tmdbApi.get('/movie/now_playing');
export const fetchTopRated = () => tmdbApi.get('/movie/top_rated');
export const fetchActionMovies = () => tmdbApi.get('/discover/movie?with_genres=28');

// ✅ 검색 및 장르
export const searchMovies = (query) => tmdbApi.get(`/search/movie?query=${query}`);
export const fetchGenres = () => tmdbApi.get('/genre/movie/list');

// ✅ (중요) 상세 정보 조회 - 이 부분이 없어서 에러가 났던 겁니다!
export const fetchMovieDetail = (id) => tmdbApi.get(`/movie/${id}?append_to_response=credits,similar`);

// ✅ 이미지 URL 생성기
export const getImageUrl = (path, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
};