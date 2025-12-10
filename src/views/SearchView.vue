<template>
  <div class="search-container">
    <div class="search-header">
      <h1><i class="fas fa-search"></i> 찾아보기</h1>

      <div class="search-bar">
        <div class="input-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
              v-model="keyword"
              @keyup.enter="handleSearch"
              placeholder="영화 제목, 인물, 장르를 검색해보세요"
              type="text"
          />
          <button v-if="keyword" @click="clearKeyword" class="clear-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div v-if="searchHistory.length > 0" class="history-container">
        <span class="history-label">최근 검색:</span>
        <div class="history-tags">
          <span
              v-for="(tag, index) in searchHistory"
              :key="index"
              class="history-tag"
              @click="clickTag(tag)"
          >
            {{ tag }}
            <button @click.stop="removeTag(index)" class="tag-close">
              <i class="fas fa-times"></i>
            </button>
          </span>
        </div>
        <button @click="clearHistory" class="history-clear">전체 삭제</button>
      </div>

      <div class="filters-container">
        <div class="filters">
          <div class="select-wrapper">
            <i class="fas fa-film select-icon"></i>
            <select v-model="selectedGenre">
              <option value="">모든 장르</option>
              <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </div>

          <div class="select-wrapper">
            <i class="fas fa-star select-icon"></i>
            <select v-model="minRating">
              <option value="0">모든 평점</option>
              <option value="5">5점 이상</option>
              <option value="7">7점 이상</option>
              <option value="8">8점 이상</option>
              <option value="9">9점 이상</option>
            </select>
          </div>

          <div class="select-wrapper">
            <i class="fas fa-sort select-icon"></i>
            <select v-model="sortBy">
              <option value="popularity">인기순</option>
              <option value="vote">평점 높은순</option>
              <option value="date">최신순</option>
            </select>
          </div>
        </div>

        <button @click="resetFilters" class="reset-btn" title="필터 초기화">
          <i class="fas fa-undo"></i> 초기화
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-skeleton">
      <div class="skeleton-card" v-for="n in 10" :key="n"></div>
    </div>

    <div v-else-if="finalMovies.length > 0" class="movie-grid">
      <MovieCard
          v-for="movie in finalMovies"
          :key="movie.id"
          :movie="movie"
          :isWished="isWished(movie)"
          @toggle-wish="toggleWishlist"
      />
    </div>

    <div v-else class="no-result">
      <i class="fas fa-video-slash"></i>
      <p>검색 결과가 없습니다.</p>
      <button @click="resetFilters" class="retry-btn">필터 초기화하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchPopularMovies, searchMovies, fetchGenres } from '@/api/tmdb';
import MovieCard from '@/components/movie/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist';

const { isWished, toggleWishlist, loadWishlist } = useWishlist();

// 상태 변수
const keyword = ref('');
const movies = ref([]);
const genres = ref([]);
const loading = ref(false);
const searchHistory = ref([]);

// 필터 상태 변수
const selectedGenre = ref('');
const minRating = ref('0');
const sortBy = ref('popularity');

// 초기 데이터 로드
onMounted(async () => {
  loadWishlist();
  loadHistory();

  try {
    loading.value = true;
    // 1. 장르 목록 가져오기 (필터용)
    const genreRes = await fetchGenres();
    genres.value = genreRes.data.genres;

    // 2. 처음엔 인기 영화를 보여줌 (빈 화면 방지)
    const popRes = await fetchPopularMovies();
    movies.value = popRes.data.results;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

// 검색 실행
const handleSearch = async () => {
  if (!keyword.value.trim()) return;

  // 검색어 저장
  const term = keyword.value.trim();
  saveHistory(term);

  loading.value = true;
  try {
    const { data } = await searchMovies(term);
    movies.value = data.results;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// 검색어 저장 및 관리 로직
const saveHistory = (term) => {
  searchHistory.value = searchHistory.value.filter(t => t !== term); // 중복 제거
  searchHistory.value.unshift(term); // 앞에 추가
  if (searchHistory.value.length > 5) searchHistory.value.pop(); // 최대 5개 유지
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
};

const loadHistory = () => {
  const stored = localStorage.getItem('searchHistory');
  searchHistory.value = stored ? JSON.parse(stored) : [];
};

const clickTag = (tag) => {
  keyword.value = tag;
  handleSearch();
};

const removeTag = (index) => {
  searchHistory.value.splice(index, 1);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
};

const clearHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
};

const clearKeyword = () => {
  keyword.value = '';
  // 검색어 지우면 다시 인기 영화 로드
  fetchPopularMovies().then(res => movies.value = res.data.results);
};

// 🌟 [핵심] 클라이언트 사이드 필터링 & 정렬 (Computed)
// 받아온 response 데이터를 map/filter 함수를 써서 구현하는 방식 적용
const finalMovies = computed(() => {
  let result = [...movies.value];

  // 1. 장르 필터
  if (selectedGenre.value) {
    result = result.filter(m => m.genre_ids.includes(Number(selectedGenre.value)));
  }

  // 2. 평점 필터
  if (minRating.value > 0) {
    result = result.filter(m => m.vote_average >= Number(minRating.value));
  }

  // 3. 정렬 (Sorting)
  if (sortBy.value === 'vote') {
    result.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sortBy.value === 'date') {
    result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  } else {
    // 기본: 인기순
    result.sort((a, b) => b.popularity - a.popularity);
  }

  return result;
});

// 필터 초기화 버튼 동작
const resetFilters = () => {
  selectedGenre.value = '';
  minRating.value = '0';
  sortBy.value = 'popularity';
};
</script>

<style scoped>
.search-container { padding: 100px 4% 50px; color: white; min-height: 100vh; background-color: #141414; }
.search-header { margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
h1 { font-size: 2rem; font-weight: bold; display: flex; align-items: center; gap: 10px; }

/* 🌟 검색창 스타일 */
.search-bar { width: 100%; display: flex; justify-content: center; }
.input-wrapper {
  position: relative; width: 100%; max-width: 600px;
}
.search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #aaa; font-size: 1.2rem; }
.input-wrapper input {
  width: 100%; height: 50px; padding: 10px 45px; /* 아이콘 공간 확보 */
  background: #333; border: 1px solid #444; border-radius: 4px; color: white; font-size: 1.1rem;
  transition: all 0.3s;
}
.input-wrapper input:focus { outline: none; border-color: #E50914; background: #000; }
.clear-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #aaa; cursor: pointer; font-size: 1.1rem;
}
.clear-btn:hover { color: white; }

/* 최근 검색어 */
.history-container { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 800px; }
.history-label { color: #888; font-size: 0.9rem; }
.history-tag {
  background: rgba(255, 255, 255, 0.1); padding: 5px 12px; border-radius: 20px; font-size: 0.9rem;
  cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s;
}
.history-tag:hover { background: rgba(255, 255, 255, 0.2); }
.tag-close { background: none; border: none; color: #aaa; cursor: pointer; }
.tag-close:hover { color: #E50914; }
.history-clear { background: none; border: none; color: #E50914; font-size: 0.85rem; cursor: pointer; text-decoration: underline; }

/* 🌟 필터 섹션 */
.filters-container {
  display: flex; gap: 15px; align-items: center; flex-wrap: wrap; justify-content: center; margin-top: 10px;
}
.filters { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }

.select-wrapper { position: relative; }
.select-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; font-size: 0.9rem; }
select {
  padding: 10px 15px 10px 30px; /* 아이콘 공간 */
  background: black; color: white; border: 1px solid #555; border-radius: 4px;
  cursor: pointer; appearance: none; font-size: 0.9rem;
}
select:hover { border-color: white; }
select:focus { outline: none; border-color: #E50914; }

.reset-btn {
  padding: 10px 15px; background: transparent; border: 1px solid #777; color: #ccc;
  border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.2s;
}
.reset-btn:hover { border-color: white; color: white; background: rgba(255,255,255,0.1); }

/* 영화 그리드 */
.movie-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }

/* 로딩 스켈레톤 */
.loading-skeleton { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
.skeleton-card {
  width: 160px; height: 240px; background: #333; border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}
@keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; } }

/* 결과 없음 */
.no-result {
  text-align: center; margin-top: 50px; color: #777; display: flex; flex-direction: column; align-items: center; gap: 15px;
}
.no-result i { font-size: 3rem; margin-bottom: 10px; }
.retry-btn {
  padding: 10px 20px; background: #E50914; color: white; border: none; border-radius: 4px; cursor: pointer;
}
.retry-btn:hover { background: #f40612; }
</style>