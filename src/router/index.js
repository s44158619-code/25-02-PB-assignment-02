import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/signin', name: 'signin', component: () => import('../views/SignInView.vue') },
        { path: '/popular', name: 'popular', component: () => import('../views/PopularView.vue') },
        { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
        { path: '/wishlist', name: 'wishlist', component: () => import('../views/WishlistView.vue') },
        { path: '/movie/:id', name: 'movieDetail', component: MovieDetailView }
    ]
})

// 🌟 [필수] 로그인 가드 (미들웨어)
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('currentUser');

    if (!isAuthenticated && to.name !== 'signin') {
        // 로그인이 안 됐는데 다른 페이지 가려고 하면 -> 로그인 페이지로 납치
        next({ name: 'signin' });
    } else if (isAuthenticated && to.name === 'signin') {
        // 로그인했는데 로그인 페이지 또 가려고 하면 -> 홈으로 보냄
        next({ name: 'home' });
    } else {
        next();
    }
})

export default router