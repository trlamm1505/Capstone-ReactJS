import axios from "axios";

const api = axios.create({
    baseURL: "https://movienew.cybersoft.edu.vn/api/",
});

api.interceptors.request.use((config) => {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    const headers = {
        TokenCybersoft:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return {
        ...config,
        headers: {
            ...headers,
            ...config.headers,
        },
    };
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_isAuthenticated');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('lastActivity');
        }
        return Promise.reject(error);
    }
);

export default api;
