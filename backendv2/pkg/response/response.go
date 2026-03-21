package response

import (
	"net/http"
	"encoding/json"
)

// Response 統一回應格式
type Response struct {
    Success bool        `json:"success"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
    Error   interface{} `json:"error,omitempty"`
    Meta    *Meta       `json:"meta,omitempty"` // 元數據（分頁、時間戳等）
}

// Meta 元數據
type Meta struct {
    Page       int   `json:"page,omitempty"`
    PageSize   int   `json:"page_size,omitempty"`
    Total      int64 `json:"total,omitempty"`
    TotalPages int   `json:"total_pages,omitempty"`
    Timestamp  int64 `json:"timestamp,omitempty"`
}

// PaginatedResponse 分頁回應
type PaginatedResponse struct {
    Items interface{} `json:"items"`
    Meta  *Meta       `json:"meta"`
}

// Success 成功回應
func Success(w http.ResponseWriter, statusCode int, message string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	response := Response{
		Success: true,
		Message: message,
		Data:    data,
	}
	json.NewEncoder(w).Encode(response)
	return
}

// SuccessWithMeta 帶元數據的成功回應
func SuccessWithMeta(w http.ResponseWriter, statusCode int, message string, data interface{}, meta *Meta) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	response := Response{
		Success: true,
		Message: message,
		Data:    data,
		Meta:    meta,
	}
	json.NewEncoder(w).Encode(response)
	return
}

// Paginated 分頁回應
func Paginated(w http.ResponseWriter, message string, items interface{}, page, pageSize int, total int64) {
    totalPages := int(total) / pageSize
    if int(total)%pageSize != 0 {
        totalPages++
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(Response{
        Success: true,
        Message: message,
        Data: PaginatedResponse{
            Items: items,
            Meta: &Meta{
                Page:       page,
                PageSize:   pageSize,
                Total:      total,
                TotalPages: totalPages,
            },
        },
    })
}

// Error 錯誤回應
func Error(w http.ResponseWriter, statusCode int, message string, err error) {
    resp := Response{
        Success: false,
        Message: message,
    }

    if err != nil {
        resp.Error = err.Error()
    }

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(resp)
	return
}

// ErrorWithDetails 帶詳細錯誤的回應
func ErrorWithDetails(w http.ResponseWriter, statusCode int, message string, details interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(Response{
        Success: false,
        Message: message,
        Error:   details,
    })
}

// ValidationError 驗證錯誤
func ValidationError(w http.ResponseWriter, errors map[string]string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusBadRequest)
    json.NewEncoder(w).Encode(Response{
        Success: false,
        Message: "資料驗證失敗",
        Error:   errors,
    })
}

// Unauthorized 未授權
func Unauthorized(w http.ResponseWriter, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusUnauthorized)
    json.NewEncoder(w).Encode(Response{
        Success: false,
        Message: message,
    })
}

// Forbidden 禁止存取
func Forbidden(w http.ResponseWriter, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusForbidden)
    json.NewEncoder(w).Encode(Response{
        Success: false,
        Message: message,
    })
}

// NotFound 找不到資源
func NotFound(w http.ResponseWriter, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusNotFound)
    json.NewEncoder(w).Encode(Response{
        Success: false,
        Message: message,
    })
}

// InternalServerError 伺服器錯誤
func InternalServerError(w http.ResponseWriter, message string, err error) {
    resp := Response{
        Success: false,
        Message: message,
    }

    if err != nil {
        resp.Error = err.Error()
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusInternalServerError)
    json.NewEncoder(w).Encode(resp)
	return
}

// NoContent 無內容回應 (204)
func NoContent(w http.ResponseWriter) {
    w.WriteHeader(http.StatusNoContent)
	return
}