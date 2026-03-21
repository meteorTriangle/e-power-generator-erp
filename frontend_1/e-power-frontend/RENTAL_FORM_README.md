# 發電機租賃表單 (GeneratorRentForm) 使用說明

## 概述
這是一個完整的發電機租賃預約表單組件，基於 Google Forms 的原始表單設計，包含完整的驗證、API 整合和用戶反饋功能。

## 功能特點

### ✅ 表單欄位
1. **基本資料**
   - 姓名（身分證全名）- 必填
   - 手機號碼 1 - 必填，台灣手機格式驗證
   - 手機號碼 2 - 必填，不可與第一支相同

2. **發票資訊**
   - 統編選擇（需要/不需要）- 必填
   - 統一編號 - 8位數字，含邏輯驗證
   - 公司名稱 - 當選擇需要統編時必填

3. **租賃資訊**
   - 使用地址 - 必填，至少10個字
   - 預計租期 - 選填，日期範圍選擇器
   - 備註 - 選填，最多500字

### 🔒 驗證功能
- **姓名驗證**：2-50字，僅允許中英文和空格
- **手機驗證**：台灣手機號碼格式（09開頭）
- **統編驗證**：8位數字 + 邏輯驗證演算法
- **地址驗證**：至少10個字的完整地址
- **重複檢查**：兩支手機號碼不可相同

### 🎯 用戶體驗
- 即時驗證提示
- 字數計數器
- 條件式欄位顯示（統編相關）
- 清除表單確認對話框
- 提交成功模態框
- Loading 狀態顯示

## 安裝依賴

```bash
cd frontend_1/e-power-frontend
npm install dayjs
```

## 路由配置

表單已添加到路由中，可通過以下路徑訪問：
- **開發路徑**: `http://localhost:5173/rental`
- **生產路徑**: `/rental`

## API 整合

### 服務文件
位置：`src/services/rental.ts`

### API 端點
```typescript
POST /api/v1/rentals - 創建租賃預約
GET  /api/v1/rentals - 獲取租賃列表
GET  /api/v1/rentals/:id - 獲取單一租賃詳情
PUT  /api/v1/rentals/:id - 更新租賃
DELETE /api/v1/rentals/:id - 刪除租賃
```

### 請求格式
```typescript
{
  full_name: string;           // 姓名
  phone1: string;              // 手機號碼1
  phone2: string;              // 手機號碼2
  need_tax_id: 'yes' | 'no';   // 是否需要統編
  tax_id?: string;             // 統一編號（選填）
  company_name?: string;       // 公司名稱（選填）
  address: string;             // 使用地址
  rental_period_start?: string; // 租期開始（格式：YYYY-MM-DD）
  rental_period_end?: string;   // 租期結束（格式：YYYY-MM-DD）
  notes?: string;              // 備註
}
```

## 使用方式

### 1. 啟動開發伺服器
```bash
cd frontend_1/e-power-frontend
npm run dev
```

### 2. 訪問表單
在瀏覽器中打開：`http://localhost:5173/rental`

### 3. 填寫表單
1. 填寫基本資料（姓名、兩支手機）
2. 選擇是否需要統編
3. 如需統編，填寫統一編號和公司名稱
4. 填寫使用地址
5. 選擇租期（選填）
6. 填寫備註（選填）
7. 點擊「提交預約」

## 驗證規則詳解

### 台灣手機號碼驗證
```typescript
// 允許格式：
- 0912345678
- +886912345678
// 驗證規則：09開頭，共10位數字
```

### 統一編號驗證
```typescript
// 8位數字
// 使用台灣統編驗證演算法
// 權重：[1, 2, 1, 2, 1, 2, 4, 1]
// 特殊規則：第7位為7時允許誤差1
```

## 錯誤處理

### HTTP 狀態碼處理
- **400**: 資料格式錯誤 → 顯示錯誤訊息
- **401**: 未授權 → 導向登入頁
- **500**: 伺服器錯誤 → 提示稍後再試
- **其他**: 通用錯誤提示

### 網路錯誤
- 顯示友善的錯誤訊息
- 保留用戶已填寫的資料
- 允許用戶重新提交

## 成功提交後

1. 顯示成功模態框
2. 展示預約資訊摘要
3. 提供兩個選項：
   - 關閉模態框
   - 前往控制台

## 自訂配置

### 修改 API 端點
編輯 `.env` 文件：
```bash
VITE_API_URL=http://your-api-url/api/v1
```

### 修改表單樣式
表單使用 Ant Design 組件，可通過修改 style 屬性或創建自定義 CSS。

### 添加欄位
1. 更新 `FormValues` 介面
2. 更新 `RentalRequest` 介面（在 rental.ts）
3. 添加 Form.Item 組件
4. 添加驗證規則

## 測試建議

### 單元測試
- 驗證函數測試（手機、統編）
- 表單提交邏輯測試

### 整合測試
- API 連接測試
- 錯誤處理測試
- 表單驗證流程測試

### E2E 測試
- 完整填寫流程
- 驗證錯誤顯示
- 成功提交流程

## 注意事項

⚠️ **重要提醒**：
1. 使用前請確保已安裝 `dayjs` 套件
2. 需要配置正確的 API 端點
3. 表單需要用戶登入才能訪問（受 ProtectedRoute 保護）
4. 統編驗證使用台灣標準演算法

## 後端 API 需求

後端需要實現以下端點：

```go
// POST /api/v1/rentals
type RentalRequest struct {
    FullName           string `json:"full_name" binding:"required"`
    Phone1             string `json:"phone1" binding:"required"`
    Phone2             string `json:"phone2" binding:"required"`
    NeedTaxId          string `json:"need_tax_id" binding:"required,oneof=yes no"`
    TaxId              string `json:"tax_id,omitempty"`
    CompanyName        string `json:"company_name,omitempty"`
    Address            string `json:"address" binding:"required"`
    RentalPeriodStart  string `json:"rental_period_start,omitempty"`
    RentalPeriodEnd    string `json:"rental_period_end,omitempty"`
    Notes              string `json:"notes,omitempty"`
}
```

## 維護建議

1. 定期更新依賴套件
2. 監控表單提交成功率
3. 收集用戶反饋改進 UX
4. 定期檢查驗證邏輯的準確性

## 相關文件

- Google 原始表單：[連結](https://docs.google.com/forms/d/e/1FAIpQLSeFJB13K82Oz5sXfOehA93Cv2fyPTWN6MLLf6SbQtONFRNYxg/viewform)
- Ant Design 文件：https://ant.design/
- dayjs 文件：https://day.js.org/

## 授權
此組件為 E大發電機 ERP 系統的一部分。
