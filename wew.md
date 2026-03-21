# **專業機具租借系統 \- 開發與上線規劃書**

## **1\. 專案概況與技術架構建議**

基於您的需求，此系統不僅是一個電商網站，更是一個資源規劃 (ERP) 系統。

### **技術堆疊建議 (Tech Stack)**

* **前端 (Frontend):** React.js  
  * 建議搭配 **Next.js** 框架，以利於 SEO (搜尋引擎優化) 並提升首頁加載速度。  
  * 後台管理介面可使用 **Vite + React** 建構 SPA (單頁應用)，操作體驗更流暢。  
* **後端 (Backend):** Golang (Go)  
  * 效能極佳且具備強型別特性，非常適合處理高併發請求與複雜的庫存扣減邏輯。  
  * 建議框架：**Gin** 或 **Echo** (輕量且高效的 Web 框架)。  
* **資料庫 (Database):** PostgreSQL (關聯式資料庫，適合處理庫存、訂單、財務等強一致性資料)。  
* **雲端/基礎設施:** AWS 或 Google Cloud，搭配 Firebase Authentication 進行身份驗證。

## **2\. 專案目錄結構建議 (Project Structure)**

為了確保程式碼的可維護性與擴展性，建議採用以下目錄結構標準。

### **2.1 後端架構 (Golang - Clean Architecture)**

採用標準 Go 專案佈局 (Standard Go Project Layout)，並結合 Clean Architecture 分層原則。

```
/rental-system-backend  
├── cmd/  
│   └── api/  
│       └── main.go           # 程式進入點，負責初始化依賴與啟動 Server  
├── config/                   # 設定檔讀取邏輯 (env, yaml)  
├── internal/                 # 私有程式碼 (核心業務邏輯)  
│   ├── domain/               # 實體定義 (Entities) 與 介面 (Interfaces) \- 純 Go Struct，無外部依賴  
│   │   ├── product.go  
│   │   ├── order.go  
│   │   └── user.go  
│   ├── usecase/              # 應用邏輯層 (Business Logic) \- 實作 domain 介面  
│   │   ├── product_usecase.go  
│   │   └── order_usecase.go  
│   ├── repository/           # 資料存取層 (Database Access) \- SQL 實作  
│   │   ├── postgres/  
│   │   └── redis/  
│   └── delivery/             # 傳輸層 (HTTP Handlers/Controllers)  
│       └── http/  
│           ├── v1/           # API 版本控制  
│           ├── middleware/   # 認證、Log、CORS 中介軟體  
│           └── router.go     # 路由定義  
├── pkg/                      # 可共用的公用函式庫 (Logger, Utils)  
├── api/                      # OpenAPI/Swagger 文件定義  
├── migrations/               # 資料庫遷移腳本 (SQL Migrations)  
├── go.mod                    # Go Module 依賴管理  
└── Dockerfile                # 容器化設定
```

### **2.2 前端架構 (React / Next.js)**

建議採用功能導向 (Feature-based) 分組，將相關的組件、狀態和邏輯放在一起。

```
/rental-system-frontend  
├── src/  
│   ├── app/                  # Next.js App Router (頁面路由)  
│   │   ├── (auth)/           # 登入/註冊相關頁面群組  
│   │   ├── (dashboard)/      # 後台管理頁面群組  
│   │   │   ├── products/  
│   │   │   └── orders/  
│   │   └── page.tsx          # 首頁  
│   ├── components/           # 共用組件  
│   │   ├── ui/               # 基礎 UI 元件 (Button, Input, Card) \- 可搭配 Shadcn/UI  
│   │   └── shared/           # 跨頁面使用的複合組件 (Navbar, Footer)  
│   ├── features/             # 功能模組 (核心邏輯區)  
│   │   ├── product/          # 產品相關  
│   │   │   ├── components/   # 產品卡片、產品列表  
│   │   │   ├── hooks/        # useProductList, useProductDetail  
│   │   │   └── types.ts      # 產品型別定義  
│   │   └── order/            # 訂單相關  
│   ├── lib/                  # 第三方庫設定 (axios, firebase, utils)  
│   ├── stores/               # 全域狀態管理 (Zustand / Redux)  
│   ├── styles/               # 全域樣式 (Tailwind CSS 設定)  
│   └── types/                # 全域型別定義 (API Response 格式等)  
├── public/                   # 靜態資源 (圖片, Fonts)  
├── next.config.js            # Next.js 設定  
└── package.json
```

## **3\. API 與 資料庫設計規範 (Design Standards)**

統一的設計規範能大幅降低前後端溝通成本，請團隊嚴格遵守。

### **3.1 RESTful API 設計規範**

* **URL 命名:**  
  * 使用 **kebab-case** (短橫線) 分隔單字，例如 /api/v1/product-categories。  
  * 資源名稱使用 **複數名詞**，例如 /users, /orders。  
  * 層級結構：/resources/:id/sub-resources，例如 /api/v1/users/123/orders (查詢用戶 123 的訂單)。  
* **HTTP Method 語意:**  
  * GET: 獲取資源 (讀取)。  
  * POST: 新增資源 (創建)。  
  * PUT: 全量更新資源 (替換)。  
  * PATCH: 部分更新資源 (修改)。  
  * DELETE: 刪除資源。  
* **回應格式 (Response Structure):**  
  所有 API 回應皆需包裹在統一的 JSON 結構中：  
  {  
    "code": 200,          // 業務狀態碼 (非 HTTP 狀態碼)  
    "message": "success", // 用於顯示給開發者的訊息  
    "data": { ... }       // 實際資料 payload，若無資料則為 null  
  }

* **分頁 (Pagination):**  
  列表查詢接口必須支援分頁，參數統一使用 page 與 page\_size。  
  {  
    "code": 200,  
    "message": "success",  
    "data": {  
      "items": [ ... ],  
      "pagination": {  
        "current_page": 1,  
        "page_size": 20,  
        "total_items": 150,  
        "total_pages": 8  
      }  
    }  
  }

### **3.2 SQL 資料庫設計規範 (PostgreSQL)**

* **命名慣例:**  
  * Table 名稱：使用 **小寫複數 snake_case**，例如 products, order_items, users。  
  * Column 名稱：使用 **小寫 snake_case**，例如 product_name, created_at。  
* **必要欄位 (Audit Fields):**  
  每個 Table 都必須包含以下欄位，用於稽核與追蹤：  
  * id: Primary Key, BIGSERIAL (自增長整數) 或 UUID (視分散式需求而定)。  
  * created_at: TIMESTAMP WITH TIME ZONE, Default NOW().  
  * updated_at: TIMESTAMP WITH TIME ZONE, Default NOW().  
  * deleted_at: TIMESTAMP WITH TIME ZONE, Nullable (用於 Soft Delete 軟刪除，不物理刪除資料)。  
* **資料類型建議:**  
  * **金額/價格:** 使用 DECIMAL(19, 4) 或 NUMERIC，嚴禁使用 FLOAT 或 DOUBLE 以避免精度遺失。  
  * **狀態 (Status):** 使用 SMALLINT 搭配 Enum 定義 (例如 0: 待確認, 1: 進行中)，或直接使用 VARCHAR (例如 'pending', 'active') 提升可讀性。  
  * **外鍵 (Foreign Keys):** 必須建立實體外鍵約束 (Constraint)，確保資料一致性，命名規則 fk_{table_name}_{column_name}。  
* **範例 Schema (Products):**  
  CREATE TABLE products (  
      id BIGSERIAL PRIMARY KEY,  
      name VARCHAR(255) NOT NULL,  
      category_id BIGINT NOT NULL REFERENCES categories(id),  
      price DECIMAL(19, 4) NOT NULL DEFAULT 0,  
      stock_quantity INT NOT NULL DEFAULT 0,  
      description TEXT,  
      is_active BOOLEAN DEFAULT TRUE,  
      created_at TIMESTAMPTZ DEFAULT NOW(),  
      updated_at TIMESTAMPTZ DEFAULT NOW(),  
      deleted_at TIMESTAMPTZ  
  );  
  CREATE INDEX idx_products_category ON products(category_id);
## **4\. 階段性開發計畫 (Development Phases)**

我們將開發週期分為三個主要階段 (Stage)，每個階段約 1.5 ~ 2 個月，視開發團隊規模而定。

### **第一階段 (Stage 1): 核心租賃業務 (MVP - Minimum Viable Product)**

**目標：建立「能接單」的系統，確保客戶能在前台瀏覽並送出需求。**

* **前台功能:**  
  * [x] **首頁:** 基礎版面，包含產品分類導航。  
  * [x] **產品列表與詳情:** 顯示規格、價格、圖片。  
  * [x] **購物車/詢價單:** 允許將商品加入清單。  
  * [x] **租借申請流程:** 選擇日期 -> 填寫資料 -> 送出申請 (非即時付款，先走報價流程)。  
  * [x] **會員系統:** 註冊、登入 (Email/手機)、查看申請紀錄。  
* **後台功能 (總管理員):**  
  * [x] **產品管理:** 上架商品、設定基礎庫存。  
  * [x] **訂單管理:** 接收申請、手動變更狀態 (待確認 -> 已報價 -> 租賃中 -> 已歸還)。  
  * [x] **基礎儀表板:** 顯示待處理訂單。

### **第二階段 (Stage 2): 多站點營運與庫存管理**

**目標：加入「多角色」與「站點管理」，解決物流與庫存分配問題。**

* **前台功能:**  
  * [x] **站點選擇:** 用戶可查看並選擇取貨站點。  
  * [x] **租借站點介紹頁:** 整合 Google Maps API。  
  * [x] **聯絡我們與常見問題:** 靜態頁面完善。  
* **後台功能 (擴充角色權限):**  
  * [x] **權限系統:** 實作 站長、員工、投資人 分級權限。  
  * [x] **站點管理:** 各站點獨立庫存檢視。  
  * [x] **庫存管理進階:** 庫存預警、維修保養紀錄標記。  
  * [x] **通知系統:** Email 自動通知 (訂單確認、到期提醒)。

### **第三階段 (Stage 3): 財務、數據與體驗優化**

**目標：完善「財務分潤」與「使用者體驗」，提升運營效率。**

* **前台功能:**  
  * [x] **評價系統:** 租借完成後填寫評價。  
  * [x] **推薦系統:** 顯示「猜你喜歡」或「最近瀏覽」。  
  * [x] **多語言切換:** 增加英文/日文介面。  
* **後台功能:**  
  * [x] **報表與分析:** 銷售報表、熱門商品分析。  
  * [x] **帳務與分潤:** 計算各站點營收，生成投資人分潤報表。  
  * [x] **首頁內容管理 (CMS):** 讓行銷人員可拖拉編輯首頁廣告。  
  * [x] **系統日誌與備份:** 強化安全性與稽核。

## **5\. 逐步上線策略 (Rollout Strategy)**

與其一次全部上線導致混亂，建議採取 **「滾動式上線」**。

### **Phase 1: 內部試營運 (Alpha Launch)**

* **時間點:** 第一階段開發完成後。  
* **對象:** 內部員工、特定熟客 (約 5-10 人)。  
* **執行方式:**  
  * 請員工模擬客戶下單。  
  * 測試後台接單流程是否順暢。  
  * 確認庫存扣減邏輯無誤。  
* **重點:** 抓出重大 Bug，不開放公開註冊。

### **Phase 2: 地區性試營運 (Soft Launch)**

* **時間點:** 第二階段功能 (站點管理) 完成一半時。  
* **對象:** 僅開放「單一主要站點 (如台北總站)」的服務。  
* **執行方式:**  
  * 開放網站公開瀏覽，但限制取貨點。  
  * 投放小規模 Google 關鍵字廣告。  
  * 測試真實客戶的詢價轉換率。  
* **重點:** 收集真實客戶回饋，優化 UI/UX 流程。

### **Phase 3: 正式發布 (Grand Launch)**

* **時間點:** 第二階段完全結束，第三階段進行中。  
* **對象:** 全面開放。  
* **執行方式:**  
  * 開放所有站點租借。  
  * 啟動數位行銷活動 (FB/IG 廣告)。  
  * 啟用評價系統，累積社群口碑。  
* **重點:** 確保伺服器承載量，客服團隊隨時待命。

### **Phase 4: 功能擴張 (Expansion)**

* **時間點:** 第三階段完成後。  
* **執行方式:**  
  * 啟用多語言，開發外籍移工或外商工程團隊市場。  
  * 啟用投資人儀表板，招募更多站點加盟。  
  * 根據數據報表調整採購策略。

## **6\. 關鍵風險與應對 (Risk Management)**

1. **庫存衝突 (Overbooking):**  
   * *風險:* 線上顯示有貨，但現場機器損壞或未歸還。  
   * *解法:* 系統需保留「緩衝庫存」，且訂單需經「人工確認」才算生效，而非即時扣款。  
2. **資料安全:**  
   * *風險:* 客戶個資或投資人財務數據外洩。  
   * *解法:* 定期進行滲透測試，資料庫敏感欄位加密，落實權限控管 (RBAC)。  
3. **SEO 流量:**  
   * *風險:* 網站上線後搜尋不到。  
   * *解法:* 在產品詳情頁加強關鍵字 (如：高雄 發電機租借)，並在開發初期就導入 SSR (Server-Side Rendering) 架構。