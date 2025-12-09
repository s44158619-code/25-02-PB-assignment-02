<template>
  <div class="home">
    <header class="banner" v-if="bannerMovie" :style="{ backgroundImage: `url(${getImageUrl(bannerMovie.backdrop_path, 'original')})` }">
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
        <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            :isWished="checkIsWished(movie.id)"
            @toggle-wish="handleWishlist"
            class="poster-wrapper"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchPopularMovies, getImageUrl } from '@/api/tmdb';
import MovieCard from '@/components/movie/MovieCard.vue'; // 자식 컴포넌트 import

const movies = ref([]);
const bannerMovie = ref(null);
const myWishlist = ref([]);

// 찜 목록 로컬에서 불러오기
const loadWishlist = () => {
  myWishlist.value = JSON.parse(localStorage.getItem('myWishlist') || '[]');
};

// 찜 여부 확인 (Top-Down용)
const checkIsWished = (id) => {
  return myWishlist.value.some(m => m.id === id);
};

// 찜하기 처리 (Bottom-Up 이벤트 핸들러)
const handleWishlist = (movie) => {
  const index = myWishlist.value.findIndex(m => m.id === movie.id);
  if (index === -1) {
    myWishlist.value.push(movie);
    alert('찜 목록에 추가! 💖');
  } else {
    myWishlist.value.splice(index, 1);
    alert('찜 목록에서 삭제! 💔');
  }
  localStorage.setItem('myWishlist', JSON.stringify(myWishlist.value));
};

const truncate = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

onMounted(async () => {
  loadWishlist();
  try {
    const { data } = await fetchPopularMovies();
    movies.value = data.results;
    bannerMovie.value = data.results[0];
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
/* 기존 스타일 유지 (banner 등) */
.home { background-color: #111; min-height: 100vh; color: white; }
.banner { height: 448px; background-size: cover; background-position: center top; position: relative; color: white; }
.banner-contents { margin-left: 30px; padding-top: 140px; height: 190px; }
.banner-title { font-size: 3rem; font-weight: 800; padding-bottom: 0.3rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.6); }
.banner-description { width: 45rem; line-height: 1.3; padding-top: 1rem; font-size: 0.8rem; max-width: 360px; height: 80px; text-shadow: 1px 1px 2px rgba(0,0,0,0.6); }
.banner-button { cursor: pointer; color: #fff; outline: none; border: none; font-weight: 700; border-radius: 0.2vw; padding-left: 2rem; padding-right: 2rem; margin-right: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; background-color: rgba(51, 51, 51, 0.5); }
.banner-button:hover { color: #000; background-color: #e6e6e6; transition: all 0.2s; }
.banner--fadeBottom { height: 7.4rem; background-image: linear-gradient(180deg, transparent, rgba(17, 17, 17, 0.61), #111); position: absolute; bottom: 0; width: 100%; }
.row { margin-left: 20px; margin-top: 20px; }
.row h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; }
.row-posters { display: flex; overflow-y: hidden; overflow-x: scroll; padding: 20px; gap: 10px; }
.row-posters::-webkit-scrollbar { display: none; }
</style>