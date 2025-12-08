<template>
  <div class="signin-container">
    <div class="background-overlay"></div>

    <div class="login-card">
      <h1 class="card-title">{{ isLoginMode ? '로그인' : '회원가입' }}</h1>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="input-group">
          <input
              type="email"
              v-model="email"
              placeholder="이메일 주소"
              required
          />
        </div>

        <div class="input-group">
          <input
              type="password"
              v-model="password"
              placeholder="비밀번호 (TMDB API Key)"
              required
          />
        </div>

        <div class="input-group" v-if="!isLoginMode">
          <input
              type="password"
              v-model="confirmPassword"
              placeholder="비밀번호 확인"
              required
          />
        </div>

        <button type="submit" class="submit-btn">
          {{ isLoginMode ? '로그인' : '회원가입' }}
        </button>

        <div class="form-help">
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="rememberMe">
            <label for="remember">로그인 정보 저장</label>
          </div>
          <span class="need-help">도움이 필요하신가요?</span>
        </div>
      </form>

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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoginMode = ref(true);

// 입력 데이터
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const rememberMe = ref(false);

// 모드 전환 함수
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
};

// 폼 제출 처리
const handleSubmit = () => {
  if (isLoginMode.value) {
    handleLogin();
  } else {
    handleRegister();
  }
};

// 로그인 로직
const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email.value && u.password === password.value);

  if (user) {
    alert(`${user.email}님 환영합니다!`);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('TMDb-Key', user.password);

    router.push('/'); // 홈으로 이동
  } else {
    alert('이메일이나 비밀번호를 확인해주세요.');
  }
};

// 회원가입 로직
const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const existingUser = users.find(u => u.email === email.value);

  if (existingUser) {
    alert('이미 가입된 이메일입니다.');
    return;
  }

  const newUser = { email: email.value, password: password.value };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('회원가입 성공! 로그인해주세요.');
  toggleMode();
};
</script>

<style scoped>
/* 스타일은 기존과 동일 */
.signin-container {
  position: relative;
  height: 100vh;
  width: 100%;
  background-image: url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/KR-ko-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.login-card {
  position: relative;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.75);
  padding: 60px 68px 40px;
  border-radius: 4px;
  width: 100%;
  max-width: 450px;
  min-height: 550px;
}

.card-title {
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 28px;
}

.input-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 16px 20px;
  border: 0;
  border-radius: 4px;
  background: #333;
  color: white;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  background: #454545;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  margin-top: 24px;
  background-color: #E50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #f40612;
}

.form-help {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #b3b3b3;
  font-size: 13px;
}

.switch-mode {
  margin-top: 40px;
  color: #737373;
  font-size: 16px;
}

.switch-link {
  color: white;
  margin-left: 5px;
  cursor: pointer;
}

.switch-link:hover {
  text-decoration: underline;
}
</style>