<template>
  <div class="movie-card">
    <div class="poster-wrapper">
      <img
          :src="getImageUrl(movie.poster_path)"
          :alt="movie.title"
          loading="lazy"
          @click="$router.push(`/movie/${movie.id}`)"
      />
      <div class="wish-indicator" @click.stop="$emit('toggle-wish', movie)">
        {{ isWished ? '❤️' : '🤍' }}
      </div>
    </div>
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { getImageUrl } from '@/api/tmdb';

const props = defineProps({
  movie: { type: Object, required: true },
  isWished: { type: Boolean, default: false }
});

const emit = defineEmits(['toggle-wish']);
</script>

<style scoped>
/* 🌟 카드 크기 고정 (중요!) */
.movie-card {
  width: 160px; /* 너비 고정 */
  flex-shrink: 0; /* 스크롤 시 찌그러짐 방지 */
  cursor: pointer;
  transition: transform 0.3s;
  position: relative;
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 10;
}

.poster-wrapper {
  position: relative;
  width: 100%;
  height: 240px; /* 높이 고정 (2:3 비율) */
  border-radius: 4px;
  overflow: hidden;
}

/* 이미지가 달라도 꽉 차게 만듦 */
.poster-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비율 유지하면서 꽉 채우기 */
}

/* 찜 하트 위치 예쁘게 */
.wish-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.2rem;
  filter: drop-shadow(0 0 2px rgba(0,0,0,0.7));
}

.movie-info h3 {
  color: #e5e5e5;
  font-size: 0.9rem;
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 글자 넘치면 ... 처리 */
  padding: 0 2px;
}
</style>