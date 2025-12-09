<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="left-section">
      <RouterLink to="/" class="logo">Netflix Clone</RouterLink>

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

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const checkLoginStatus = () => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    isLoggedIn.value = true;
    userEmail.value = JSON.parse(user).email; // 이메일 전체 표시
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 4%;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  transition: background-color 0.3s;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0));
}

.navbar.scrolled {
  background-color: #141414;
}

.left-section { display: flex; align-items: center; }

/* 👇 수정 3: 로고 스타일 강화 */
.logo {
  color: #E50914; /* 넷플릭스 레드 */
  font-size: 28px;
  font-weight: 800; /* 더 굵게 */
  margin-right: 30px;
  text-decoration: none;
  font-family: 'Arial Black', sans-serif; /* 임팩트 있는 폰트 */
  text-transform: uppercase;
}

.menu-links a {
  color: #e5e5e5;
  margin-right: 20px;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.menu-links a:hover { color: #b3b3b3; }
.menu-links a.router-link-active { color: white; font-weight: bold; }

.right-section { display: flex; align-items: center; }
.user-menu { display: flex; align-items: center; gap: 15px; }
.user-email { color: white; font-size: 14px; }

.login-btn, .logout-btn {
  background-color: #E50914;
  color: white;
  padding: 7px 15px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
.logout-btn { background-color: #E50914; } /* 로그아웃 버튼도 빨간색으로 통일 */
.logout-btn:hover { background-color: #b2070f; }
</style>