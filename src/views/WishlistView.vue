// src/views/WishlistView.vue 의 <script setup> 부분
import { onMounted } from 'vue';
import { getImageUrl } from '@/api/tmdb';
import { useWishlist } from '@/composables/useWishlist'; // 👇 불러오기

// 변수 선언할 필요도 없음! Hook 안에 다 있음
const { wishlist, loadWishlist, removeMovie } = useWishlist();

onMounted(() => {
  loadWishlist();
});