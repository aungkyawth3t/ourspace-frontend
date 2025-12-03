import axios from 'axios';

const client = axios.create({
    // The URL of your Laravel Backend
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    
    // 2. IMPORTANT: Allow cookies to be sent with requests
    // This is required for Laravel Sanctum's session-based auth
    withCredentials: true,
    
    // 3. Standard Headers
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Helps Laravel identify AJAX requests
    },
});

// 4. Response Interceptor (Optional but Recommended)
// This catches errors globally. If the backend says "Unauthenticated" (401),
// we can redirect the user to login immediately.
client.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        
        if (response && response.status === 401) {
            // If the user is not logged in (401), clear local storage
            // and redirect to login
            localStorage.removeItem('user');
            // window.location.href = '/login'; // Optional: Force redirect
        }
        
        throw error;
    }
);

export default client;