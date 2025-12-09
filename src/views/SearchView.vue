<template>
  <div class="search-container">
    <div class="search-header">
      <h1>찾아보기</h1>

      <div class="search-bar">
        <input
            v-model="keyword"
            @keyup.enter="handleSearch"
            placeholder="영화 제목을 입력해보세요 (예: 해리포터)"
            type="text"
        />
        <button @click="handleSearch" class="search-btn">🔍</button>
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
      <div v-for="movie in finalMovies" :key="movie.id" class="movie-card">
        <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <div class="meta">
            <span class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
            <span class="date">{{ movie.release_date?.split('-')[0] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-result">
      <p>검색 결과가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchPopularMovies, searchMovies, fetchGenres, getImageUrl } from '@/api/tmdb';

// 상태 변수들
const keyword = ref('');
const movies = ref([]);
const genres = ref([]);
const loading = ref(false);

// 필터 변수들
const selectedGenre = ref('');
const minRating = ref('0');
const sortBy = ref('popularity');

// 1. 초기 데이터 로드 (장르 목록 & 기본 영화)
onMounted(async () => {
  // 장르 목록 가져오기
  try {
    const genreRes = await fetchGenres();
    genres.value = genreRes.data.genres;

    // 처음엔 인기 영화를 보여줌
    const popRes = await fetchPopularMovies();
    movies.value = popRes.data.results;
  } catch (e) {
    console.error(e);
  }
});

// 2. 검색 실행 함수
const handleSearch = async () => {
  if (!keyword.value.trim()) return;

  loading.value = true;
  try {
    const { data } = await searchMovies(keyword.value);
    movies.value = data.results;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// 3. 필터 및 정렬 로직 (computed로 자동 계산)
const finalMovies = computed(() => {
  let result = [...movies.value];

  // (1) 장르 필터링
  if (selectedGenre.value) {
    result = result.filter(m => m.genre_ids.includes(Number(selectedGenre.value)));
  }

  // (2) 평점 필터링
  if (minRating.value > 0) {
    result = result.filter(m => m.vote_average >= Number(minRating.value));
  }

  // (3) 정렬
  if (sortBy.value === 'vote') {
    result.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sortBy.value === 'date') {
    result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  } else {
    // 기본: 인기순 (popularity)
    result.sort((a, b) => b.popularity - a.popularity);
  }

  return result;
});

// 4. 초기화 버튼
const resetFilters = () => {
  keyword.value = '';
  selectedGenre.value = '';
  minRating.value = '0';
  sortBy.value = 'popularity';
  handleSearch(); // 다시 인기 영화 로드하려면 별도 로직 필요하지만, 일단 검색어만 초기화
};
</script>

<style scoped>
.search-container {
  padding: 100px 4% 50px;
  color: white;
  min-height: 100vh;
}

.search-header {
  margin-bottom: 30px;
  text-align: center;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  max-width: 500px;
  padding: 15px;
  border-radius: 4px 0 0 4px;
  border: none;
  font-size: 1.1rem;
}

.search-btn {
  padding: 0 20px;
  background: #E50914;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 1.2rem;
  color: white;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

select {
  padding: 10px;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
}

.reset-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #777;
  color: #ccc;
  border-radius: 4px;
  cursor: pointer;
}
.reset-btn:hover { background: #444; color: white; }

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.movie-card {
  background: #222;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s;
}
.movie-card:hover { transform: scale(1.05); }

.movie-card img {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.movie-info { padding: 10px; }
.movie-info h3 { font-size: 0.9rem; margin: 0 0 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.meta { display: flex; justify-content: space-between; font-size: 0.8rem; color: #aaa; }
.rating { color: #ffd700; }

.loading, .no-result { text-align: center; margin-top: 50px; font-size: 1.2rem; color: #777; }
</style>