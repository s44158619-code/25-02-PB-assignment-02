<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-content">
      <div class="left-section">
        <RouterLink to="/" class="logo">NETFLIX</RouterLink>

        <div class="menu-links" v-if="isLoggedIn">
          <RouterLink to="/">홈</RouterLink>
          <RouterLink to="/popular">대세</RouterLink>
          <RouterLink to="/search">검색</RouterLink>
          <RouterLink to="/wishlist">찜</RouterLink>
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
  top: 0; left: 0; width: 100%; height: 70px;
  z-index: 1000; transition: all 0.4s ease;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  box-sizing: border-box;
}
.navbar.scrolled {
  background-color: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.nav-content {
  width: 100%; height: 100%;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 50px; box-sizing: border-box;
}

.left-section { display: flex; align-items: center; overflow: hidden; }
.logo {
  color: #E50914; font-size: 25px; font-weight: bold; margin-right: 25px;
  text-decoration: none; text-shadow: 0 0 10px rgba(229, 9, 20, 0.3);
  flex-shrink: 0;
}

.menu-links { display: flex; gap: 15px; overflow-x: auto; white-space: nowrap; scrollbar-width: none; }
.menu-links::-webkit-scrollbar { display: none; }
.menu-links a {
  color: #e5e5e5; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.3s;
}
.menu-links a:hover { color: #b3b3b3; }
.menu-links a.router-link-active { color: white; font-weight: bold; }

.right-section { display: flex; align-items: center; flex-shrink: 0; }
.user-menu { display: flex; align-items: center; gap: 15px; }
.user-email { color: white; font-size: 13px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.login-btn, .logout-btn {
  background-color: #E50914; color: white; padding: 6px 12px;
  border-radius: 4px; font-size: 13px; font-weight: bold; border: none; cursor: pointer; transition: background 0.2s;
}

/* 🌟 [모바일 반응형 핵심] */
@media (max-width: 768px) {
  .nav-content { padding: 0 20px; } /* 여백 축소 */
  .logo { font-size: 20px; margin-right: 15px; }
  .menu-links { gap: 10px; }
  .menu-links a { font-size: 13px; }
  .user-email { display: none; } /* 모바일에선 이메일 숨김 */
  .logout-btn { font-size: 12px; padding: 5px 10px; }
}
</style>