export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'RECEPTIONIST';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { tickets: number };
}

export type ProblemType = 
  | 'SCREEN' | 'BATTERY' | 'KEYBOARD' | 'SLOW_PERFORMANCE'
  | 'VIRUS_MALWARE' | 'HARDWARE' | 'SOFTWARE' | 'FORMAT_OS'
  | 'DATA_RECOVERY' | 'NETWORK_WIFI' | 'AUDIO' | 'POWER_JACK'
  | 'MOTHERBOARD' | 'COOLING' | 'OTHER';

export type DeviceType = 'LAPTOP' | 'DESKTOP' | 'ALL_IN_ONE' | 'TABLET' | 'SMARTPHONE' | 'OTHER';
export type TicketStatus = 'PENDING' | 'QUOTED' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'WAITING_PART' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Ticket {
  id: string;
  protocol: string;
  customerId: string;
  customer: Customer;
  whatsappMessage: string;
  aiResponse?: string;
  problemType: ProblemType;
  problemDetails?: string;
  deviceType: DeviceType;
  deviceBrand?: string;
  deviceModel?: string;
  status: TicketStatus;
  priority: Priority;
  assignedToId?: string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  quotes?: Quote[];
  _count?: { quotes: number };
}

export type QuoteStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Quote {
  id: string;
  ticketId: string;
  ticket?: Ticket;
  service: string;
  description: string;
  price: number;
  status: QuoteStatus;
  createdAt: string;
  approvedAt?: string;
  createdById?: string;
  createdBy?: User;
}

export interface TicketStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  revenue: number;
}

export interface DashboardStats {
  tickets: TicketStats;
  customers: { total: number; active: number; inactive: number; withTickets: number };
  quotes: { total: number; pending: number; approved: number; rejected: number; totalValue: number };
}
