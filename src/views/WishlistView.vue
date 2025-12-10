<template>
  <div class="wishlist-container">
    <div class="wishlist-header">
      <h1><i class="fas fa-heart"></i> 내가 찜한 리스트</h1>
    </div>

    <div v-if="wishlist.length > 0" class="movie-grid">
      <TransitionGroup name="list">
        <MovieCard
            v-for="movie in wishlist"
            :key="movie.id"
            :movie="movie"
            :isWished="true"
            @toggle-wish="toggleWishlist"
        />
      </TransitionGroup>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="far fa-heart"></i>
      </div>
      <p>아직 찜한 콘텐츠가 없어요.</p>
      <button @click="$router.push('/')" class="go-home-btn">
        콘텐츠 구경하러 가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import MovieCard from '@/components/movie/MovieCard.vue';
import { useWishlist } from '@/composables/useWishlist';

// API 호출 없음! 오직 로컬 스토리지 관리 훅만 사용
const { wishlist, loadWishlist, toggleWishlist } = useWishlist();

onMounted(() => {
  loadWishlist(); // 로컬 스토리지에서 데이터 동기화
});
</script>

<style scoped>
.wishlist-container {
  padding: 100px 4% 50px;
  color: white;
  min-height: 100vh;
  background-color: #141414;
}

.wishlist-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
}

h1 {
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}
h1 i { color: #E50914; }

/* 🌟 반응형 그리드 레이아웃 (Table View 효과) */
.movie-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start; /* 왼쪽 정렬 */
}

/* 🌟 삭제 시 부드럽게 사라지는 애니메이션 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute; /* 삭제될 때 레이아웃 붕괴 방지 */
}

/* 빈 화면 스타일 (Fancy) */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  color: #777;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

.empty-state p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.go-home-btn {
  padding: 12px 25px;
  background-color: #E50914;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}
.go-home-btn:hover {
  background-color: #f40612;
}

/* 둥둥 떠다니는 애니메이션 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .movie-grid {
    justify-content: center; /* 모바일은 가운데 정렬 */
  }
}
</style>