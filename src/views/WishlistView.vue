<template>
  <div class="wishlist-container">
    <h1>내가 찜한 콘텐츠</h1>

    <div v-if="wishlist.length > 0" class="movie-grid">
      <div v-for="movie in wishlist" :key="movie.id" class="movie-card">
        <div class="poster-wrapper">
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
          <button @click="removeMovie(movie.id)" class="remove-btn">❌ 삭제</button>
        </div>
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>아직 찜한 콘텐츠가 없어요. 😢</p>
      <button @click="$router.push('/')" class="go-home-btn">콘텐츠 구경하러 가기</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { getImageUrl } from '@/api/tmdb';
import { useWishlist } from '@/composables/useWishlist';

// Custom Hook에서 필요한 것만 꺼내 쓰기
const { wishlist, loadWishlist, removeMovie } = useWishlist();

onMounted(() => {
  loadWishlist();
});
</script>

<style scoped>
.wishlist-container {
  padding: 100px 4% 50px;
  color: white;
  min-height: 100vh;
}

h1 { margin-bottom: 30px; }

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.movie-card {
  position: relative;
  transition: transform 0.3s;
}

.movie-card:hover { transform: scale(1.05); }

.poster-wrapper { position: relative; }

.movie-card img {
  width: 100%;
  border-radius: 4px;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: none;
}

.movie-card:hover .remove-btn { display: block; }

.movie-info h3 {
  font-size: 0.9rem;
  margin-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  text-align: center;
  margin-top: 100px;
  color: #777;
}

.go-home-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #E50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
</style>