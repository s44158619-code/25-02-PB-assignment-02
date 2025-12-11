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

// 스크롤이 50px 이상 내려가면 isScrolled를 true로 설정
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
  /* 배경색과 블러 효과가 부드럽게 전환되도록 설정 */
  transition: all 0.4s ease;
  /* 초기 상태: 상단이 어두운 그라데이션 (배너와 자연스럽게 섞임) */
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
}

/* 🌟 [핵심 수정] 스크롤 내렸을 때 적용되는 스타일 */
.navbar.scrolled {
  /* 1. 반투명한 검은색 배경 */
  background-color: rgba(20, 20, 20, 0.85);
  /* 2. 배경 블러 효과 (유리창처럼 뒷배경을 흐리게 만듦) */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* 사파리 브라우저 호환 */
  /* 3. 살짝 그림자를 주어 입체감 추가 */
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-content {
  width: 100%;
  padding: 0 4%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.left-section { display: flex; align-items: center; }

.logo {
  color: #E50914;
  font-size: 28px;
  font-weight: bold;
  margin-right: 25px;
  text-decoration: none;
  text-shadow: 0 0 10px rgba(229, 9, 20, 0.3); /* 로고 발광 효과 */
}

.menu-links { display: flex; gap: 20px; }

.menu-links a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s;
  white-space: nowrap;
}
.menu-links a:hover { color: #b3b3b3; }
.menu-links a.router-link-active {
  color: white;
  font-weight: bold;
}

.right-section { display: flex; align-items: center; }
.user-menu { display: flex; align-items: center; gap: 15px; }

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
  padding: 7px 15px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.login-btn:hover, .logout-btn:hover {
  background-color: #f40612;
}
</style>