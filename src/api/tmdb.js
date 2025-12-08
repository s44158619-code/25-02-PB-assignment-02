import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// 기본 설정이 된 Axios 인스턴스 생성
const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'ko-KR', // 한국어 결과 받기
    },
});

export const fetchPopularMovies = () => tmdbApi.get('/movie/popular');
export const fetchNowPlaying = () => tmdbApi.get('/movie/now_playing');
export const fetchTopRated = () => tmdbApi.get('/movie/top_rated');
export const fetchActionMovies = () => tmdbApi.get('/discover/movie?with_genres=28');

// 이미지 전체 경로를 만들어주는 헬퍼 함수
export const getImageUrl = (path, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
};