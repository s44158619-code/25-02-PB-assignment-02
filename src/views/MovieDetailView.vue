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
          <button class="play-btn" @click="openTrailer">
            <i class="fas fa-play"></i> 예고편 보기
          </button>

          <button
              class="wish-btn"
              :class="{ active: isWished(movie) }"
              @click="toggleWishlist(movie)"
          >
            <i :class="isWished(movie) ? 'fas fa-check' : 'fas fa-plus'"></i> 찜하기
          </button>
        </div>
      </div>
    </div>

    <div class="similar-section" v-if="similarMovies.length > 0">
      <h2>비슷한 콘텐츠</h2>
      <div class="similar-grid">
        <MovieCard
            v-for="simMovie in similarMovies"
            :key="simMovie.id"
            :movie="simMovie"
            :isWished="isWished(simMovie)"
            @toggle-wish="toggleWishlist"
        />
      </div>
    </div>

    <div v-if="showTrailer" class="trailer-modal" @click="closeTrailer">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeTrailer">×</button>
        <iframe
            v-if="trailerKey"
            :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
        ></iframe>
        <div v-else class="no-trailer">
          <p>재생할 예고편이 없습니다. 😢</p>
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
import MovieCard from '@/components/movie/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist';

const route = useRoute();
const movie = ref(null);
const similarMovies = ref([]); // 추천 영화 데이터
const trailerKey = ref('');    // 유튜브 영상 키
const showTrailer = ref(false); // 모달 표시 여부

const { isWished, toggleWishlist, loadWishlist } = useWishlist();

// 데이터 로드 함수
const loadData = async (id) => {
  try {
    const { data } = await fetchMovieDetail(id);
    movie.value = data;

    // 1. 비슷한 영화 데이터 추출 (API 결과에 포함되어 있음)
    if (data.similar && data.similar.results) {
      similarMovies.value = data.similar.results.slice(0, 6); // 6개만 표시
    }

    // 2. 예고편 영상 키 추출 (YouTube 타입 찾기)
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      // 트레일러가 없으면 아무 영상이나 가져옴
      trailerKey.value = trailer ? trailer.key : (data.videos.results[0]?.key || '');
    }

    window.scrollTo(0, 0); // 페이지 상단으로 이동
  } catch (e) {
    console.error(e);
  }
};

// 예고편 모달 제어
const openTrailer = () => { showTrailer.value = true; };
const closeTrailer = () => { showTrailer.value = false; };

onMounted(() => {
  loadWishlist();
  loadData(route.params.id);
});

// URL ID 변경 감지 (비슷한 영화 클릭 시 이동 위함)
watch(() => route.params.id, (newId) => loadData(newId));
</script>

<style scoped>
.detail-container { position: relative; color: white; min-height: 100vh; padding-top: 70px; padding-bottom: 50px; }
.backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-size: cover; background-position: center; z-index: -1; }
.overlay { width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(0,0,0,0.2), #141414); backdrop-filter: blur(5px); }

.content-wrapper { display: flex; max-width: 1100px; margin: 0 auto; padding: 40px 20px; gap: 40px; align-items: flex-start; z-index: 10; position: relative; }
.main-poster { width: 300px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.5); }

.info-section { flex: 1; margin-top: 20px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
.title { font-size: 3rem; font-weight: bold; margin-bottom: 10px; }
.meta { display: flex; gap: 15px; font-size: 1.1rem; color: #ddd; margin-bottom: 20px; }
.rating { color: #46d369; font-weight: bold; }

.genres { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.genre-tag { border: 1px solid #aaa; padding: 5px 12px; border-radius: 20px; font-size: 0.9rem; color: #ddd; }

.tagline { font-style: italic; color: #aaa; margin-bottom: 20px; font-size: 1.1rem; border-left: 3px solid #E50914; padding-left: 10px; }
.section-title { font-size: 1.5rem; margin-bottom: 10px; font-weight: bold; }
.overview { font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px; color: #eee; }

.buttons { display: flex; gap: 15px; }
.play-btn, .wish-btn { padding: 12px 30px; font-size: 1.1rem; font-weight: bold; border-radius: 4px; cursor: pointer; border: none; display: flex; align-items: center; gap: 8px; transition: transform 0.2s; }
.play-btn { background: white; color: black; }
.play-btn:hover { background: #ddd; transform: scale(1.05); }
.wish-btn { background: rgba(109, 109, 110, 0.7); color: white; }
.wish-btn:hover { background: rgba(109, 109, 110, 0.9); transform: scale(1.05); }
.wish-btn.active { border: 1px solid white; }

/* 🌟 추천 영화 섹션 스타일 */
.similar-section { max-width: 1100px; margin: 50px auto 0; padding: 0 20px; z-index: 10; position: relative; }
.similar-section h2 { font-size: 1.8rem; margin-bottom: 20px; font-weight: bold; border-left: 5px solid #E50914; padding-left: 15px; }
.similar-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: flex-start; }

/* 🌟 유튜브 모달 스타일 */
.trailer-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; justify-content: center; align-items: center; }
.modal-content { position: relative; width: 90%; max-width: 900px; aspect-ratio: 16/9; background: black; box-shadow: 0 0 20px rgba(255,255,255,0.1); }
iframe { width: 100%; height: 100%; }
.close-btn { position: absolute; top: -40px; right: -10px; background: none; border: none; color: white; font-size: 3rem; cursor: pointer; }
.no-trailer { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: white; font-size: 1.2rem; }

.loading { text-align: center; margin-top: 100px; font-size: 2rem; color: white; }

@media (max-width: 768px) {
  .content-wrapper { flex-direction: column; align-items: center; }
  .main-poster { width: 200px; }
  .info-section { text-align: center; }
  .meta, .genres, .buttons { justify-content: center; }
  .similar-grid { justify-content: center; }
}
</style>