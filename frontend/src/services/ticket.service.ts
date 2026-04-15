import api from '@/lib/axios';
import type { Ticket, CreateTicketRequest, UpdateTicketRequest, TicketStats, ApiResponse } from '@/types';

export const ticketService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    problemType?: string;
    assignedToId?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<ApiResponse<Ticket[]>> => {
    const response = await api.get<ApiResponse<Ticket[]>>('/tickets', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Ticket> => {
    const response = await api.get<ApiResponse<Ticket>>(`/tickets/${id}`);
    return response.data.data!;
  },

  getByProtocol: async (protocol: string): Promise<Ticket> => {
    const response = await api.get<ApiResponse<Ticket>>(`/tickets/protocol/${protocol}`);
    return response.data.data!;
  },

  create: async (data: CreateTicketRequest): Promise<Ticket> => {
    const response = await api.post<ApiResponse<Ticket>>('/tickets', data);
    return response.data.data!;
  },

  update: async (id: string, data: UpdateTicketRequest): Promise<Ticket> => {
    const response = await api.put<ApiResponse<Ticket>>(`/tickets/${id}`, data);
    return response.data.data!;
  },

  updateStatus: async (
    id: string,
    status: string,
    reason?: string,
    notifyCustomer?: boolean
  ): Promise<Ticket> => {
    const response = await api.patch<ApiResponse<Ticket>>(`/tickets/${id}/status`, {
      status,
      reason,
      notifyCustomer,
    });
    return response.data.data!;
  },

  assign: async (id: string, assignedToId: string): Promise<Ticket> => {
    const response = await api.patch<ApiResponse<Ticket>>(`/tickets/${id}/assign`, {
      assignedToId,
    });
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },

  getStats: async (): Promise<TicketStats> => {
    const response = await api.get<ApiResponse<TicketStats>>('/tickets/stats');
    return response.data.data!;
  },

  getStatusHistory: async (id: string): Promise<Array<{
    id: string;
    status: string;
    reason?: string;
    changedAt: string;
  }>> => {
    const response = await api.get<ApiResponse<Array<{
      id: string;
      status: string;
      reason?: string;
      changedAt: string;
    }>>>(`/tickets/${id}/history`);
    return response.data.data!;
  },
};

export default ticketService;
