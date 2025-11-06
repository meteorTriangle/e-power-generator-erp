import {
  useState,
  useEffect,
} from 'react';
import type {
  ReactNode,
  FC,
} from 'react';
import apiClient from '../services/apiClient';

// --- 1. 定義型別 (Types) ---

interface User {
  username: string;
  email: string;
  role: 'admin' | 'superadmin' | 'sales' | 'technician' | 'customer' | string;
  group: string[];
  email_verified: boolean;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

interface RefreshApiResponse {
  access_token: string;
  username: string;
  email: string;
  role: string;
  group: string[];
  email_verified: boolean;
}

// --- 2. 建立 Context ---
// (修改) 我們需要 'export' Context，這樣 useAuth Hook 才能在另一個檔案中讀取它

// --- 3. 建立 Provider (提供者) ---

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiClient.post<RefreshApiResponse>(
          '/auth/refresh',
          {},
        );
        
        const {
          access_token,
          username,
          role,
          email,
          group,
          email_verified,
        } = response.data;

        const user: User = { username, email, role, group, email_verified };

        if (!access_token || !user) {
          throw new Error('無效的 refresh API 回應');
        }

        login(user, access_token);

      } catch (err) {
        console.error("AuthContext - 刷新登入狀態失敗:", err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    delete apiClient.defaults.headers.common['Authorization'];
    
    apiClient.post('/auth/logout')
      .catch(err => console.error("Logout API call failed:", err));
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// (修改) 移除 useAuth Hook，這個檔案現在只預設匯出 Provider 元件
export default AuthProvider;


