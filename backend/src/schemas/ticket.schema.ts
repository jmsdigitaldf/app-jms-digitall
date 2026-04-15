import { z } from 'zod';

export const createTicketSchema = z.object({
  customerId: z.string().uuid('ID do cliente inválido'),
  whatsappMessage: z.string().min(1, 'Mensagem é obrigatória'),
  problemType: z.enum([
    'SCREEN',
    'BATTERY',
    'KEYBOARD',
    'SLOW_PERFORMANCE',
    'VIRUS_MALWARE',
    'HARDWARE',
    'SOFTWARE',
    'FORMAT_OS',
    'DATA_RECOVERY',
    'NETWORK_WIFI',
    'AUDIO',
    'POWER_JACK',
    'MOTHERBOARD',
    'COOLING',
    'OTHER',
  ]),
  problemDetails: z.string().optional(),
  deviceType: z.enum(['LAPTOP', 'DESKTOP', 'ALL_IN_ONE', 'TABLET', 'SMARTPHONE', 'OTHER']).optional(),
  deviceBrand: z.string().optional(),
  deviceModel: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedToId: z.string().uuid().optional(),
});

export const updateTicketSchema = z.object({
  customerId: z.string().uuid().optional(),
  problemType: z.enum([
    'SCREEN',
    'BATTERY',
    'KEYBOARD',
    'SLOW_PERFORMANCE',
    'VIRUS_MALWARE',
    'HARDWARE',
    'SOFTWARE',
    'FORMAT_OS',
    'DATA_RECOVERY',
    'NETWORK_WIFI',
    'AUDIO',
    'POWER_JACK',
    'MOTHERBOARD',
    'COOLING',
    'OTHER',
  ]).optional(),
  problemDetails: z.string().optional(),
  deviceType: z.enum(['LAPTOP', 'DESKTOP', 'ALL_IN_ONE', 'TABLET', 'SMARTPHONE', 'OTHER']).optional(),
  deviceBrand: z.string().optional(),
  deviceModel: z.string().optional(),
  status: z.enum([
    'PENDING',
    'QUOTED',
    'APPROVED',
    'REJECTED',
    'IN_PROGRESS',
    'WAITING_PART',
    'COMPLETED',
    'CANCELLED',
  ]).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedToId: z.string().uuid().optional(),
  aiResponse: z.string().optional(),
});

export const ticketQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.string().optional(),
  priority: z.string().optional(),
  problemType: z.string().optional(),
  assignedToId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

export const ticketParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});
