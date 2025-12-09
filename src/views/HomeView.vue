// src/views/HomeView.vue 의 <script setup> 부분
import { ref, onMounted } from 'vue';
import { fetchPopularMovies, getImageUrl } from '@/api/tmdb';
import MovieCard from '@/components/movie/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist'; // 👇 Custom Hook 불러오기

const movies = ref([]);
const bannerMovie = ref(null);

// Custom Hook에서 기능 꺼내 쓰기 (한 줄로 끝!)
const { isWished, toggleWishlist, loadWishlist } = useWishlist();

const truncate = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

onMounted(async () => {
  loadWishlist(); // 찜 목록 초기화
  try {
    const { data } = await fetchPopularMovies();
    movies.value = data.results;
    bannerMovie.value = data.results[0];
  } catch (error) {
    console.error(error);
  }
});