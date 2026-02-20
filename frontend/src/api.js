import axios from 'axios';

// Remove trailing slashes from the environment variable if present
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true, // Important: include cookies for JWT
    headers: {
        'Content-Type': 'application/json'
    }
});

// Configure response interceptor for global error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If we have a response from the server but it's an error status
        if (error.response) {
            console.error('API Error Response:', error.response.data);
            // Return the error data so components can display specific messages
            return Promise.reject(error.response.data);
        }
        // If the request was made but no response was received (Network Error)
        else if (error.request) {
            console.error('API Network Error: No response received', error.request);
            return Promise.reject({
                success: false,
                message: 'Network or Server error. Please verify the API is running and accessible.'
            });
        }
        // Something happened in setting up the request
        else {
            console.error('API Setup Error:', error.message);
            return Promise.reject({
                success: false,
                message: 'An unexpected error occurred while processing the request.'
            });
        }
    }
);

export default api;
