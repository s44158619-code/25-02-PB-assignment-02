# 🎬 Netflix Clone Project (Vue 3 + Vite)

<div align="center">
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />
</div>

<br>

**전북대학교 초급 프로젝트 2차 과제** 결과물입니다.
Vue 3 Composition API와 TMDB API를 활용하여 넷플릭스의 핵심 기능을 구현한 **반응형 SPA(Single Page Application)** 입니다.

---

## 🔗 배포 주소 (Demo)
- **GitHub Pages**: [https://s44158619-code.github.io/25-02-PB-assignment-02/](https://s44158619-code.github.io/25-02-PB-assignment-02/)
- **Repository**: [https://github.com/s44158619-code/25-02-PB-assignment-02](https://github.com/s44158619-code/25-02-PB-assignment-02)

---

## 🧑‍💻 프로젝트 정보 (Developer)
- **과목명**: 초급 프로젝트 (PB)
- **개발자**: 전북대학교 컴퓨터인공지능학부 **성윤오**
- **학번**: 202212953
- **개발 기간**: 2025.02 (2차 과제)

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 (Stack) | 설명 |
| :-- | :-- | :-- |
| **Framework** | **Vue.js 3** | Composition API (`<script setup>`) 활용 |
| **Build Tool** | **Vite** | 빠른 개발 서버 및 빌드 최적화 |
| **Language** | JavaScript (ES6+) | Modern JS 문법 적용 |
| **State Mgmt** | **Composable** | `useWishlist` Hook을 통한 전역 상태 관리 (Vuex 대체) |
| **Routing** | **Vue Router 4** | 네비게이션 가드(로그인 체크) 및 라우팅 |
| **API** | TMDB API | Axios를 활용한 REST API 비동기 통신 |
| **Style** | CSS3 | Flexbox, Grid, Media Query(반응형), Animation |
| **Deploy** | GitHub Actions | CI/CD 자동화 배포 |

---

## ✨ 주요 기능 (Key Features)

### 1️⃣ 사용자 인증 (Authentication)
* **로그인 & 회원가입**: Local Storage를 DB처럼 활용하여 사용자 정보 관리.
* **유효성 검사**: 이메일 형식, 비밀번호 일치 여부, 약관 동의 체크.
* **전환 애니메이션**: 로그인/회원가입 폼 전환 시 부드러운 Slide & Fade 효과 적용 (`<Transition>`).
* **자동 로그인**: '로그인 정보 저장(Remember Me)' 기능 구현.
* **보안**: 네비게이션 가드(`beforeEach`)를 통해 비로그인 시 접근 차단.

### 2️⃣ 홈 화면 (Home)
* **Hero Banner**: 최신 인기 영화를 대형 배너로 노출 (평점, 개봉년도 포함).
* **API 4종 연동**: `Popular`, `Now Playing`, `Top Rated`, `Action` 장르별 섹션 구성.
* **슬라이더 UI**: 마우스 호버 시 나타나는 화살표 버튼으로 가로 스크롤 구현.
* **스켈레톤 로딩 (Skeleton UI)**: 데이터 로딩 중 반짝이는 UI를 보여주어 사용자 경험(UX) 향상.

### 3️⃣ 대세 콘텐츠 (Popular)
* **뷰 모드 전환**: 사용자가 **Table View**와 **Infinite Scroll** 중 선택 가능.
* **Pagination**: Table View 모드에서 페이지 번호 이동 기능.
* **Infinite Scroll**: 스크롤 바닥 감지 시 자동으로 다음 페이지 데이터 로딩.
* **Scroll To Top**: 긴 스크롤 시 맨 위로 이동하는 버튼 제공.

### 4️⃣ 찾아보기 (Search & Filter)
* **검색 기능**: 영화 제목, 인물 등 키워드 검색.
* **검색 기록 (History)**: 최근 검색어 저장/삭제 기능 (Local Storage 연동).
* **3단 필터링**:
    1.  **장르별**: 액션, 로맨스, 코미디 등.
    2.  **평점별**: 5점, 7점, 9점 이상 필터링.
    3.  **정렬**: 인기순 / 평점순 / 최신순 정렬.
* **초기화**: 검색어 및 모든 필터를 한 번에 초기화하는 버튼 제공.

### 5️⃣ 내가 찜한 리스트 (Wishlist)
* **API 미사용**: 과제 요구사항에 맞춰 **오직 Local Storage 데이터만** 사용.
* **전역 상태 공유**: 홈, 검색, 상세 페이지 어디서든 하트를 누르면 즉시 반영.
* **빈 화면 처리**: 찜한 콘텐츠가 없을 때의 Empty State UI 구현.
* **반응형 그리드**: 화면 크기에 따라 카드 배치 자동 조정.

---

## 💡 개발 포인트 (Evaluation Points)

### ✅ 상태 관리 전략 (State Management)
본 프로젝트는 외부 라이브러리인 **Vuex/Pinia를 사용하지 않았습니다.**
대신, Vue 3의 강력한 기능인 **Composable(`src/composables/useWishlist.js`)** 패턴을 사용하여 찜 목록(Wishlist) 데이터를 전역에서 관리합니다.
* **이유**: Vue 3에서는 Composable이 더 가볍고 직관적이며, 모듈화에 유리하기 때문입니다.
* **효과**: 코드의 재사용성을 높이고 불필요한 라이브러리 의존성을 제거했습니다.

### ✅ Git Flow 전략
`main` (배포용) 브랜치와 `develop` (개발용) 브랜치를 분리하여 관리했습니다.

### ✅ 성능 최적화
* **Skeleton Loading**: LCP(Largest Contentful Paint) 체감 속도 개선.
* **Lazy Loading**: 이미지에 `loading="lazy"` 속성 적용.

---

## 📂 폴더 구조 (Project Structure)

```text
src/
├── api/              # Axios 인스턴스 및 TMDB API 호출 함수
├── assets/           # 정적 파일 (CSS, Images)
├── components/       # 재사용 가능한 컴포넌트
│   ├── common/       # NavBar (헤더)
│   └── movie/        # MovieCard (영화 포스터 컴포넌트)
├── composables/      # [핵심] 전역 상태 관리 로직 (useWishlist)
├── router/           # 라우팅 설정 및 네비게이션 가드
├── views/            # 페이지 컴포넌트
│   ├── HomeView.vue         # 메인 홈
│   ├── PopularView.vue      # 대세 콘텐츠 (무한스크롤/페이지네이션)
│   ├── SearchView.vue       # 검색 및 필터링
│   ├── WishlistView.vue     # 찜한 목록
│   ├── MovieDetailView.vue  # 영화 상세 정보
│   └── SignInView.vue       # 로그인/회원가입
└── App.vue           # 메인 레이아웃 및 트랜지션 효과

🚀 설치 및 실행 (How to Run)
1. 프로젝트 클론
Bash

git clone https://github.com/s44158619-code/25-02-PB-assignment-02.git
cd 25-02-PB-assignment-02
2. 의존성 설치
주의: node_modules 폴더가 없으므로 반드시 설치해야 합니다.

Bash

npm install
3. 개발 서버 실행
Bash

npm run dev
4. 배포 (Deployment)
GitHub Actions를 통해 main 브랜치 푸시 시 자동 배포됩니다.