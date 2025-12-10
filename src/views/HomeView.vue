<template>
  <div class="home">

    <div v-if="isLoading" class="loading-skeleton">
      <div class="skeleton-banner"></div>
      <div class="skeleton-row-container" v-for="n in 3" :key="n">
        <div class="skeleton-title"></div>
        <div class="skeleton-posters">
          <div class="skeleton-poster" v-for="m in 6" :key="m"></div>
        </div>
      </div>
    </div>

    <div v-else>
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
const isLoading = ref(true); // 로딩 상태 추가

const { isWished, toggleWishlist, loadWishlist } = useWishlist();

const truncate = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

onMounted(async () => {
  loadWishlist();
  isLoading.value = true; // 로딩 시작
  try {
    // 4개의 API 호출이 다 끝날 때까지 기다림
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
  } finally {
    isLoading.value = false; // 로딩 끝 (성공하든 실패하든 실행)
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

/* 영화 목록 스타일 */
.rows-container {
  position: relative;
  z-index: 20;
  margin-top: -50px;
  padding-left: 20px;
}

.row { margin-bottom: 40px; }
.row h2 { font-size: 1.4rem; font-weight: bold; margin-bottom: 15px; margin-left: 10px; }

.row-posters {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 10px;
  padding: 10px;
  scroll-behavior: smooth;
}
.row-posters::-webkit-scrollbar { display: none; }
.row-posters { -ms-overflow-style: none; scrollbar-width: none; }

/* 🌟 스켈레톤 로딩 애니메이션 (Fancy Style 점수용) */
.loading-skeleton { padding: 0; width: 100%; overflow: hidden; }

/* 반짝이는 효과 정의 */
@keyframes pulse {
  0% { opacity: 0.3; background-color: #333; }
  50% { opacity: 0.5; background-color: #444; }
  100% { opacity: 0.3; background-color: #333; }
}

.skeleton-banner {
  width: 100%; height: 500px;
  margin-bottom: 20px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-row-container { margin: 20px 0 40px 20px; }
.skeleton-title {
  width: 200px; height: 30px; margin-bottom: 15px; border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}
.skeleton-posters { display: flex; gap: 10px; overflow: hidden; }
.skeleton-poster {
  width: 160px; height: 240px; border-radius: 4px; flex-shrink: 0;
  animation: pulse 1.5s infinite ease-in-out;
}
</style>