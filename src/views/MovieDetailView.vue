<template>
  <div v-if="movie" class="detail-container">
    <div
        class="backdrop"
        :style="{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})` }"
    >
      <div class="overlay"></div>
    </div>

    <div class="content-wrapper">
      <div class="poster-section">
        <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" class="main-poster" />
      </div>

      <div class="info-section">
        <h1 class="title">{{ movie.title }}</h1>
        <div class="meta">
          <span class="release-date">{{ movie.release_date?.split('-')[0] }}</span>
          <span class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
          <span class="runtime" v-if="movie.runtime">{{ movie.runtime }}분</span>
        </div>

        <div class="genres">
          <span v-for="genre in movie.genres" :key="genre.id" class="genre-tag">
            {{ genre.name }}
          </span>
        </div>

        <p class="tagline" v-if="movie.tagline">"{{ movie.tagline }}"</p>

        <h3 class="section-title">줄거리</h3>
        <p class="overview">{{ movie.overview }}</p>

        <div class="buttons">
          <button class="play-btn">▶ 재생</button>
          <button
              class="wish-btn"
              :class="{ active: isWished(movie) }"
              @click="toggleWishlist(movie)"
          >
            {{ isWished(movie) ? '✓ 찜한 콘텐츠' : '+ 찜하기' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">로딩 중...</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { fetchMovieDetail, getImageUrl } from '@/api/tmdb';
import { useWishlist } from '@/composables/useWishlist';

const route = useRoute();
const movie = ref(null);
const { isWished, toggleWishlist, loadWishlist } = useWishlist();

const loadData = async (id) => {
  try {
    const { data } = await fetchMovieDetail(id);
    movie.value = data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => {
  loadWishlist();
  loadData(route.params.id);
});

// URL의 ID가 바뀌면 데이터 다시 로드 (중요!)
watch(() => route.params.id, (newId) => loadData(newId));
</script>

<style scoped>
.detail-container { position: relative; color: white; min-height: 100vh; padding-top: 70px; }
.backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-size: cover; background-position: center; z-index: -1; }
.overlay { width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); }

.content-wrapper { display: flex; max-width: 1100px; margin: 0 auto; padding: 40px 20px; gap: 40px; align-items: flex-start; }

.main-poster { width: 300px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.5); }

.info-section { flex: 1; margin-top: 20px; }
.title { font-size: 3rem; font-weight: bold; margin-bottom: 10px; }
.meta { display: flex; gap: 15px; font-size: 1.1rem; color: #ddd; margin-bottom: 20px; }
.rating { color: #ffd700; }

.genres { display: flex; gap: 10px; margin-bottom: 20px; }
.genre-tag { border: 1px solid #fff; padding: 5px 10px; border-radius: 20px; font-size: 0.9rem; }

.tagline { font-style: italic; color: #aaa; margin-bottom: 20px; font-size: 1.1rem; }
.section-title { font-size: 1.5rem; margin-bottom: 10px; font-weight: bold; }
.overview { font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px; color: #ddd; }

.buttons { display: flex; gap: 15px; }
.play-btn, .wish-btn { padding: 12px 30px; font-size: 1.1rem; font-weight: bold; border-radius: 5px; cursor: pointer; border: none; }
.play-btn { background: white; color: black; }
.wish-btn { background: rgba(109, 109, 110, 0.7); color: white; }
.wish-btn.active { background: #E50914; }

.loading { text-align: center; margin-top: 100px; font-size: 2rem; color: white; }

@media (max-width: 768px) {
  .content-wrapper { flex-direction: column; align-items: center; }
  .main-poster { width: 200px; }
  .info-section { text-align: center; }
  .meta, .genres, .buttons { justify-content: center; }
}
</style>