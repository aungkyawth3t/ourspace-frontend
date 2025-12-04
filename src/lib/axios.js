import axios from 'axios';

const client = axios.create({
    // Laravel Backend URL
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

// Request Interceptor: Read XSRF-TOKEN cookie and set it as X-XSRF-TOKEN header
// This is required for Laravel Sanctum CSRF protection
client.interceptors.request.use(
    (config) => {
        // Get the XSRF-TOKEN cookie value
        const xsrfToken = getCookie('XSRF-TOKEN');
        if (xsrfToken) {
            // Set it as a header for Laravel Sanctum
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function to get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

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