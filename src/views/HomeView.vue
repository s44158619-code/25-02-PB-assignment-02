<template>
  <div class="home">
    <header class="banner" v-if="bannerMovie"
            :style="{ backgroundImage: `url(${getImageUrl(bannerMovie.backdrop_path, 'original')})` }"
    >
      <div class="banner-contents">
        <h1 class="banner-title">{{ bannerMovie.title }}</h1>
        <div class="banner-buttons">
          <button class="banner-button play">▶ 재생</button>
          <button class="banner-button info" @click="toggleWishlist(bannerMovie)">+ 찜하기</button>
        </div>
        <h1 class="banner-description">{{ truncate(bannerMovie.overview, 150) }}</h1>
      </div>
      <div class="banner--fadeBottom"></div>
    </header>

    <div class="row">
      <h2>🔥 지금 뜨는 콘텐츠</h2>
      <div class="row-posters">
        <MovieCard v-for="movie in popularMovies" :key="movie.id" :movie="movie"
                   :isWished="isWished(movie)" @toggle-wish="toggleWishlist" class="poster-wrapper" />
      </div>
    </div>

    <div class="row">
      <h2>🎬 최신 상영작</h2>
      <div class="row-posters">
        <MovieCard v-for="movie in nowPlayingMovies" :key="movie.id" :movie="movie"
                   :isWished="isWished(movie)" @toggle-wish="toggleWishlist" class="poster-wrapper" />
      </div>
    </div>

    <div class="row">
      <h2>⭐ 평론가 호평 영화</h2>
      <div class="row-posters">
        <MovieCard v-for="movie in topRatedMovies" :key="movie.id" :movie="movie"
                   :isWished="isWished(movie)" @toggle-wish="toggleWishlist" class="poster-wrapper" />
      </div>
    </div>

    <div class="row">
      <h2>💥 액션 영화</h2>
      <div class="row-posters">
        <MovieCard v-for="movie in actionMovies" :key="movie.id" :movie="movie"
                   :isWished="isWished(movie)" @toggle-wish="toggleWishlist" class="poster-wrapper" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 4개의 API 함수 모두 가져오기
import { fetchPopularMovies, fetchNowPlaying, fetchTopRated, fetchActionMovies, getImageUrl } from '@/api/tmdb';
import MovieCard from '@/components/movie/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist';

// 각각의 데이터를 담을 변수들
const popularMovies = ref([]);
const nowPlayingMovies = ref([]);
const topRatedMovies = ref([]);
const actionMovies = ref([]);
const bannerMovie = ref(null);

const { isWished, toggleWishlist, loadWishlist } = useWishlist();

const truncate = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

onMounted(async () => {
  loadWishlist();
  try {
    // 4개의 API 동시에 호출 (병렬 처리로 속도 향상)
    const [popRes, nowRes, topRes, actRes] = await Promise.all([
      fetchPopularMovies(),
      fetchNowPlaying(),
      fetchTopRated(),
      fetchActionMovies()
    ]);

    popularMovies.value = popRes.data.results;
    nowPlayingMovies.value = nowRes.data.results;
    topRatedMovies.value = topRes.data.results;
    actionMovies.value = actRes.data.results;

    // 배너는 인기 영화 중 첫 번째로 설정
    bannerMovie.value = popRes.data.results[0];
  } catch (error) {
    console.error("영화 로딩 실패:", error);
  }
});
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.home { background-color: #111; min-height: 100vh; color: white; padding-bottom: 50px; }
.banner { color: white; object-fit: contain; height: 448px; background-size: cover; background-position: center top; position: relative; }
.banner-contents { margin-left: 30px; padding-top: 140px; height: 190px; }
.banner-title { font-size: 3rem; font-weight: 800; padding-bottom: 0.3rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.6); }
.banner-description { width: 45rem; line-height: 1.3; padding-top: 1rem; font-size: 0.8rem; max-width: 360px; height: 80px; text-shadow: 1px 1px 2px rgba(0,0,0,0.6); }
.banner-button { cursor: pointer; color: #fff; outline: none; border: none; font-weight: 700; border-radius: 0.2vw; padding-left: 2rem; padding-right: 2rem; margin-right: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; background-color: rgba(51, 51, 51, 0.5); }
.banner-button:hover { color: #000; background-color: #e6e6e6; transition: all 0.2s; }
.banner--fadeBottom { height: 7.4rem; background-image: linear-gradient(180deg, transparent, rgba(17, 17, 17, 0.61), #111); position: absolute; bottom: 0; width: 100%; }
.row { margin-left: 20px; margin-top: 20px; }
.row h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; }
.row-posters { display: flex; overflow-y: hidden; overflow-x: scroll; padding: 20px; gap: 10px; }
.row-posters::-webkit-scrollbar { display: none; }
</style>