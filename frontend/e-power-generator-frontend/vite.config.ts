import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ----------------------------------------------------
  // 關鍵在這裡：設定伺服器選項
  // ----------------------------------------------------
  // rasableSyntaxOnly: true,
  server: {
    // (可選) 設定您希望 Vite 運行的 port
    port: 5173, 
    allowedHosts: true,
    host: "0.0.0.0",
    // (可選) 啟動時自動在瀏覽器中開啟
    // open: true, 

    // ----------------------------------------------------
    // 關鍵的 Proxy 設定
    // ----------------------------------------------------
    proxy: {
      
      // 1. 關鍵字：'/api/v1'
      // 這會匹配所有以 /api/v1 開頭的請求路徑
      // 這必須與您在 apiClient.ts 中設定的 baseURL 完全一致
      '/api': {
        
        // 2. 目標伺服器 (Target)
        // 這是您的 Go 後端真正運行的位址
        target: 'http://localhost:9098', 

        // 3. 更改來源 (Change Origin) - 必須
        // 將請求標頭中的 'Host' 欄位從 vite 的 host (localhost:5173)
        // 改成目標伺服器的 host (localhost:8080)
        // 幾乎所有的後端 API 都會檢查 Host 標頭，所以這通常是必須的
        changeOrigin: true,

        // 4. 路徑重寫 (Rewrite) - (目前可能不需要，但很重要)
        // 
        // 預設情況下，Vite 會將請求路徑原封不動地轉發：
        // (前端) /api/v1/generators -> (後端) http://localhost:8080/api/v1/generators
        // 
        // 這剛好符合您的 Go 後端 API 路徑，所以您 *不需要* rewrite。
        //
        // **但是**，如果您的 Go 後端 API *沒有* /api/v1 前綴
        // (例如：Go 只監聽 /generators)
        // 您就需要用 rewrite 來 "移除" 前綴：
        // rewrite: (path) => path.replace(/^\/api\/v1/, ''),
        // (這會將 /api/v1/generators 轉發為 http://localhost:8080/generators)
        
        // rewrite: (path) => path.replace(/^\/api\/v1/, ''), // 目前請保持註解
      },
      "/img" : {
        target: 'http://localhost:9098', 
        changeOrigin: true,
      }
      
      // 如果您有其他 API 路徑 (例如 /auth)，但它們共用 /api 前綴，
      // 則上面的規則已經涵蓋了。
      // 如果您有 *完全不同* 的 API (例如 /ws 用於 WebSocket)，
      // 您可以在這裡新增第二條規則：
      // '/ws': { ... }
    }
  }
})




