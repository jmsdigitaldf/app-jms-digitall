import { Request } from 'express';

// ============================================
// TIPOS DE AUTENTICAÇÃO
// ============================================

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ============================================
// TIPOS DE RESPOSTA DA API
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// ============================================
// TIPOS DE USUÁRIO
// ============================================

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'RECEPTIONIST';
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'RECEPTIONIST';
  isActive?: boolean;
  avatarUrl?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  accessToken: string;
  refreshToken: string;
}

// ============================================
// TIPOS DE CLIENTE
// ============================================

export interface CreateCustomerDTO {
  name: string;
  phone: string;
  email?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  phone?: string;
  email?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  isActive?: boolean;
}

// ============================================
// TIPOS DE ATENDIMENTO (TICKET)
// ============================================

export interface CreateTicketDTO {
  customerId: string;
  whatsappMessage: string;
  problemType: string;
  problemDetails?: string;
  deviceType?: string;
  deviceBrand?: string;
  deviceModel?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedToId?: string;
}

export interface UpdateTicketDTO {
  customerId?: string;
  problemType?: string;
  problemDetails?: string;
  deviceType?: string;
  deviceBrand?: string;
  deviceModel?: string;
  status?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedToId?: string;
  aiResponse?: string;
}

export interface TicketFilter {
  status?: string;
  priority?: string;
  problemType?: string;
  assignedToId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// ============================================
// TIPOS DE ORÇAMENTO (QUOTE)
// ============================================

export interface CreateQuoteDTO {
  ticketId: string;
  service: string;
  description: string;
  price: number;
  createdById?: string;
}

export interface UpdateQuoteDTO {
  service?: string;
  description?: string;
  price?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// ============================================
// TIPOS DE SERVIÇO E PEÇAS
// ============================================

export interface CreateServiceDTO {
  name: string;
  description?: string;
  category: 'HARDWARE' | 'SOFTWARE' | 'MAINTENANCE' | 'UPGRADE' | 'ACCESSORY';
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  estimatedTime: string;
}

export interface CreatePartDTO {
  name: string;
  description?: string;
  category: string;
  brand?: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
}

// ============================================
// TIPOS DE WHATSAPP
// ============================================

export interface WhatsAppMessage {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: {
            body: string;
          };
        }>;
        statuses?: Array<unknown>;
      };
      field: string;
    }>;
  }>;
}

export interface WhatsAppResponse {
  messaging_product: 'whatsapp';
  to: string;
  text?: {
    body: string;
  };
  type: 'text';
}

// ============================================
// TIPOS DE IA
// ============================================

export interface AIAnalysisResult {
  problemType: 'screen' | 'battery' | 'slow' | 'virus' | 'hardware' | 'software' | 'keyboard' | 'power' | 'cooling' | 'network' | 'other';
  confidence: number;
  suggestedServices: string[];
  deviceType?: 'laptop' | 'desktop' | 'all-in-one' | 'tablet' | 'other';
}

export interface AIQuoteResult {
  services: Array<{
    name: string;
    description: string;
    price: number;
  }>;
  totalEstimate: number;
  estimatedTime: string;
}

// ============================================
// TIPOS DE LOG
// ============================================

export interface SystemLogDTO {
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
}

// ============================================
// UTILITÁRIOS DE TIPO
// ============================================

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export type Nullable<T> = T | null;

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
