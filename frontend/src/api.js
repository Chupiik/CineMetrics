import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN} from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});


api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/token/refresh/',
            { refresh: refreshToken }
          );

          const newAccess = response.data.access;
          localStorage.setItem(ACCESS_TOKEN, newAccess);

          error.config.headers.Authorization = `Bearer ${newAccess}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        console.error('Refresh token expired or invalid, forcing logout', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
