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

          <div class="banner-meta">
            <span class="meta-rating">⭐ {{ bannerMovie.vote_average?.toFixed(1) }}</span>
            <span class="meta-year" v-if="bannerMovie.release_date">
              {{ bannerMovie.release_date.split('-')[0] }}
            </span>
          </div>

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
// 4개의 API 함수 호출 (과제 필수 요건 충족)
import { fetchPopularMovies, fetchNowPlaying, fetchTopRated, fetchActionMovies, getImageUrl } from '@/api/tmdb';
import MovieCard from '@/components/movie/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist';

const popularMovies = ref([]);
const nowPlayingMovies = ref([]);
const topRatedMovies = ref([]);
const actionMovies = ref([]);
const bannerMovie = ref(null);
const isLoading = ref(true);

const { isWished, toggleWishlist, loadWishlist } = useWishlist();

// 설명 글자수 자르기 함수
const truncate = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

onMounted(async () => {
  loadWishlist();
  isLoading.value = true;
  try {
    // API 병렬 호출
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

    // 배너 영화 설정 (인기 영화 중 첫 번째)
    bannerMovie.value = popRes.data.results[0];
  } catch (error) {
    console.error("영화 로딩 실패:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.home { background-color: #141414; min-height: 100vh; color: white; padding-bottom: 50px; }

/* 배너 스타일 */
.banner {
  color: white; object-fit: contain; height: 550px; /* 높이 조정 */
  background-size: cover; background-position: center top; position: relative;
}
.banner-contents {
  margin-left: 40px; padding-top: 180px; height: 230px;
  position: relative; z-index: 10;
}
.banner-title {
  font-size: 3.5rem; font-weight: 800; padding-bottom: 0.3rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  margin-bottom: 10px;
}

/* 🌟 배너 메타 정보 (평점, 연도) 스타일 */
.banner-meta {
  display: flex; gap: 15px; margin-bottom: 15px; font-weight: bold; font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}
.meta-rating { color: #46d369; /* 넷플릭스 일치율 색상 (초록) */ }
.meta-year { color: #aaa; }

.banner-description {
  width: 45rem; line-height: 1.4; padding-top: 1rem;
  font-size: 1.1rem; max-width: 500px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  color: #ddd;
}
.banner-buttons { margin-bottom: 15px; }
.banner-button {
  cursor: pointer; color: #fff; outline: none; border: none;
  font-weight: 700; border-radius: 4px; padding: 0.6rem 2.5rem;
  margin-right: 1rem; background-color: rgba(51, 51, 51, 0.7);
  font-size: 1.1rem; transition: all 0.2s;
}
.banner-button.play { background-color: white; color: black; }
.banner-button.play:hover { background-color: #c7c7c7; }
.banner-button.info:hover { background-color: rgba(255, 255, 255, 0.2); }

.banner--fadeBottom {
  height: 10rem;
  background-image: linear-gradient(180deg, transparent, rgba(20, 20, 20, 0.61), #141414);
  position: absolute; bottom: 0; width: 100%;
}

/* 영화 목록 스타일 */
.rows-container { position: relative; z-index: 20; margin-top: -60px; padding-left: 20px; }
.row { margin-bottom: 40px; }
.row h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 15px; margin-left: 10px; color: #e5e5e5; }

.row-posters {
  display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden;
  gap: 12px; padding: 10px; scroll-behavior: smooth;
}
.row-posters::-webkit-scrollbar { display: none; }
.row-posters { -ms-overflow-style: none; scrollbar-width: none; }

/* 스켈레톤 애니메이션 */
@keyframes pulse {
  0% { opacity: 0.3; background-color: #333; }
  50% { opacity: 0.5; background-color: #444; }
  100% { opacity: 0.3; background-color: #333; }
}
.loading-skeleton { padding: 0; width: 100%; overflow: hidden; }
.skeleton-banner { width: 100%; height: 550px; margin-bottom: 20px; animation: pulse 1.5s infinite ease-in-out; }
.skeleton-row-container { margin: 20px 0 40px 20px; }
.skeleton-title { width: 200px; height: 30px; margin-bottom: 15px; border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
.skeleton-posters { display: flex; gap: 10px; overflow: hidden; }
.skeleton-poster { width: 160px; height: 240px; border-radius: 4px; flex-shrink: 0; animation: pulse 1.5s infinite ease-in-out; }
</style>