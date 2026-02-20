import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Use relative path to leverage the Vite proxy
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration/invalid signature universally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Automatically log out user if token is invalid or expired
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
