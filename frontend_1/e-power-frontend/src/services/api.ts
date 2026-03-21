import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenUtils } from '../utils/token';

// 建立 axios 實例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 攔截器 - 自動加入 JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response 攔截器 - 處理 token 過期 & 處理標準回傳格式
api.interceptors.response.use(
  (response) => {
    // 如果回傳格式符合 ApiRequest，直接回傳 data
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return response.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 如果是 401 錯誤且還沒重試過
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenUtils.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // 呼叫 refresh token API
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api/v1'}/refresh-token`,
          { refresh_token: refreshToken }
        );
        const { data } = response.data;
        const { access_token } = data;
        tokenUtils.setAccessToken(access_token);

        // 重試原本的請求
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token 也失效，清除 tokens 並導向登入頁
        tokenUtils.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
