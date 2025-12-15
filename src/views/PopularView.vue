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
        <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="page-btn"
        >
          <i class="fas fa-chevron-left"></i> 이전
        </button>
        <span class="page-info">{{ currentPage }} 페이지</span>
        <button
            @click="changePage(currentPage + 1)"
            class="page-btn"
        >
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
        <div class="skeleton-card" v-for="n in 4" :key="n"></div>
      </div>

      <button
          v-show="showTopBtn"
          @click="scrollToTop"
          class="top-btn"
          title="맨 위로"
      >
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
const movies = ref([]); // 테이블용 데이터
const infiniteMovies = ref([]); // 무한스크롤용 데이터
const currentPage = ref(1);
const infinitePage = ref(1);
const isLoading = ref(false);
const showTopBtn = ref(false);

const { isWished, toggleWishlist, loadWishlist } = useWishlist();

// 테이블 뷰 데이터 로드
const loadTableData = async (page) => {
  isLoading.value = true;
  try {
    const { data } = await fetchPopularMovies(page);
    movies.value = data.results;
    currentPage.value = page;
    window.scrollTo(0, 0);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// 무한 스크롤 데이터 추가
const loadMoreData = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const { data } = await fetchPopularMovies(infinitePage.value);
    const newMovies = data.results.filter(
        newM => !infiniteMovies.value.some(existing => existing.id === newM.id)
    );
    infiniteMovies.value.push(...newMovies);
    infinitePage.value++;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const changeViewMode = (mode) => {
  viewMode.value = mode;
  // 무한스크롤 처음 켜면 데이터 로드
  if (mode === 'infinite' && infiniteMovies.value.length === 0) {
    loadMoreData();
  }
};

const changePage = (page) => {
  if (page > 0) loadTableData(page);
};

const handleScroll = () => {
  showTopBtn.value = window.scrollY > 500;

  if (viewMode.value === 'infinite') {
    // 바닥에 닿기 전 미리 로딩
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      loadMoreData();
    }
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  loadWishlist();
  loadTableData(1);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.popular-container {
  padding: 100px 4% 50px;
  color: white;
  min-height: 100vh;
}

.header-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

/* 토글 버튼 스타일 */
.view-toggle button {
  background: transparent;
  border: 1px solid #aaa;
  color: #aaa;
  padding: 8px 16px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.view-toggle button.active {
  background: #E50914;
  border-color: #E50914;
  color: white;
  font-weight: bold;
}

/* 🌟 그리드 레이아웃 (PC 기본 설정) */
.movie-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  gap: 20px;
}

.page-btn {
  background: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { font-size: 1.1rem; font-weight: bold; }

/* Top 버튼 */
.top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #E50914;
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  z-index: 99;
}

/* 스켈레톤 로딩 */
.loading-skeleton {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}
.skeleton-card {
  width: 160px; height: 240px;
  background: #333;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 0.7; }
  100% { opacity: 0.4; }
}

/* 📱 [모바일 최적화 - 핵심 변경 사항] */
@media (max-width: 768px) {
  .popular-container {
    /* 1. 왼쪽 잘림 방지: 좌우 여백을 20px로 넉넉하게 확보 */
    padding: 90px 20px 50px;
  }

  .header-control {
    justify-content: center; /* 제목과 버튼 가운데 정렬 */
    gap: 10px;
  }

  /* 2. 모바일에서는 강제로 'Grid'로 변경하고 '2열'로 고정 */
  .movie-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important; /* 한 줄에 2개씩 */
    gap: 15px; /* 카드 사이 간격 */
    justify-items: center; /* 카드 중앙 정렬 */
  }

  /* 스켈레톤도 2열에 맞춤 */
  .skeleton-card {
    width: 100%;
    height: 220px;
  }

  h1 { font-size: 1.5rem; width: 100%; text-align: center; }
  .view-toggle { width: 100%; display: flex; justify-content: center; }
  .view-toggle button { padding: 6px 12px; font-size: 0.85rem; margin: 0 5px; }
}
</style>