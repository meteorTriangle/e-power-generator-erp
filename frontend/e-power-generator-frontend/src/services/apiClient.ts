import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// ----------------------------------------------------
// 錯誤的設定 (這會繞過 Proxy，導致 CORS 錯誤)
// const API_BASE_URL = 'http://localhost:8080/api/v1'; 
// ----------------------------------------------------

// 正確的設定 (讓請求發向您前端伺服器的相對路徑)
// 這樣 Vite/CRA 的 Proxy 才能攔截到它
const API_BASE_URL = '/api/v1'; 
// ----------------------------------------------------


const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // 使用這個相對路徑
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... (攔截器等)

export default apiClient;
export type { AxiosResponse, AxiosError };
