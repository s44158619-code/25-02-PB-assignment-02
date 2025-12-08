import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/signin', name: 'signin', component: () => import('../views/SignInView.vue') },
        { path: '/popular', name: 'popular', component: () => import('../views/PopularView.vue') },
        { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
        { path: '/wishlist', name: 'wishlist', component: () => import('../views/WishlistView.vue') }
    ]
})

export default router