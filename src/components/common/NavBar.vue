<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-content">
      <div class="left-section">
        <RouterLink to="/" class="logo">NETFLIX</RouterLink>
        <div class="menu-links">
          <RouterLink to="/">홈</RouterLink>
          <RouterLink to="/popular">대세 콘텐츠</RouterLink>
          <RouterLink to="/search">찾아보기</RouterLink>
          <RouterLink to="/wishlist">내가 찜한 리스트</RouterLink>
        </div>
      </div>

      <div class="right-section">
        <RouterLink v-if="!isLoggedIn" to="/signin" class="login-btn">로그인</RouterLink>
        <div v-else class="user-menu">
          <span class="user-email">{{ userEmail }}</span>
          <button @click="handleLogout" class="logout-btn">로그아웃</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isScrolled = ref(false);
const isLoggedIn = ref(false);
const userEmail = ref('');

const handleScroll = () => isScrolled.value = window.scrollY > 50;

const checkLoginStatus = () => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    isLoggedIn.value = true;
    userEmail.value = JSON.parse(user).email;
  } else {
    isLoggedIn.value = false;
    userEmail.value = '';
  }
};

const handleLogout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('TMDb-Key');
    isLoggedIn.value = false;
    router.push('/signin');
  }
};

watch(() => route.path, checkLoginStatus);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  checkLoginStatus();
});

onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  z-index: 100;
  transition: background-color 0.3s;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0));
  display: flex;
  justify-content: center; /* 중앙 정렬 */
}

.navbar.scrolled { background-color: #141414; }

.nav-content {
  width: 100%;
  padding: 0 4%; /* 양옆 여백 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section { display: flex; align-items: center; }

.logo {
  color: #E50914;
  font-size: 24px;
  font-weight: bold;
  margin-right: 25px;
  text-decoration: none;
}

.menu-links { display: flex; gap: 15px; }

.menu-links a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
  white-space: nowrap; /* 줄바꿈 방지 */
}
.menu-links a:hover { color: #b3b3b3; }
.menu-links a.router-link-active { color: white; font-weight: bold; }

.right-section { display: flex; align-items: center; }

.user-menu { display: flex; align-items: center; gap: 15px; }

/* 🌟 이메일 길어지면 ... 처리 */
.user-email {
  color: white;
  font-size: 14px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.login-btn, .logout-btn {
  background-color: #E50914;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 13px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}
</style>