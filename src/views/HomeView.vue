<template>
  <div class="home">
    <header class="banner" v-if="bannerMovie"
            :style="{ backgroundImage: `url(${getImageUrl(bannerMovie.backdrop_path, 'original')})` }"
    >
      <div class="banner-contents">
        <h1 class="banner-title">{{ bannerMovie.title }}</h1>
        <div class="banner-buttons">
          <button class="banner-button play">▶ 재생</button>
          <button class="banner-button info">상세 정보</button>
        </div>
        <h1 class="banner-description">{{ truncate(bannerMovie.overview, 150) }}</h1>
      </div>
      <div class="banner--fadeBottom"></div>
    </header>

    <div class="row">
      <h2>지금 뜨는 콘텐츠</h2>
      <div class="row-posters">
        <div
            v-for="movie in movies"
            :key="movie.id"
            class="poster-wrapper"
        >
          <img
              :src="getImageUrl(movie.poster_path)"
              :alt="movie.title"
              class="row-poster"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchPopularMovies, getImageUrl } from '@/api/tmdb';

const movies = ref([]);
const bannerMovie = ref(null);

// 글자가 너무 길면 ...으로 자르는 함수
const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

onMounted(async () => {
  try {
    const { data } = await fetchPopularMovies();
    movies.value = data.results;
    // 첫 번째 영화를 배너로 당첨!
    bannerMovie.value = data.results[0];
  } catch (error) {
    console.error("영화 로딩 실패:", error);
  }
});
</script>

<style scoped>
/* 전체 페이지 스타일 */
.home {
  background-color: #111;
  min-height: 100vh;
  color: white;
}

/* 배너 스타일 */
.banner {
  color: white;
  object-fit: contain;
  height: 448px;
  background-size: cover;
  background-position: center top;
  position: relative;
}

.banner-contents {
  margin-left: 30px;
  padding-top: 140px;
  height: 190px;
}

.banner-title {
  font-size: 3rem;
  font-weight: 800;
  padding-bottom: 0.3rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
}

.banner-description {
  width: 45rem;
  line-height: 1.3;
  padding-top: 1rem;
  font-size: 0.8rem;
  max-width: 360px;
  height: 80px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
}

.banner-button {
  cursor: pointer;
  color: #fff;
  outline: none;
  border: none;
  font-weight: 700;
  border-radius: 0.2vw;
  padding-left: 2rem;
  padding-right: 2rem;
  margin-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: rgba(51, 51, 51, 0.5);
}
.banner-button:hover {
  color: #000;
  background-color: #e6e6e6;
  transition: all 0.2s;
}

.banner--fadeBottom {
  height: 7.4rem;
  background-image: linear-gradient(180deg, transparent, rgba(17, 17, 17, 0.61), #111);
  position: absolute;
  bottom: 0;
  width: 100%;
}

/* 포스터 리스트 스타일 */
.row {
  margin-left: 20px;
  margin-top: 20px;
}

.row h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.row-posters {
  display: flex;
  overflow-y: hidden;
  overflow-x: scroll;
  padding: 20px;
}

.row-posters::-webkit-scrollbar {
  display: none; /* 스크롤바 숨김 */
}

.row-poster {
  object-fit: contain;
  width: 100%;
  max-height: 250px;
  margin-right: 10px;
  transition: transform 450ms;
  border-radius: 4px;
  cursor: pointer;
}

.row-poster:hover {
  transform: scale(1.08); /* 호버 시 확대 효과 */
}
</style>