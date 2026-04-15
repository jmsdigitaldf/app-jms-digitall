import { z } from 'zod';

export const createQuoteSchema = z.object({
  ticketId: z.string().uuid('ID do ticket inválido'),
  service: z.string().min(1, 'Serviço é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.coerce.number().positive('Preço deve ser positivo'),
  createdById: z.string().uuid().optional(),
});

export const updateQuoteSchema = z.object({
  service: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.coerce.number().positive().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

export const quoteQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.string().optional(),
  ticketId: z.string().uuid().optional(),
});

export const quoteParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});
