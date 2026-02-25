// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://apiv2.shopybucks.com',
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('employee_token'); // or wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or clear invalid token
      localStorage.removeItem('employee_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);