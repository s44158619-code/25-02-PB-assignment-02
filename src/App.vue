<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue' // 경로 변경됨!
</script>

<template>
  <NavBar /> <RouterView /> </template>

<style>
/* 전역 스타일: 넷플릭스 배경색 */
body {
  margin: 0;
  padding: 0;
  background-color: #141414;
  color: white;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>