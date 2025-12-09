<template>
  <div class="popular-container">
    <div class="header-control">
      <h1>대세 콘텐츠</h1>
      <div class="view-toggle">
        <button
            :class="{ active: viewMode === 'table' }"
            @click="changeViewMode('table')"
        >
          📋 테이블 뷰
        </button>
        <button
            :class="{ active: viewMode === 'infinite' }"
            @click="changeViewMode('infinite')"
        >
          📜 무한 스크롤
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'table'" class="table-view">
      <div class="movie-grid">
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" loading="lazy" />
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <p>⭐ {{ movie.vote_average }}</p>
          </div>
        </div>
      </div>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>
        <span>Page {{ currentPage }}</span>
        <button @click="changePage(currentPage + 1)">다음</button>
      </div>
    </div>

    <div v-else class="infinite-view">
      <div class="movie-grid">
        <div v-for="movie in infiniteMovies" :key="`inf-${movie.id}`" class="movie-card">
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
          </div>
        </div>
      </div>
      <div ref="loadingTrigger" class="loading-trigger">
        <p v-if="isLoading">열심히 불러오는 중... 🏃‍♂️</p>
      </div>
      <button v-show="showTopBtn" @click="scrollToTop" class="top-btn">⬆ TOP</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { fetchPopularMovies, getImageUrl } from '@/api/tmdb';

// 상태 관리
const viewMode = ref('table'); // 'table' 또는 'infinite'
const movies = ref([]);        // 테이블 뷰용 데이터 (한 페이지만)
const infiniteMovies = ref([]); // 무한 스크롤용 데이터 (계속 쌓임)
const currentPage = ref(1);    // 테이블 뷰 현재 페이지
const infinitePage = ref(1);   // 무한 스크롤 현재 페이지
const isLoading = ref(false);
const showTopBtn = ref(false);
const loadingTrigger = ref(null); // 무한 스크롤 감지용 요소

// 데이터 불러오기 (테이블 뷰)
const loadTableData = async (page) => {
  isLoading.value = true;
  try {
    const { data } = await fetchPopularMovies(page);
    movies.value = data.results;
    currentPage.value = page;
    window.scrollTo(0, 0); // 페이지 바뀌면 맨 위로
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// 데이터 더 불러오기 (무한 스크롤)
const loadMoreData = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const { data } = await fetchPopularMovies(infinitePage.value);
    infiniteMovies.value.push(...data.results); // 기존 리스트에 추가
    infinitePage.value++;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// 뷰 모드 변경
const changeViewMode = (mode) => {
  viewMode.value = mode;
  if (mode === 'infinite' && infiniteMovies.value.length === 0) {
    loadMoreData(); // 처음 전환 시 데이터 로드
  }
};

// 페이지 변경 (테이블 뷰)
const changePage = (page) => {
  if (page < 1) return;
  loadTableData(page);
};

// 스크롤 감지 (무한 스크롤 & Top 버튼)
const handleScroll = () => {
  showTopBtn.value = window.scrollY > 300;

  if (viewMode.value !== 'infinite') return;

  // 화면 바닥에 닿았는지 체크
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
    loadMoreData();
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  loadTableData(1); // 초기 데이터 로드
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
}

.view-toggle button {
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 8px 16px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.view-toggle button.active {
  background: #E50914;
  border-color: #E50914;
  font-weight: bold;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 반응형 그리드 */
  gap: 20px;
}

.movie-card {
  background-color: #2f2f2f;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.movie-info {
  padding: 10px;
}

.movie-info h3 {
  font-size: 1rem;
  margin: 0 0 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 페이지네이션 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  gap: 20px;
}

.pagination button {
  background: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  z-index: 99;
}
.loading-trigger {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
}
</style>