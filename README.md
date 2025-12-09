# 🎬 Netflix Clone Project (Vue 3 + Vite)

전북대학교 초급 프로젝트 2차 과제: Netflix 스타일의 Front-End 데모 사이트입니다.
Vue 3, Vite, GitHub Actions를 활용하여 개발 및 배포되었습니다.

## 🧑‍💻 프로젝트 정보
- **과목명**: 초급 프로젝트 (PB)
- **개발자**: 전북대학교 컴퓨터인공지능학부 성윤오 (학번: 202212953)
- **배포 주소**: [https://s44158619-code.github.io/25-02-PB-assignment-02/](https://s44158619-code.github.io/25-02-PB-assignment-02/)

## 🛠 기술 스택 (Tech Stack)
- **Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **API**: TMDB (The Movie Database) API
- **Deployment**: GitHub Pages (via GitHub Actions)

## 📂 폴더 구조 (Project Structure)
src/ ├── api/ # TMDB API 호출 함수 모음 (Axios) ├── assets/ # 정적 파일 (CSS, Images) ├── components/ # 재사용 가능한 컴포넌트 │ ├── common/ # NavBar 등 공통 컴포넌트 │ └── movie/ # MovieCard 등 영화 관련 컴포넌트 ├── composables/ # 로직 재사용을 위한 Custom Hooks (useWishlist) ├── router/ # 페이지 라우팅 설정 ├── views/ # 각 페이지 화면 (Home, Popular, Search, SignIn...) └── App.vue # 메인 레이아웃 및 트랜지션 효과


## ✨ 주요 기능 (Features)
1.  **로그인 & 회원가입**
    * Local Storage를 활용한 사용자 인증
    * TMDB API Key를 비밀번호로 사용하여 API 연동
    * 로그인 상태 유지 및 로그아웃 기능
2.  **홈 화면 (Home)**
    * 최신 인기 영화 배너 (Hero Section)
    * 가로 스크롤 가능한 영화 포스터 리스트
    * 영화 찜하기 기능 (하트 토글)
3.  **대세 콘텐츠 (Popular)**
    * **테이블 뷰**: 페이지네이션(이전/다음) 지원
    * **무한 스크롤**: 스크롤 시 자동으로 다음 페이지 데이터 로딩
4.  **찾아보기 (Search)**
    * 영화 제목 검색 기능
    * 장르별 필터링 / 평점별 필터링 / 정렬(인기순, 최신순 등)
5.  **내가 찜한 리스트 (Wishlist)**
    * Local Storage에 저장된 찜 목록 조회
    * 찜한 영화 삭제 기능

## 🚀 설치 및 실행 가이드 (How to Run)

### 1. 프로젝트 클론
```bash
git clone [https://github.com/s44158619-code/25-02-PB-assignment-02.git](https://github.com/s44158619-code/25-02-PB-assignment-02.git)
cd 25-02-PB-assignment-02