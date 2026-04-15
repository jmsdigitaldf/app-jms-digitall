import { Router, Request, Response } from 'express';
import { prisma } from '../server.js';
import { z } from 'zod';
import { TicketStatus, Priority, ProblemType, DeviceType } from '@prisma/client';

const router: Router = Router();

const TicketSchema = z.object({
  protocol: z.string().optional(),
  customerId: z.string(),
  whatsappMessage: z.string().optional(),
  problemType: z.enum(['HARDWARE', 'SOFTWARE', 'NETWORK', 'PRINTER', 'OTHER']),
  deviceType: z.enum(['DESKTOP', 'LAPTOP', 'TABLET', 'SMARTPHONE', 'PRINTER', 'ROUTER', 'OTHER']),
  brand: z.string(),
  model: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).default('OPEN'),
  description: z.string().optional(),
});

// Função para gerar protocolo
const generateProtocol = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `${month}${year}-${random}`;
};

// GET all tickets
router.get('/', async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { customer: true, quotes: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// GET ticket by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: { customer: true, quotes: true },
    });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// POST create ticket
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = TicketSchema.parse(req.body);
    const protocol = data.protocol || generateProtocol();
    
    const ticket = await prisma.ticket.create({
      data: {
        ...data,
        protocol,
        problemType: data.problemType as ProblemType,
        deviceType: data.deviceType as DeviceType,
        priority: data.priority as Priority,
        status: (data.status as TicketStatus) || 'OPEN',
      },
      include: { customer: true, quotes: true },
    });
    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// PUT update ticket
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = TicketSchema.partial().parse(req.body);
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(data.problemType && { problemType: data.problemType as ProblemType }),
        ...(data.deviceType && { deviceType: data.deviceType as DeviceType }),
        ...(data.priority && { priority: data.priority as Priority }),
        ...(data.status && { status: data.status as TicketStatus }),
      },
      include: { customer: true, quotes: true },
    });
    res.json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// PATCH update ticket status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = z.object({ status: z.enum(['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']) }).parse(req.body);
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: { status: status as TicketStatus },
      include: { customer: true, quotes: true },
    });
    res.json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// DELETE ticket
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.ticket.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

export default router;
