import axios from 'axios';
import { server } from './Server'; // Importing the server constant

const BASE_URL = server; // Using the imported server constant

// Axios instance with global settings (Optional)
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Register API call
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed. Please try again.' };
    }
};

// Login API call
export const login = async (userData) => {
    try {
        const response = await api.post('/auth/login', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed. Please try again.' };
    }
};
