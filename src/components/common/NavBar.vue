<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-content">
      <div class="left-section">
        <RouterLink to="/" class="logo">NETFLIX</RouterLink>

        <div class="menu-links" v-if="isLoggedIn">
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
  left: 0; /* 🌟 왼쪽 끝 고정 */
  width: 100%;
  height: 70px;
  z-index: 1000; /* 🌟 다른 요소보다 무조건 위에 */
  transition: all 0.4s ease;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  box-sizing: border-box; /* 🌟 패딩 포함해서 너비 계산 */
}

.navbar.scrolled {
  background-color: rgba(20, 20, 20, 0.95); /* 조금 더 진하게 */
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.nav-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px; /* 🌟 양옆 여백 넉넉하게 확보 (중요!) */
  box-sizing: border-box;
}

.left-section { display: flex; align-items: center; }

.logo {
  color: #E50914;
  font-size: 28px;
  font-weight: bold;
  margin-right: 30px;
  text-decoration: none;
  text-shadow: 0 0 10px rgba(229, 9, 20, 0.3);
}

.menu-links { display: flex; gap: 20px; }

.menu-links a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
  white-space: nowrap;
}
.menu-links a:hover { color: #b3b3b3; }
.menu-links a.router-link-active { color: white; font-weight: bold; }

.right-section { display: flex; align-items: center; }

.user-menu {
  display: flex;
  align-items: center;
  gap: 20px; /* 🌟 이메일과 로그아웃 버튼 사이 간격 */
}

.user-email {
  color: white;
  font-size: 14px;
  max-width: 200px; /* 🌟 이메일 표시 공간 확보 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.login-btn, .logout-btn {
  background-color: #E50914;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 13px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.login-btn:hover, .logout-btn:hover {
  background-color: #f40612;
}

/* 모바일 대응 (화면 작아지면 여백 줄임) */
@media (max-width: 768px) {
  .nav-content { padding: 0 20px; }
  .logo { font-size: 20px; margin-right: 15px; }
  .menu-links { gap: 10px; }
  .menu-links a { font-size: 12px; }
}
</style>