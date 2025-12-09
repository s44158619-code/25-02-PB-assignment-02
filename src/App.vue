<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue'
</script>

<template>
  <NavBar />

  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
/* 전역 스타일 */
body {
  margin: 0;
  padding: 0;
  background-color: #141414;
  color: white;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  overflow-x: hidden; /* 가로 스크롤 방지 */
}

/* 🌟 페이지 전환 애니메이션 (Fade 효과) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>