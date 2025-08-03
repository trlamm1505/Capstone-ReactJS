import axios from "axios";

const api = axios.create({
    baseURL: "https://movienew.cybersoft.edu.vn/api/",
});

api.interceptors.request.use((config) => {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken');
    console.log('API Interceptor - Access token:', accessToken);

    const headers = {
        TokenCybersoft:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
    };

    // Add Authorization header if access token exists
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log('API Interceptor - Final headers:', headers);
    console.log('API Interceptor - Request URL:', config.url);
    console.log('API Interceptor - Request method:', config.method);

    return {
        ...config,
        headers: {
            ...headers,
            ...config.headers, // Allow custom headers to override defaults
        },
    };
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log('API Interceptor: Token expired (401), clearing auth data but staying on current page');
            // Clear auth data without redirecting
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_isAuthenticated');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('lastActivity');
        }
        return Promise.reject(error);
    }
);

export default api;
