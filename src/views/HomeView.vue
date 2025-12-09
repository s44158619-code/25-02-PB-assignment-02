<template>
  <div class="home">
    <header class="banner" v-if="bannerMovie"
            :style="{ backgroundImage: `url(${getImageUrl(bannerMovie.backdrop_path, 'original')})` }"
    >
      <div class="banner-contents">
        <h1 class="banner-title">{{ bannerMovie.title }}</h1>
        <div class="banner-buttons">
          <button class="banner-button play">▶ 재생</button>
          <button class="banner-button info" @click="toggleWishlist(bannerMovie)">
            {{ isWished(bannerMovie) ? '✓ 찜한 콘텐츠' : '+ 찜하기' }}
          </button>
        </div>
        <p class="banner-description">{{ truncate(bannerMovie.overview, 150) }}</p>
      </div>
      <div class="banner--fadeBottom"></div>
    </header>

    <div class="rows-container">
      <div class="row">
        <h2>🔥 지금 뜨는 콘텐츠</h2>
        <div class="row-posters">
          <MovieCard v-for="movie in popularMovies" :key="movie.id" :movie="movie"
                     :isWished="isWished(movie)" @toggle-wish="toggleWishlist" />
        </div>
      </div>

      <div class="row">
        <h2>🎬 최신 상영작</h2>
        <div class="row-posters">
          <MovieCard v-for="movie in nowPlayingMovies" :key="movie.id" :movie="movie"
                     :isWished="isWished(movie)" @toggle-wish="toggleWishlist" />
        </div>
      </div>

      <div class="row">
        <h2>⭐ 평론가 호평 영화</h2>
        <div class="row-posters">
          <MovieCard v-for="movie in topRatedMovies" :key="movie.id" :movie="movie"
                     :isWished="isWished(movie)" @toggle-wish="toggleWishlist" />
        </div>
      </div>

      <div class="row">
        <h2>💥 액션 영화</h2>
        <div class="row-posters">
          <MovieCard v-for="movie in actionMovies" :key="movie.id" :movie="movie"
                     :isWished="isWished(movie)" @toggle-wish="toggleWishlist" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchPopularMovies, fetchNowPlaying, fetchTopRated, fetchActionMovies, getImageUrl } from '@/api/tmdb';
import MovieCard from '@/components/movie/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist';

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
    bannerMovie.value = popRes.data.results[0];
  } catch (error) {
    console.error("영화 로딩 실패:", error);
  }
});
</script>

<style scoped>
.home { background-color: #141414; min-height: 100vh; color: white; padding-bottom: 50px; }

/* 배너 스타일 */
.banner {
  color: white; object-fit: contain; height: 500px;
  background-size: cover; background-position: center top; position: relative;
}
.banner-contents { margin-left: 30px; padding-top: 180px; height: 190px; position: relative; z-index: 10; }
.banner-title { font-size: 3rem; font-weight: 800; padding-bottom: 0.3rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
.banner-description { width: 45rem; line-height: 1.3; padding-top: 1rem; font-size: 1rem; max-width: 400px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }
.banner-button { cursor: pointer; color: #fff; outline: none; border: none; font-weight: 700; border-radius: 4px; padding: 0.5rem 2rem; margin-right: 1rem; background-color: rgba(51, 51, 51, 0.5); }
.banner-button:hover { color: #000; background-color: #e6e6e6; transition: all 0.2s; }
.banner--fadeBottom { height: 7.4rem; background-image: linear-gradient(180deg, transparent, rgba(20, 20, 20, 0.61), #141414); position: absolute; bottom: 0; width: 100%; }

/* 🌟 영화 목록 스타일 (핵심) */
.rows-container {
  position: relative;
  z-index: 20;
  margin-top: -50px; /* 배너 위로 살짝 올라오게 */
  padding-left: 20px;
}

.row { margin-bottom: 40px; }
.row h2 { font-size: 1.4rem; font-weight: bold; margin-bottom: 15px; margin-left: 10px; }

/* 가로 스크롤 컨테이너 */
.row-posters {
  display: flex; /* 가로 배치 */
  flex-wrap: nowrap; /* 줄바꿈 금지 (중요!) */
  overflow-x: auto; /* 가로 스크롤 허용 */
  overflow-y: hidden;
  gap: 10px; /* 포스터 사이 간격 */
  padding: 10px;
  scroll-behavior: smooth;
}

/* 스크롤바 숨기기 (크롬/사파리) */
.row-posters::-webkit-scrollbar { display: none; }
/* 스크롤바 숨기기 (파이어폭스) */
.row-posters { -ms-overflow-style: none; scrollbar-width: none; }
</style>