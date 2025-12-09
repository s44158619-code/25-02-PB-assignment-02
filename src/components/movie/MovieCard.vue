<template>
  <div class="movie-card">
    <div class="poster-wrapper">
      <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />

      <button class="wish-btn" @click="$emit('toggle-wish', movie)">
        {{ isWished ? '❤️' : '🤍' }}
      </button>
    </div>
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { getImageUrl } from '@/api/tmdb';

// 1. Top-Down: 부모로부터 데이터를 받음 (Props)
const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  isWished: {
    type: Boolean,
    default: false
  }
});

// 2. Bottom-Up: 부모에게 이벤트를 발신함 (Emits)
const emit = defineEmits(['toggle-wish']);
</script>

<style scoped>
.movie-card {
  transition: transform 0.3s;
  position: relative;
}
.movie-card:hover { transform: scale(1.05); }

.poster-wrapper { position: relative; }
img { width: 100%; border-radius: 4px; aspect-ratio: 2/3; object-fit: cover; }

.wish-btn {
  position: absolute;
  top: 5px; right: 5px;
  background: rgba(0,0,0,0.6);
  border: none;
  border-radius: 50%;
  width: 30px; height: 30px;
  cursor: pointer;
  font-size: 16px;
}
.movie-info h3 {
  font-size: 0.9rem; margin-top: 5px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
</style>