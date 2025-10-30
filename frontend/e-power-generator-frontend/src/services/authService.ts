// src/services/authService.ts
import apiClient from './apiClient';
import type { AxiosResponse } from './apiClient';
import axios from 'axios';


interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    password_confirma: string;
    tel: string;
}

interface LoginResponse {
    user:          string;
    role:          string;
    group:         Array<string>;
    sales_site:    number;
    phone_number:  string;
    email:         string;
    email_checked: boolean;
}

interface RegisterResponse {
    message: string;
}


export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    
    try {
        const response: AxiosResponse<LoginResponse> = await apiClient.post('/v1/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('登入失敗:', error);
        throw error;
    };
    
};


export const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await apiClient.post('/v1/auth/register', credentials);
        return response.data;
    } catch (error) {
        console.error('註冊失敗:', error);
        throw error;
    };
}

export const IsLogin = ()=>{
    return !(!localStorage.getItem('role') || localStorage.getItem('role') != 'admin');
};