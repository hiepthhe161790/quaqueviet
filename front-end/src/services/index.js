import axios from 'axios';
import { BACKEND_API_URI } from '../utils/constants';

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: BACKEND_API_URI
});

// Add this interceptor to attach accessToken to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Nếu là request login hoặc refresh-token thì không xử lý refresh/redirect
    // Chỉ xử lý refresh token nếu request KHÔNG phải là login, signin, hoặc refresh-token
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !/\/api\/(v1\/)?user\/(login|signin|refresh-token)/.test(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${BACKEND_API_URI}/user/refresh-token`);
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        const errorMessage = 'Có vấn đề với phiên đăng nhập, xin hãy đăng nhập lại !';
        if (window.location.pathname !== '/signin') {
          window.location.href = `/error?status=401&message=${encodeURIComponent(errorMessage)}`;
        }
      }
    } else if (error.response.status === 403) {
      const errorMessage = error.response.data.message || "You do not have permission to access this resource.";
      window.location.href = `/error?status=403&message=${encodeURIComponent(errorMessage)}`;
    }
    return Promise.reject(error);
  }
);

export { api };