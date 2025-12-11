<template>
  <div class="home">

    <div v-if="isLoading" class="loading-skeleton">
      <div class="skeleton-banner"></div>
      <div class="skeleton-row-container" v-for="n in 3" :key="n">
        <div class="skeleton-title"></div>
        <div class="skeleton-posters">
          <div class="skeleton-poster" v-for="m in 6" :key="m"></div>
        </div>
      </div>
    </div>

    <div v-else>

      <div class="hero-slider">
        <div
            v-for="(movie, index) in bannerMovies"
            :key="movie.id"
            class="slide-item"
            :class="{ active: index === currentSlide }"
            :style="{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})` }"
        >
          <div class="banner-contents">
            <h1 class="banner-title">{{ movie.title }}</h1>

            <div class="banner-meta">
              <span class="meta-rating">⭐ {{ movie.vote_average?.toFixed(1) }}</span>
              <span class="meta-year" v-if="movie.release_date">
                {{ movie.release_date.split('-')[0] }}
              </span>
            </div>

            <div class="banner-buttons">
              <button class="banner-button play">▶ 재생</button>
              <button class="banner-button info" @click="toggleWishlist(movie)">
                {{ isWished(movie) ? '✓ 찜한 콘텐츠' : '+ 찜하기' }}
              </button>
            </div>

            <p class="banner-description">{{ truncate(movie.overview, 150) }}</p>
          </div>
          <div class="banner--fadeBottom"></div>
        </div>

        <div class="slider-indicators">
          <span
              v-for="(movie, index) in bannerMovies"
              :key="index"
              class="indicator-dot"
              :class="{ active: index === currentSlide }"
              @click="setSlide(index)"
          ></span>
        </div>
      </div>

      <div class="rows-container">

        <div class="row">
          <h2>🔥 지금 뜨는 콘텐츠</h2>
          <div class="row-slider-container">
            <button class="slider-arrow left" @click="scrollRow('left', $event)"><i class="fas fa-chevron-left"></i></button>
            <div class="row-posters">
              <MovieCard v-for="movie in popularMovies" :key="movie.id" :movie="movie"
                         :isWished="isWished(movie)" @toggle-wish="toggleWishlist" />
            </div>
            <button class="slider-arrow right" @click="scrollRow('right', $event)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <div class="row">
          <h2>🎬 최신 상영작</h2>
          <div class="row-slider-container">
            <button class="slider-arrow left" @click="scrollRow('left', $event)"><i class="fas fa-chevron-left"></i></button>
            <div class="row-posters">
              <MovieCard v-for="movie in nowPlayingMovies" :key="movie.id" :movie="movie"
                         :isWished="isWished(movie)" @toggle-wish="toggleWishlist" />
            </div>
            <button class="slider-arrow right" @click="scrollRow('right', $event)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <div class="row">
          <h2>⭐ 평론가 호평 영화</h2>
          <div class="row-slider-container">
            <button class="slider-arrow left" @click="scrollRow('left', $event)"><i class="fas fa-chevron-left"></i></button>
            <div class="row-posters">
              <MovieCard v-for="movie in topRatedMovies" :key="movie.id" :movie="movie"
                         :isWished="isWished(movie)" @toggle-wish="toggleWishlist" />
            </div>
            <button class="slider-arrow right" @click="scrollRow('right', $event)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <div class="row">
          <h2>💥 액션 영화</h2>
          <div class="row-slider-container">
            <button class="slider-arrow left" @click="scrollRow('left', $event)"><i class="fas fa-chevron-left"></i></button>
            <div class="row-posters">
              <MovieCard v-for="movie in actionMovies" :key="movie.id" :movie="movie"
                         :isWished="isWished(movie)" @toggle-wish="toggleWishlist" />
            </div>
            <button class="slider-arrow right" @click="scrollRow('right', $event)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { fetchPopularMovies, fetchNowPlaying, fetchTopRated, fetchActionMovies, getImageUrl } from '@/api/tmdb';
import MovieCard from '@/components/movie/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist';

const popularMovies = ref([]);
const nowPlayingMovies = ref([]);
const topRatedMovies = ref([]);
const actionMovies = ref([]);

// 🌟 슬라이더용 변수
const bannerMovies = ref([]); // 상단 배너에 쓸 영화 5개
const currentSlide = ref(0);
const slideInterval = ref(null);

const isLoading = ref(true);

const { isWished, toggleWishlist, loadWishlist } = useWishlist();
const truncate = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

// 가로 스크롤 함수
const scrollRow = (direction, event) => {
  const sliderContainer = event.target.closest('.row-slider-container');
  const rowPosters = sliderContainer.querySelector('.row-posters');
  if (rowPosters) {
    const scrollAmount = window.innerWidth * 0.7;
    rowPosters.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
};

// 🌟 슬라이드 타이머 로직
const startSlideTimer = () => {
  slideInterval.value = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % bannerMovies.value.length;
  }, 5000); // 5초마다 변경
};

const stopSlideTimer = () => {
  if (slideInterval.value) clearInterval(slideInterval.value);
};

const setSlide = (index) => {
  stopSlideTimer(); // 사용자가 클릭하면 타이머 잠깐 멈췄다가
  currentSlide.value = index;
  startSlideTimer(); // 다시 시작
};

onMounted(async () => {
  loadWishlist();
  isLoading.value = true;
  try {
    const [popRes, nowRes, topRes, actRes] = await Promise.all([
      fetchPopularMovies(), fetchNowPlaying(), fetchTopRated(), fetchActionMovies()
    ]);

    popularMovies.value = popRes.data.results;
    nowPlayingMovies.value = nowRes.data.results;
    topRatedMovies.value = topRes.data.results;
    actionMovies.value = actRes.data.results;

    // 🌟 인기 영화 중 상위 5개를 배너로 사용
    bannerMovies.value = popRes.data.results.slice(0, 5);

    // 슬라이드 시작
    startSlideTimer();

  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  stopSlideTimer(); // 페이지 나가면 타이머 종료
});
</script>

<style scoped>
.home { background-color: #141414; min-height: 100vh; color: white; padding-bottom: 50px; }

/* 🌟 히어로 슬라이더 컨테이너 */
.hero-slider {
  position: relative;
  width: 100%;
  height: 750px; /* 높이 넉넉하게 */
  overflow: hidden;
  background: black;
}

/* 개별 슬라이드 (겹쳐놓고 투명도만 조절) */
.slide-item {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-size: cover; background-position: center top;
  opacity: 0; /* 기본적으로 안 보임 */
  transition: opacity 1s ease-in-out; /* 부드러운 전환 효과 */
  z-index: 1;
}

.slide-item.active {
  opacity: 1; /* 활성화된 슬라이드만 보임 */
  z-index: 2;
}

.banner-contents {
  margin-left: 40px; padding-top: 250px;
  padding-bottom: 60px;
  position: relative; z-index: 10;
}
.banner-title {
  font-size: 3.5rem; font-weight: 800; padding-bottom: 0.3rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8); margin-bottom: 10px;
}
.banner-meta { display: flex; gap: 15px; margin-bottom: 15px; font-weight: bold; font-size: 1.2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }
.meta-rating { color: #46d369; }
.meta-year { color: #aaa; }
.banner-description {
  width: 45rem; line-height: 1.4; padding-top: 1rem;
  font-size: 1.1rem; max-width: 500px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8); color: #ddd;
}
.banner-buttons { margin-bottom: 15px; }
.banner-button {
  cursor: pointer; color: #fff; outline: none; border: none; font-weight: 700; border-radius: 4px; padding: 0.6rem 2.5rem; margin-right: 1rem; background-color: rgba(51, 51, 51, 0.7); font-size: 1.1rem; transition: all 0.2s;
}
.banner-button.play { background-color: white; color: black; }
.banner-button.play:hover { background-color: #c7c7c7; }
.banner-button.info:hover { background-color: rgba(255, 255, 255, 0.2); }

.banner--fadeBottom {
  height: 20rem;
  background-image: linear-gradient(180deg, transparent, rgba(20, 20, 20, 0.61), #141414);
  position: absolute; bottom: 0; width: 100%;
}

/* 🌟 슬라이더 인디케이터 (하단 점) */
.slider-indicators {
  position: absolute;
  bottom: 120px; /* 위치 조정 */
  right: 50px;
  display: flex;
  gap: 10px;
  z-index: 20;
}
.indicator-dot {
  width: 12px; height: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}
.indicator-dot.active {
  background: white;
  transform: scale(1.2);
}

/* 영화 목록 스타일 */
.rows-container { position: relative; z-index: 20; margin-top: -100px; padding-left: 20px; }
.row { margin-bottom: 40px; }
.row h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 15px; margin-left: 10px; color: #e5e5e5; }
.row-slider-container { position: relative; }
.slider-arrow {
  position: absolute; top: 0; bottom: 0; margin: auto;
  background: rgba(0, 0, 0, 0.5); color: white; border: none;
  width: 50px; height: 100%; font-size: 2.5rem; cursor: pointer;
  z-index: 50; opacity: 0.5; transition: all 0.3s;
  display: flex; align-items: center; justify-content: center;
}
.slider-arrow:hover { background: rgba(0, 0, 0, 0.8); color: #E50914; opacity: 1; transform: scale(1.1); }
.slider-arrow.left { left: 0; border-top-right-radius: 4px; border-bottom-right-radius: 4px; }
.slider-arrow.right { right: 0; border-top-left-radius: 4px; border-bottom-left-radius: 4px; }
.row-posters { display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; gap: 10px; padding: 10px 60px; scroll-behavior: smooth; }
.row-posters::-webkit-scrollbar { display: none; }
.row-posters { -ms-overflow-style: none; scrollbar-width: none; }

/* 스켈레톤 */
@keyframes pulse { 0% { opacity: 0.3; background: #333; } 50% { opacity: 0.5; background: #444; } 100% { opacity: 0.3; background: #333; } }
.loading-skeleton { padding: 0; width: 100%; overflow: hidden; }
.skeleton-banner { width: 100%; height: 750px; margin-bottom: 20px; animation: pulse 1.5s infinite; }
.skeleton-row-container { margin: 20px 0 40px 20px; }
.skeleton-title { width: 200px; height: 30px; margin-bottom: 15px; border-radius: 4px; animation: pulse 1.5s infinite; }
.skeleton-posters { display: flex; gap: 10px; overflow: hidden; padding: 0 60px; }
.skeleton-poster { width: 160px; height: 240px; border-radius: 4px; flex-shrink: 0; animation: pulse 1.5s infinite; }
</style>