import api from './api';

export interface RentalRequest {
  full_name: string;
  phone1: string;
  phone2: string;
  need_tax_id: 'yes' | 'no';
  tax_id?: string;
  company_name?: string;
  address: string;
  rental_period_start?: string;
  rental_period_end?: string;
  notes?: string;
}

export interface RentalResponse {
  id: number;
  full_name: string;
  phone1: string;
  phone2: string;
  need_tax_id: string;
  tax_id?: string;
  company_name?: string;
  address: string;
  rental_period_start?: string;
  rental_period_end?: string;
  notes?: string;
  status: string;
  created_at: string;
}

export const rentalService = {
  // 創建租賃預約
  async createRental(data: RentalRequest): Promise<RentalResponse> {
    const response = await api.post<RentalResponse>('/rentals', data);
    return response.data;
  },

  // 取得租賃列表
  async getRentals(): Promise<RentalResponse[]> {
    const response = await api.get<RentalResponse[]>('/rentals');
    return response.data;
  },

  // 取得單一租賃詳情
  async getRental(id: number): Promise<RentalResponse> {
    const response = await api.get<RentalResponse>(`/rentals/${id}`);
    return response.data;
  },

  // 更新租賃
  async updateRental(id: number, data: Partial<RentalRequest>): Promise<RentalResponse> {
    const response = await api.put<RentalResponse>(`/rentals/${id}`, data);
    return response.data;
  },

  // 刪除租賃
  async deleteRental(id: number): Promise<void> {
    await api.delete(`/rentals/${id}`);
  },
};
