// useAxios plugin
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://api.ragna.app',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 300 seconds = 5 minutes
});

export const $axios = instance;
