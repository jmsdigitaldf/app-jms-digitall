import api from '@/lib/axios';
import type { Quote, CreateQuoteRequest, UpdateQuoteRequest, QuoteStats, ApiResponse } from '@/types';

export const quoteService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    ticketId?: string;
  }): Promise<ApiResponse<Quote[]>> => {
    const response = await api.get<ApiResponse<Quote[]>>('/quotes', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Quote> => {
    const response = await api.get<ApiResponse<Quote>>(`/quotes/${id}`);
    return response.data.data!;
  },

  getByTicketId: async (ticketId: string): Promise<Quote[]> => {
    const response = await api.get<ApiResponse<Quote[]>>(`/quotes/ticket/${ticketId}`);
    return response.data.data!;
  },

  create: async (data: CreateQuoteRequest): Promise<Quote> => {
    const response = await api.post<ApiResponse<Quote>>('/quotes', data);
    return response.data.data!;
  },

  update: async (id: string, data: UpdateQuoteRequest): Promise<Quote> => {
    const response = await api.put<ApiResponse<Quote>>(`/quotes/${id}`, data);
    return response.data.data!;
  },

  approve: async (id: string): Promise<Quote> => {
    const response = await api.post<ApiResponse<Quote>>(`/quotes/${id}/approve`);
    return response.data.data!;
  },

  reject: async (id: string): Promise<Quote> => {
    const response = await api.post<ApiResponse<Quote>>(`/quotes/${id}/reject`);
    return response.data.data!;
  },

  sendToCustomer: async (id: string): Promise<void> => {
    await api.post(`/quotes/${id}/send`);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/quotes/${id}`);
  },

  getStats: async (): Promise<QuoteStats> => {
    const response = await api.get<ApiResponse<QuoteStats>>('/quotes/stats');
    return response.data.data!;
  },
};

export default quoteService;
