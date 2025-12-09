import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/popular',
            name: 'popular',
            component: () => import('../views/PopularView.vue')
        },
        {
            path: '/search',
            name: 'search',
            component: () => import('../views/SearchView.vue')
        },
        {
            path: '/wishlist',
            name: 'wishlist',
            component: () => import('../views/WishlistView.vue')
        },
        {
            path: '/signin',
            name: 'signin',
            component: () => import('../views/SignInView.vue')
        },
        {
            path: '/movie/:id',
            name: 'movieDetail',
            component: MovieDetailView
        }
    ]
})

// 👇 여기가 핵심! (전역 가드 설정)
router.beforeEach((to, from, next) => {
    // 로컬 스토리지에서 로그인 정보 확인
    const isAuthenticated = localStorage.getItem('currentUser');

    // 1. 로그인이 안 되어 있는데, 로그인 페이지가 아닌 곳을 가려고 하면?
    if (!isAuthenticated && to.name !== 'signin') {
        // 로그인 페이지로 강제 이동!
        next({ name: 'signin' });
    }
    // 2. 이미 로그인했는데 로그인 페이지를 또 가려고 하면? (선택사항)
    else if (isAuthenticated && to.name === 'signin') {
        // "이미 로그인했잖아요" 하고 홈으로 보냄
        next({ name: 'home' });
    }
    // 3. 그 외에는 그냥 통과!
    else {
        next();
    }
})

export default router