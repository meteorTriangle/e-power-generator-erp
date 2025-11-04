import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import type {
  ReactNode,
  FC,
} from 'react';
import apiClient from '../services/apiClient'; // 引入您設定好的 Axios 實例

// --- 1. 定義型別 (Types) ---

/**
 * 使用者物件的型別
 * 應與您後端 /login 和 /refresh 回傳的 user 物件相符
 */
interface User {
  username: string;
  email: string;
  role: 'admin' | 'superadmin' | 'sales' | 'technician' | 'customer' | string; // 確保包含所有可能的角色
  group: string[];
  email_verified: boolean;
}

/**
 * Context 要提供的資料和函式的型別
 */
interface AuthContextType {
  user: User | null;           // 目前登入的使用者，未登入為 null
  accessToken: string | null;  // 存取權杖，未登入為 null
  isLoading: boolean;          // 是否正在 "檢查登入中" (應用程式首次載入時)
  login: (user: User, token: string) => void; // 登入函式
  logout: () => void;         // 登出函式
}

// --- 2. 建立 Context ---

// 建立 Context，並給予一個 undefined 預設值
// 真正的 "值" 將由 AuthProvider 提供
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. 建立 Provider (提供者) ---

/**
 * Provider 組件的 Props 型別
 */
interface AuthProviderProps {
  children: ReactNode; // ReactNode 允許包裹任何 React 子組件
}

/**
 * AuthProvider 組件
 * 您會用這個組件在 main.tsx 中包裹您的 <App />
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // --- State (狀態) ---
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 預設為 true，代表 "正在檢查"

  // --- 關鍵 Effect：應用程式首次載入時，檢查認證狀態 ---
  useEffect(() => {
    // 定義一個異步函式來檢查 refresh token
    const checkAuthStatus = async () => {
      try {
        // 呼叫 /refresh API。
        // apiClient 必須設定 'withCredentials: true'
        // 瀏覽器會自動帶上 HttpOnly 的 refresh_token Cookie
        const response = await apiClient.post('/auth/refresh', {});

        // ⚠️ 假設：您的 /refresh API 在成功時
        // 會回傳新的 access_token 和 user 物件
        const { access_token, username, role, email, group, email_verified } = response.data; 
        const user = { username, email, role, group, email_verified };

        if (!access_token || !user) {
          throw new Error('Invalid refresh response');
        }
        login(user, access_token);

      } catch (error) {
        // 如果失敗 (e.g., 401 或 cookie 過期)
        // 執行 "登出" 邏輯以清除任何殘留狀態
        logout();
      } finally {
        // 無論成功或失敗，"檢查" 這件事都已完成
        setIsLoading(false);
      }
    };

    // 執行檢查
    checkAuthStatus();

    // [] 空依賴陣列，代表此 Effect 只在組件 "掛載" (mount) 時執行一次
  }, []);

  // --- 函式 (Functions) ---

  /**
   * 登入函式：
   * 1. 儲存 User 和 AccessToken 到 state
   * 2. 將 AccessToken 注入到 apiClient 的預設標頭
   */
  const login = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    // 關鍵：將 token 設定到 Axios 的預設標頭 (Header)
    // 之後所有 apiClient 的請求都會自動帶上此標頭
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  /**
   * 登出函式：
   * 1. 清除 state
   * 2. 從 apiClient 移除標頭
   * 3. (可選) 呼叫後端 /logout 來讓 refresh token 失效
   */
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    // 關鍵：從 Axios 標頭中移除
    delete apiClient.defaults.headers.common['Authorization'];

    // (可選，但建議) 呼叫後端 API 來清除 HttpOnly cookie
    apiClient.post('/auth/logout')
      .catch(err => console.error("Logout API call failed:", err));
  };

  // --- 提供 Value ---

  // 組合要傳遞給子組件的值
  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
  };

  // 渲染 Provider，並將 value 傳遞下去
  // {children} 就是被 <AuthProvider> 包裹的 <App />
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 4. 建立自訂 Hook (Custom Hook) ---

/**
 * useAuth Hook
 * 這是其他組件要 "使用" Context 的唯一方式
 * * @returns {AuthContextType}
 * @throws {Error} 如果在 AuthProvider 之外使用
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // 檢查：確保 useAuth 是在 AuthProvider 內部被呼叫
  if (context === undefined) {
    throw new Error('useAuth 必須在 AuthProvider 內部使用');
  }

  // 回傳完整的 context 值 (user, login, logout, etc.)
  return context;
};
