import api from '@/lib/axios';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest, ApiResponse } from '@/types';

export const customerService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<Customer[]>> => {
    const response = await api.get<ApiResponse<Customer[]>>('/customers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data.data!;
  },

  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await api.post<ApiResponse<Customer>>('/customers', data);
    return response.data.data!;
  },

  update: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
    const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },

  getStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    withTickets: number;
  }> => {
    const response = await api.get<ApiResponse<{
      total: number;
      active: number;
      inactive: number;
      withTickets: number;
    }>>('/customers/stats');
    return response.data.data!;
  },

  searchByPhone: async (phone: string): Promise<Customer | null> => {
    const response = await api.get<ApiResponse<Customer>>('/customers/search', {
      params: { phone },
    });
    return response.data.data || null;
  },
};

export default customerService;
