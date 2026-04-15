import { create } from 'zustand';
import type { Customer, Ticket, Quote, TicketStats } from '@/types';

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Maria Silva',
    phone: '11999999999',
    email: 'maria@email.com',
    document: '123.456.789-00',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    _count: { tickets: 3 },
  },
  {
    id: '2',
    name: 'João Santos',
    phone: '11988888888',
    email: 'joao@email.com',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    isActive: true,
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
    _count: { tickets: 1 },
  },
  {
    id: '3',
    name: 'Ana Costa',
    phone: '21977777777',
    email: 'ana@email.com',
    city: 'Rio de Janeiro',
    state: 'RJ',
    isActive: true,
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
    _count: { tickets: 2 },
  },
];

const mockTickets: Ticket[] = [
  {
    id: '1',
    protocol: '0124-0001',
    customerId: '1',
    customer: mockCustomers[0],
    whatsappMessage: 'Meu notebook está com a tela quebrada',
    problemType: 'SCREEN',
    deviceType: 'LAPTOP',
    deviceBrand: 'Dell',
    deviceModel: 'Inspiron 15',
    status: 'PENDING',
    priority: 'MEDIUM',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    quotes: [{ id: '1', ticketId: '1', service: 'Troca de Tela', description: 'Substituição da tela', price: 550, status: 'PENDING', createdAt: '2024-01-15T10:00:00Z' }],
  },
  {
    id: '2',
    protocol: '0124-0002',
    customerId: '2',
    customer: mockCustomers[1],
    whatsappMessage: 'Computador muito lento, preciso de upgrade',
    problemType: 'SLOW_PERFORMANCE',
    deviceType: 'DESKTOP',
    deviceBrand: 'HP',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-21T09:00:00Z',
    quotes: [{ id: '2', ticketId: '2', service: 'Upgrade SSD', description: 'Instalação de SSD 480GB', price: 350, status: 'APPROVED', createdAt: '2024-02-20T15:00:00Z', approvedAt: '2024-02-21T09:00:00Z' }],
  },
  {
    id: '3',
    protocol: '0124-0003',
    customerId: '3',
    customer: mockCustomers[2],
    whatsappMessage: 'Notebook não liga, acho que é problema na bateria',
    problemType: 'BATTERY',
    deviceType: 'LAPTOP',
    deviceBrand: 'Lenovo',
    status: 'QUOTED',
    priority: 'MEDIUM',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T11:00:00Z',
    quotes: [{ id: '3', ticketId: '3', service: 'Troca de Bateria', description: 'Bateria nova original', price: 280, status: 'PENDING', createdAt: '2024-03-10T11:00:00Z' }],
  },
  {
    id: '4',
    protocol: '0124-0004',
    customerId: '1',
    customer: mockCustomers[0],
    whatsappMessage: 'Preciso formatar meu computador e instalar programas',
    problemType: 'FORMAT_OS',
    deviceType: 'LAPTOP',
    deviceBrand: 'Samsung',
    status: 'COMPLETED',
    priority: 'LOW',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    completedAt: '2024-01-12T16:00:00Z',
    quotes: [{ id: '4', ticketId: '4', service: 'Formatação Windows', description: 'Formatação completa com backup', price: 150, status: 'APPROVED', createdAt: '2024-01-10T09:00:00Z', approvedAt: '2024-01-10T10:00:00Z' }],
  },
  {
    id: '5',
    protocol: '0124-0005',
    customerId: '2',
    customer: mockCustomers[1],
    whatsappMessage: 'Teclado do notebook parou de funcionar algumas teclas',
    problemType: 'KEYBOARD',
    deviceType: 'LAPTOP',
    deviceBrand: 'Apple',
    deviceModel: 'MacBook Pro',
    status: 'WAITING_PART',
    priority: 'URGENT',
    createdAt: '2024-03-15T13:00:00Z',
    updatedAt: '2024-03-16T10:00:00Z',
    quotes: [{ id: '5', ticketId: '5', service: 'Troca de Teclado', description: 'Teclado novo ABNT2', price: 450, status: 'APPROVED', createdAt: '2024-03-15T14:00:00Z', approvedAt: '2024-03-15T15:00:00Z' }],
  },
];

interface DataState {
  customers: Customer[];
  tickets: Ticket[];
  quotes: Quote[];
  loading: boolean;
  getTicketStats: () => TicketStats;
  addTicket: (ticket: Ticket) => void;
  updateTicketStatus: (id: string, status: string) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  customers: mockCustomers,
  tickets: mockTickets,
  quotes: mockTickets.flatMap(t => t.quotes || []),
  loading: false,
  
  getTicketStats: () => {
    const tickets = get().tickets;
    const revenue = tickets
      .filter(t => t.status === 'COMPLETED')
      .reduce((acc, t) => acc + (t.quotes?.reduce((s, q) => s + q.price, 0) || 0), 0);
    
    return {
      total: tickets.length,
      pending: tickets.filter(t => t.status === 'PENDING').length,
      inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      completed: tickets.filter(t => t.status === 'COMPLETED').length,
      cancelled: tickets.filter(t => t.status === 'CANCELLED').length,
      today: tickets.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length,
      thisWeek: tickets.filter(t => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(t.createdAt) >= weekAgo;
      }).length,
      thisMonth: tickets.filter(t => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return new Date(t.createdAt) >= monthAgo;
      }).length,
      revenue,
    };
  },
  
  addTicket: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
  
  updateTicketStatus: (id, status) => set((state) => ({
    tickets: state.tickets.map(t => 
      t.id === id 
        ? { ...t, status: status as any, updatedAt: new Date().toISOString() }
        : t
    ),
  })),
}));
