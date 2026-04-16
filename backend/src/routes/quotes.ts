import { Router, Request, Response } from 'express';
import { prisma } from '../server.js';
import { z } from 'zod';
import { QuoteStatus } from '@prisma/client';

const router: Router = Router();

const QuoteSchema = z.object({
  ticketId: z.string(),
  serviceName: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
});

// GET all quotes
router.get('/', async (req: Request, res: Response) => {
  try {
    const quotes = await prisma.quote.findMany({
      include: { ticket: { include: { customer: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// GET quotes by ticket ID
router.get('/ticket/:ticketId', async (req: Request, res: Response) => {
  try {
    const quotes = await prisma.quote.findMany({
      where: { ticketId: req.params.ticketId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// POST create quote
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = QuoteSchema.parse(req.body);
    const quote = await prisma.quote.create({
      data: {
        ...data,
        status: (data.status as QuoteStatus) || 'PENDING',
      },
      include: { ticket: { include: { customer: true } } },
    });
    res.status(201).json(quote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

// PUT update quote
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = QuoteSchema.partial().parse(req.body);
    const quote = await prisma.quote.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(data.status && { status: data.status as QuoteStatus }),
      },
      include: { ticket: { include: { customer: true } } },
    });
    res.json(quote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// PATCH update quote status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = z.object({ status: z.enum(['PENDING', 'APPROVED', 'REJECTED']) }).parse(req.body);
    const quote = await prisma.quote.update({
      where: { id: req.params.id },
      data: { status: status as QuoteStatus },
      include: { ticket: { include: { customer: true } } },
    });
    res.json(quote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update quote status' });
  }
});

// DELETE quote
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.quote.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

export default router;
