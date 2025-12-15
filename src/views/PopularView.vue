<template>
  <div class="popular-container">
    <div class="header-control">
      <h1>대세 콘텐츠</h1>

      <div class="view-toggle">
        <button
            :class="{ active: viewMode === 'table' }"
            @click="changeViewMode('table')"
        >
          <i class="fas fa-table"></i> 테이블
        </button>
        <button
            :class="{ active: viewMode === 'infinite' }"
            @click="changeViewMode('infinite')"
        >
          <i class="fas fa-scroll"></i> 무한 스크롤
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'table'" class="table-view">
      <div class="movie-grid">
        <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            :isWished="isWished(movie)"
            @toggle-wish="toggleWishlist"
        />
      </div>

      <div class="pagination">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="page-btn">
          <i class="fas fa-chevron-left"></i> 이전
        </button>
        <span class="page-info">{{ currentPage }} 페이지</span>
        <button @click="changePage(currentPage + 1)" class="page-btn">
          다음 <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div v-else class="infinite-view">
      <div class="movie-grid">
        <MovieCard
            v-for="movie in infiniteMovies"
            :key="`inf-${movie.id}`"
            :movie="movie"
            :isWished="isWished(movie)"
            @toggle-wish="toggleWishlist"
        />
      </div>

      <div v-if="isLoading" class="loading-skeleton">
        <div class="skeleton-card" v-for="n in 5" :key="n"></div>
      </div>

      <button v-show="showTopBtn" @click="scrollToTop" class="top-btn" title="맨 위로">
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { fetchPopularMovies } from '@/api/tmdb';
import MovieCard from '@/components/movie/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist';

const viewMode = ref('table');
const movies = ref([]);
const infiniteMovies = ref([]);
const currentPage = ref(1);
const infinitePage = ref(1);
const isLoading = ref(false);
const showTopBtn = ref(false);

const { isWished, toggleWishlist, loadWishlist } = useWishlist();

const loadTableData = async (page) => {
  isLoading.value = true;
  try {
    const { data } = await fetchPopularMovies(page);
    movies.value = data.results;
    currentPage.value = page;
    window.scrollTo(0, 0);
  } catch (err) { console.error(err); }
  finally { isLoading.value = false; }
};

const loadMoreData = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const { data } = await fetchPopularMovies(infinitePage.value);
    const newMovies = data.results.filter(newM => !infiniteMovies.value.some(existing => existing.id === newM.id));
    infiniteMovies.value.push(...newMovies);
    infinitePage.value++;
  } catch (err) { console.error(err); }
  finally { isLoading.value = false; }
};

const changeViewMode = (mode) => {
  viewMode.value = mode;
  if (mode === 'infinite' && infiniteMovies.value.length === 0) loadMoreData();
};

const changePage = (page) => { if (page > 0) loadTableData(page); };

const handleScroll = () => {
  showTopBtn.value = window.scrollY > 500;
  if (viewMode.value === 'infinite') {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) loadMoreData();
  }
};

const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

onMounted(() => {
  loadWishlist();
  loadTableData(1);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => { window.removeEventListener('scroll', handleScroll); });
</script>

<style scoped>
.popular-container { padding: 100px 4% 50px; color: white; min-height: 100vh; }
.header-control { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }

.view-toggle button { background: transparent; border: 1px solid #aaa; color: #aaa; padding: 8px 16px; margin-left: 10px; cursor: pointer; border-radius: 4px; transition: all 0.3s; font-size: 0.9rem; }
.view-toggle button.active { background: #E50914; border-color: #E50914; color: white; font-weight: bold; }

/* 🌟 그리드 레이아웃 (PC) */
.movie-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.pagination { display: flex; justify-content: center; align-items: center; margin-top: 50px; gap: 20px; }
.page-btn { background: #333; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; }
.page-btn:disabled { opacity: 0.5; }

.top-btn { position: fixed; bottom: 30px; right: 30px; background-color: #E50914; color: white; border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; z-index: 99; }

.loading-skeleton { display: flex; justify-content: center; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
.skeleton-card { width: 160px; height: 240px; background: #333; border-radius: 4px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.7; } 100% { opacity: 0.4; } }

/* 📱 [모바일 최적화 - 핵심 수정] */
@media (max-width: 768px) {
  .popular-container {
    padding: 80px 10px 50px; /* 여백 최소화 */
  }

  /* 🌟 모바일에서는 Flex 대신 Grid로 강제 변환하여 한 줄에 3개씩 표시 */
  .movie-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important; /* 3열 고정 */
    gap: 8px; /* 간격 좁게 */
  }

  /* 버튼 및 제목 크기 축소 */
  h1 { font-size: 1.5rem; }
  .view-toggle button { padding: 5px 10px; font-size: 0.8rem; margin-left: 5px; }
}
</style>