import api from '@/lib/axios';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<{ data: User }>('/auth/me');
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<{ data: User }>('/auth/profile', data);
    return response.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/auth/password', { currentPassword, newPassword });
  },
};

export default authService;
