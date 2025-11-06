import { 
    useContext
 } from 'react';
// (修改) 從 AuthContext 檔案中匯入 Context 和型別
import { AuthContext } from '../context/authContext.ts'; 

/**
 * useAuth Hook
 * 這是其他組件要 "使用" Context 的唯一方式
 * @returns {AuthContextType}
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

