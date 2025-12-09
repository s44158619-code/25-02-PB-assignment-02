<template>
  <div class="search-container">
    <div class="search-header">
      <h1>찾아보기</h1>

      <div class="search-bar">
        <input
            v-model="keyword"
            @keyup.enter="handleSearch"
            placeholder="영화 제목을 입력해보세요"
            type="text"
        />
        <button @click="handleSearch" class="search-btn">🔍</button>
      </div>

      <div v-if="searchHistory.length > 0" class="history-container">
        <span class="history-label">최근 검색어:</span>
        <div class="history-tags">
          <span
              v-for="(tag, index) in searchHistory"
              :key="index"
              class="history-tag"
              @click="clickTag(tag)"
          >
            {{ tag }}
            <button @click.stop="removeTag(index)" class="tag-close">×</button>
          </span>
        </div>
        <button @click="clearHistory" class="history-clear">전체 삭제</button>
      </div>

      <div class="filters">
        <select v-model="selectedGenre">
          <option value="">모든 장르</option>
          <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
        </select>
        <select v-model="minRating">
          <option value="0">모든 평점</option>
          <option value="5">5점 이상</option>
          <option value="7">7점 이상</option>
          <option value="9">9점 이상</option>
        </select>
        <select v-model="sortBy">
          <option value="popularity">인기순</option>
          <option value="vote">평점 높은순</option>
          <option value="date">최신순</option>
        </select>
        <button @click="resetFilters" class="reset-btn">🔄 초기화</button>
      </div>
    </div>

    <div v-if="loading" class="loading">검색 중입니다...</div>
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
      <p>검색 결과가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchPopularMovies, searchMovies, fetchGenres } from '@/api/tmdb';
import MovieCard from '@/components/movie/MovieCard.vue'; // 카드 재사용
import { useWishlist } from '@/composables/useWishlist'; // 찜 기능 재사용

const { isWished, toggleWishlist } = useWishlist();

const keyword = ref('');
const movies = ref([]);
const genres = ref([]);
const loading = ref(false);
const searchHistory = ref([]); // 검색어 저장용

// 필터 상태
const selectedGenre = ref('');
const minRating = ref('0');
const sortBy = ref('popularity');

// 🌟 검색어 로드
const loadHistory = () => {
  const stored = localStorage.getItem('searchHistory');
  searchHistory.value = stored ? JSON.parse(stored) : [];
};

// 🌟 검색 실행 (저장 로직 추가)
const handleSearch = async () => {
  if (!keyword.value.trim()) return;

  // 검색어 저장 (중복 제거 & 최신순)
  const term = keyword.value.trim();
  searchHistory.value = searchHistory.value.filter(t => t !== term);
  searchHistory.value.unshift(term);
  if (searchHistory.value.length > 5) searchHistory.value.pop(); // 최대 5개 유지
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));

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

// 태그 클릭 검색
const clickTag = (tag) => {
  keyword.value = tag;
  handleSearch();
};

// 태그 삭제
const removeTag = (index) => {
  searchHistory.value.splice(index, 1);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
};

// 전체 삭제
const clearHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
};

const finalMovies = computed(() => {
  let result = [...movies.value];
  if (selectedGenre.value) result = result.filter(m => m.genre_ids.includes(Number(selectedGenre.value)));
  if (minRating.value > 0) result = result.filter(m => m.vote_average >= Number(minRating.value));

  if (sortBy.value === 'vote') result.sort((a, b) => b.vote_average - a.vote_average);
  else if (sortBy.value === 'date') result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  else result.sort((a, b) => b.popularity - a.popularity);

  return result;
});

const resetFilters = () => {
  keyword.value = '';
  selectedGenre.value = '';
  minRating.value = '0';
  sortBy.value = 'popularity';
};

onMounted(async () => {
  loadHistory();
  const genreRes = await fetchGenres();
  genres.value = genreRes.data.genres;
  const popRes = await fetchPopularMovies();
  movies.value = popRes.data.results;
});
</script>

<style scoped>
.search-container { padding: 100px 4% 50px; color: white; min-height: 100vh; }
.search-header { margin-bottom: 30px; text-align: center; }
.search-bar { display: flex; justify-content: center; margin-bottom: 15px; }
.search-bar input { width: 100%; max-width: 500px; padding: 15px; border-radius: 4px 0 0 4px; border: none; font-size: 1.1rem; }
.search-btn { padding: 0 20px; background: #E50914; border: none; border-radius: 0 4px 4px 0; cursor: pointer; font-size: 1.2rem; color: white; }

/* 검색어 태그 스타일 */
.history-container { display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.history-label { color: #888; font-size: 0.9rem; }
.history-tag { background: #333; padding: 5px 10px; border-radius: 20px; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background 0.2s; }
.history-tag:hover { background: #555; }
.tag-close { background: none; border: none; color: #aaa; cursor: pointer; font-size: 1rem; }
.history-clear { background: none; border: none; color: #E50914; font-size: 0.8rem; cursor: pointer; text-decoration: underline; }

.filters { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
select { padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; }
.reset-btn { padding: 8px 15px; background: transparent; border: 1px solid #777; color: #ccc; border-radius: 4px; cursor: pointer; }
.movie-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
.loading, .no-result { text-align: center; margin-top: 50px; color: #777; }
</style>