import { create } from 'zustand';
import type { Customer, Ticket, Quote, TicketStats } from '@/types';
import { customersAPI, ticketsAPI, quotesAPI, servicesAPI } from '@/services/api';

// Fallback mock data for when API is down
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
    problemType: 'HARDWARE',
    deviceType: 'LAPTOP',
    brand: 'Dell',
    model: 'Inspiron 15',
    status: 'OPEN' as any,
    priority: 'MEDIUM',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    quotes: [{ id: '1', ticketId: '1', serviceName: 'Troca de Tela', description: 'Substituição da tela', price: 550, status: 'PENDING', createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' }],
  },
  {
    id: '2',
    protocol: '0124-0002',
    customerId: '2',
    customer: mockCustomers[1],
    whatsappMessage: 'Computador muito lento, preciso de upgrade',
    problemType: 'SOFTWARE',
    deviceType: 'DESKTOP',
    brand: 'HP',
    model: 'Pavilion',
    status: 'IN_PROGRESS' as any,
    priority: 'HIGH',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-21T09:00:00Z',
    quotes: [{ id: '2', ticketId: '2', serviceName: 'Upgrade SSD', description: 'Instalação de SSD 480GB', price: 350, status: 'APPROVED', createdAt: '2024-02-20T15:00:00Z', updatedAt: '2024-02-21T09:00:00Z' }],
  },
  {
    id: '3',
    protocol: '0124-0003',
    customerId: '3',
    customer: mockCustomers[2],
    whatsappMessage: 'Notebook não liga, acho que é problema na bateria',
    problemType: 'HARDWARE',
    deviceType: 'LAPTOP',
    brand: 'Lenovo',
    model: 'ThinkPad',
    status: 'ON_HOLD' as any,
    priority: 'MEDIUM',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T11:00:00Z',
    quotes: [{ id: '3', ticketId: '3', serviceName: 'Troca de Bateria', description: 'Bateria nova original', price: 280, status: 'PENDING', createdAt: '2024-03-10T11:00:00Z', updatedAt: '2024-03-10T11:00:00Z' }],
  },
  {
    id: '4',
    protocol: '0124-0004',
    customerId: '1',
    customer: mockCustomers[0],
    whatsappMessage: 'Preciso formatar meu computador e instalar programas',
    problemType: 'SOFTWARE',
    deviceType: 'LAPTOP',
    brand: 'Samsung',
    model: 'NP300',
    status: 'COMPLETED' as any,
    priority: 'LOW',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    quotes: [{ id: '4', ticketId: '4', serviceName: 'Formatação Windows', description: 'Formatação completa com backup', price: 150, status: 'APPROVED', createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T10:00:00Z' }],
  },
  {
    id: '5',
    protocol: '0124-0005',
    customerId: '2',
    customer: mockCustomers[1],
    whatsappMessage: 'Teclado do notebook parou de funcionar algumas teclas',
    problemType: 'HARDWARE',
    deviceType: 'LAPTOP',
    brand: 'Apple',
    model: 'MacBook Pro',
    status: 'IN_PROGRESS' as any,
    priority: 'URGENT',
    createdAt: '2024-03-15T13:00:00Z',
    updatedAt: '2024-03-16T10:00:00Z',
    quotes: [{ id: '5', ticketId: '5', serviceName: 'Troca de Teclado', description: 'Teclado novo ABNT2', price: 450, status: 'APPROVED', createdAt: '2024-03-15T14:00:00Z', updatedAt: '2024-03-15T15:00:00Z' }],
  },
];

interface DataState {
  customers: Customer[];
  tickets: Ticket[];
  quotes: Quote[];
  services: any[];
  loading: boolean;
  error: string | null;
  
  // Initialization
  initializeData: () => Promise<void>;
  
  // Stats
  getTicketStats: () => TicketStats;
  
  // Customers CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Tickets CRUD
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'customer' | 'quotes' | 'protocol'>) => Promise<void>;
  updateTicket: (id: string, ticket: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  updateTicketStatus: (id: string, status: string) => Promise<void>;
  
  // Quotes CRUD
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateQuote: (id: string, quote: Partial<Quote>) => Promise<void>;
  deleteQuote: (quoteId: string) => Promise<void>;
  updateQuoteStatus: (id: string, status: string) => Promise<void>;
  
  // Services CRUD
  loadServices: () => Promise<void>;
  addService: (service: any) => Promise<void>;
  updateService: (id: string, service: any) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  customers: mockCustomers,
  tickets: mockTickets,
  quotes: mockTickets.flatMap(t => t.quotes || []),
  services: [],
  loading: false,
  error: null,
  
  // Initialize data from API
  initializeData: async () => {
    set({ loading: true, error: null });
    try {
      const [customersRes, ticketsRes, quotesRes, servicesRes] = await Promise.all([
        customersAPI.getAll().catch(() => null),
        ticketsAPI.getAll().catch(() => null),
        quotesAPI.getAll().catch(() => null),
        servicesAPI.getAll().catch(() => null),
      ]);

      if (customersRes?.data) {
        set({ customers: customersRes.data });
      }
      if (ticketsRes?.data) {
        set({ tickets: ticketsRes.data });
      }
      if (quotesRes?.data) {
        set({ quotes: quotesRes.data });
      }
      if (servicesRes?.data) {
        set({ services: servicesRes.data });
      }
      set({ loading: false });
    } catch (error) {
      console.error('Failed to initialize data:', error);
      set({ error: 'Usando dados locais. Backend não disponível.', loading: false });
    }
  },
  
  // Stats
  getTicketStats: () => {
    const tickets = get().tickets;
    const revenue = tickets
      .filter(t => t.status === 'COMPLETED')
      .reduce((acc, t) => acc + (t.quotes?.reduce((s, q) => s + q.price, 0) || 0), 0);
    
    return {
      total: tickets.length,
      pending: tickets.filter(t => t.status === 'OPEN').length,
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
  
  // Customers
  addCustomer: async (customer) => {
    try {
      const res = await customersAPI.create(customer).catch(async () => {
        const newCustomer: Customer = {
          ...customer,
          id: Math.random().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _count: { tickets: 0 },
        };
        return { data: newCustomer };
      });
      
      set((state) => ({ customers: [res.data, ...state.customers] }));
    } catch (error) {
      console.error('Failed to add customer:', error);
      throw error;
    }
  },
  
  updateCustomer: async (id, updates) => {
    try {
      const res = await customersAPI.update(id, updates).catch(async () => {
        return { data: updates };
      });
      
      set((state) => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...res.data } : c),
      }));
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  },
  
  deleteCustomer: async (id) => {
    try {
      await customersAPI.delete(id).catch(() => null);
      set((state) => ({ customers: state.customers.filter(c => c.id !== id) }));
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  },
  
  // Tickets
  addTicket: async (ticket) => {
    try {
      const res = await ticketsAPI.create(ticket).catch(async () => {
        const newTicket: Ticket = {
          ...ticket,
          id: Math.random().toString(),
          customer: get().customers.find(c => c.id === ticket.customerId)!,
          quotes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { data: newTicket };
      });
      
      set((state) => ({ tickets: [res.data, ...state.tickets] }));
    } catch (error) {
      console.error('Failed to add ticket:', error);
      throw error;
    }
  },
  
  updateTicket: async (id, updates) => {
    try {
      const res = await ticketsAPI.update(id, updates).catch(async () => {
        return { data: updates };
      });
      
      set((state) => ({
        tickets: state.tickets.map(t => t.id === id ? { ...t, ...res.data } : t),
      }));
    } catch (error) {
      console.error('Failed to update ticket:', error);
      throw error;
    }
  },
  
  deleteTicket: async (id) => {
    try {
      await ticketsAPI.delete(id).catch(() => null);
      set((state) => ({ tickets: state.tickets.filter(t => t.id !== id) }));
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      throw error;
    }
  },
  
  updateTicketStatus: async (id, status) => {
    try {
      const res = await ticketsAPI.updateStatus(id, status).catch(async () => {
        return { data: { status } };
      });
      
      set((state) => ({
        tickets: state.tickets.map(t => t.id === id ? { ...t, status: res.data.status as any } : t),
      }));
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      throw error;
    }
  },
  
  // Quotes
  addQuote: async (quote) => {
    try {
      const res = await quotesAPI.create(quote).catch(async () => {
        const newQuote: Quote = {
          ...quote,
          id: Math.random().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { data: newQuote };
      });
      
      set((state) => ({
        quotes: [res.data, ...state.quotes],
        tickets: state.tickets.map(t =>
          t.id === quote.ticketId
            ? { ...t, quotes: [...(t.quotes || []), res.data] }
            : t
        ),
      }));
    } catch (error) {
      console.error('Failed to add quote:', error);
      throw error;
    }
  },
  
  updateQuote: async (id, updates) => {
    try {
      const res = await quotesAPI.update(id, updates).catch(async () => {
        return { data: updates };
      });
      
      set((state) => ({
        quotes: state.quotes.map(q => q.id === id ? { ...q, ...res.data } : q),
        tickets: state.tickets.map(t => ({
          ...t,
          quotes: t.quotes?.map(q => q.id === id ? { ...q, ...res.data } : q),
        })),
      }));
    } catch (error) {
      console.error('Failed to update quote:', error);
      throw error;
    }
  },
  
  deleteQuote: async (quoteId) => {
    try {
      await quotesAPI.delete(quoteId).catch(() => null);
      set((state) => ({
        quotes: state.quotes.filter(q => q.id !== quoteId),
        tickets: state.tickets.map(t => ({
          ...t,
          quotes: t.quotes?.filter(q => q.id !== quoteId),
        })),
      }));
    } catch (error) {
      console.error('Failed to delete quote:', error);
      throw error;
    }
  },
  
  updateQuoteStatus: async (id, status) => {
    try {
      const res = await quotesAPI.updateStatus(id, status).catch(async () => {
        return { data: { status } };
      });
      
      set((state) => ({
        quotes: state.quotes.map(q => q.id === id ? { ...q, status: res.data.status as any } : q),
        tickets: state.tickets.map(t => ({
          ...t,
          quotes: t.quotes?.map(q => q.id === id ? { ...q, status: res.data.status as any } : q),
        })),
      }));
    } catch (error) {
      console.error('Failed to update quote status:', error);
      throw error;
    }
  },
  
  // Services
  loadServices: async () => {
    try {
      const res = await servicesAPI.getAll().catch(async () => {
        return { data: [] };
      });
      set({ services: res.data });
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  },
  
  addService: async (service) => {
    try {
      const res = await servicesAPI.create(service).catch(async () => {
        const newService = {
          ...service,
          id: Math.random().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { data: newService };
      });
      
      set((state) => ({ services: [...state.services, res.data] }));
    } catch (error) {
      console.error('Failed to add service:', error);
      throw error;
    }
  },
  
  updateService: async (id, updates) => {
    try {
      const res = await servicesAPI.update(id, updates).catch(async () => {
        return { data: updates };
      });
      
      set((state) => ({
        services: state.services.map(s => s.id === id ? { ...s, ...res.data } : s),
      }));
    } catch (error) {
      console.error('Failed to update service:', error);
      throw error;
    }
  },
  
  deleteService: async (id) => {
    try {
      await servicesAPI.delete(id).catch(() => null);
      set((state) => ({ services: state.services.filter(s => s.id !== id) }));
    } catch (error) {
      console.error('Failed to delete service:', error);
      throw error;
    }
  },
}));
