import api from './api';
import { tokenUtils } from '../utils/token';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface RegisterRequest {
  email: string;
  phone: string;
  name: string;
  password: string;
  confirm_password: string;
  user_type: "individual" | "business";
  company_name?: string;
  company_tax_id?: string;
}

export const authService = {
  // 登入
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', data);
    const { access_token, refresh_token } = response.data;
    tokenUtils.setTokens(access_token, refresh_token);
    return response.data;
  },

  // 註冊
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/register', data);
    const { access_token, refresh_token } = response.data;
    tokenUtils.setTokens(access_token, refresh_token);
    return response.data;
  },

  // 登出
  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenUtils.clearTokens();
    }
  },

  // 取得目前使用者資訊
  async getCurrentUser() {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
