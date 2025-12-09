import { ref } from 'vue';

// 로직 재사용을 위한 Custom Hook
export function useWishlist() {
    const wishlist = ref([]);

    // 1. 불러오기
    const loadWishlist = () => {
        const stored = localStorage.getItem('myWishlist');
        wishlist.value = stored ? JSON.parse(stored) : [];
    };

    // 2. 이미 찜했는지 확인
    const isWished = (movie) => {
        return wishlist.value.some(m => m.id === movie.id);
    };

    // 3. 찜 추가/삭제 토글 (핵심 로직)
    const toggleWishlist = (movie) => {
        loadWishlist(); // 최신 상태 동기화
        const index = wishlist.value.findIndex(m => m.id === movie.id);

        if (index === -1) {
            // 없으면 추가
            wishlist.value.push(movie);
            alert('찜 목록에 추가되었습니다! 💖');
        } else {
            // 있으면 삭제
            wishlist.value.splice(index, 1);
            alert('찜 목록에서 삭제되었습니다. 💔');
        }
        // 저장
        localStorage.setItem('myWishlist', JSON.stringify(wishlist.value));
    };

    // 4. 삭제 전용 (Wishlist 페이지용)
    const removeMovie = (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        loadWishlist();
        wishlist.value = wishlist.value.filter(m => m.id !== id);
        localStorage.setItem('myWishlist', JSON.stringify(wishlist.value));
    };

    return {
        wishlist,
        loadWishlist,
        isWished,
        toggleWishlist,
        removeMovie
    };
}