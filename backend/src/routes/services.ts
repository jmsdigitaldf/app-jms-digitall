import { Router, Request, Response } from 'express';
import { prisma } from '../server.js';
import { z } from 'zod';

const router: Router = Router();

const ServiceSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  description: z.string().optional(),
  priceMin: z.number().positive(),
  priceMax: z.number().positive(),
  estimatedTime: z.string().optional(),
  isActive: z.boolean().default(true),
});

// GET all services
router.get('/', async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET service by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// POST create service
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = ServiceSchema.parse(req.body);
    const service = await prisma.service.create({
      data,
    });
    res.status(201).json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// PUT update service
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = ServiceSchema.partial().parse(req.body);
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data,
    });
    res.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE service
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.service.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
