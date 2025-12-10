<template>
  <div class="signin-container">
    <div class="background-overlay"></div>

    <div class="login-card">
      <Transition name="fade-slide" mode="out-in">
        <div :key="isLoginMode ? 'login' : 'signup'" class="form-container">

          <h1 class="card-title">{{ isLoginMode ? '로그인' : '회원가입' }}</h1>

          <form @submit.prevent="handleSubmit" class="login-form">
            <div class="input-group">
              <input type="email" v-model="email" placeholder="이메일 주소" required />
            </div>

            <div class="input-group">
              <input type="password" v-model="password" placeholder="비밀번호 (TMDB API Key)" required />
            </div>

            <div class="input-group" v-if="!isLoginMode">
              <input type="password" v-model="confirmPassword" placeholder="비밀번호 확인" required />
            </div>

            <div class="input-group checkbox-group" v-if="!isLoginMode">
              <input type="checkbox" id="terms" v-model="agreeTerms">
              <label for="terms">개인정보 처리방침 및 이용약관에 동의합니다. (필수)</label>
            </div>

            <button type="submit" class="submit-btn">
              {{ isLoginMode ? '로그인' : '회원가입' }}
            </button>

            <div class="form-help">
              <div class="remember-me" v-if="isLoginMode">
                <input type="checkbox" id="remember" v-model="rememberMe">
                <label for="remember">로그인 정보 저장</label>
              </div>
              <span class="need-help">도움이 필요하신가요?</span>
            </div>
          </form>

        </div>
      </Transition>

      <div class="switch-mode">
        <p>
          {{ isLoginMode ? 'Netflix 회원이 아니신가요?' : '이미 계정이 있으신가요?' }}
          <span @click="toggleMode" class="switch-link">
            {{ isLoginMode ? '지금 가입하세요.' : '로그인하기' }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchPopularMovies } from '@/api/tmdb'; // API 호출 테스트용

const router = useRouter();
const isLoginMode = ref(true);

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const rememberMe = ref(false);
const agreeTerms = ref(false); // 약관 동의 변수

// 이메일 정규식 (형식 체크)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

onMounted(() => {
  // 저장된 아이디 불러오기 (Remember Me 기능)
  const savedEmail = localStorage.getItem('rememberedEmail');
  if (savedEmail) {
    email.value = savedEmail;
    rememberMe.value = true;
  }
});

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  // 초기화
  password.value = '';
  confirmPassword.value = '';
  agreeTerms.value = false;
};

const handleSubmit = () => {
  if (isLoginMode.value) {
    handleLogin();
  } else {
    handleRegister();
  }
};

// 로그인 로직
const handleLogin = async () => {
  // 1. 로컬 스토리지 확인
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email.value && u.password === password.value);

  if (user) {
    // 2. Remember Me 처리
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // 3. 로그인 성공 처리
    alert(`${user.email}님 환영합니다!`);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('TMDb-Key', user.password); // API 키 저장

    router.push('/'); // 메인으로 이동
  } else {
    alert('이메일이나 비밀번호를 확인해주세요.');
  }
};

// 회원가입 로직
const handleRegister = () => {
  // 1. 이메일 형식 체크
  if (!emailRegex.test(email.value)) {
    alert('올바른 이메일 형식이 아닙니다.');
    return;
  }

  // 2. 비밀번호 일치 체크
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 3. 약관 동의 체크
  if (!agreeTerms.value) {
    alert('약관에 동의해야 가입할 수 있습니다.');
    return;
  }

  // 4. 중복 가입 체크
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const existingUser = users.find(u => u.email === email.value);

  if (existingUser) {
    alert('이미 가입된 이메일입니다.');
    return;
  }

  // 5. 가입 처리
  const newUser = { email: email.value, password: password.value };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('회원가입 성공! 로그인해주세요.');
  toggleMode(); // 로그인 화면으로 자동 전환
};
</script>

<style scoped>
/* 기존 스타일 유지하면서 체크박스 스타일 추가 */
.signin-container {
  position: relative; height: 100vh; width: 100%;
  background-image: url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/KR-ko-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg');
  background-size: cover; background-position: center;
  display: flex; justify-content: center; align-items: center;
}
.background-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1; }
.login-card {
  position: relative; z-index: 2; background-color: rgba(0, 0, 0, 0.75);
  padding: 60px 68px 40px; border-radius: 4px; width: 100%; max-width: 450px; min-height: 600px; /* 높이 살짝 늘림 */
}
.card-title { color: white; font-size: 32px; font-weight: 700; margin-bottom: 28px; }
.input-group { margin-bottom: 16px; }

input[type="email"], input[type="password"] {
  width: 100%; height: 50px; line-height: 50px; padding: 16px 20px;
  border: 1px solid #333; border-radius: 4px; background: #333; color: white;
  font-size: 16px; box-sizing: border-box; transition: all 0.3s;
}
input:focus { outline: none; background: #454545; border-bottom: 2px solid #E50914; }

/* 체크박스 스타일 */
.checkbox-group { display: flex; align-items: center; gap: 10px; color: #b3b3b3; font-size: 13px; margin-top: 10px; }
.remember-me { display: flex; align-items: center; gap: 5px; }

.submit-btn {
  width: 100%; padding: 16px; font-size: 16px; font-weight: 700; margin-top: 24px;
  background-color: #E50914; color: white; border: none; border-radius: 4px; cursor: pointer;
  transition: all 0.2s;
}
.submit-btn:hover { background-color: #f40612; transform: scale(1.02); }

.form-help { display: flex; justify-content: space-between; margin-top: 10px; color: #b3b3b3; font-size: 13px; }
.switch-mode { margin-top: 40px; color: #737373; font-size: 16px; }
.switch-link { color: white; margin-left: 5px; cursor: pointer; transition: color 0.3s; }
.switch-link:hover { color: #E50914; text-decoration: underline; }

/* 애니메이션 */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(30px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-30px); }
</style>