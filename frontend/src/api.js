import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access');
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
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/token/refresh/',
            { refresh: refreshToken }
          );

          const newAccess = response.data.access;
          localStorage.setItem('access', newAccess);

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
