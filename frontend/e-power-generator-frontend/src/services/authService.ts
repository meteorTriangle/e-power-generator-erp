// src/services/authService.ts
import apiClient from './apiClient';
import type { AxiosResponse } from './apiClient';
import axios from 'axios';


// 登入表單的資料型別
interface LoginCredentials {
  email: string;
  password: string;
}

// 登入成功後，後端回傳的資料型別 (假設)
interface LoginResponse {
//   token: string;
    user:          string;
    role:          string;
    group:         Array<string>;
    sales_site:    number;
    phone_number:  string;
    email:         string;
    email_checked: boolean;
}


export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    
    try {
        const response: AxiosResponse<LoginResponse> = await apiClient.post('/v1/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('登入失敗:', error);
        throw error;
    };
    
};;