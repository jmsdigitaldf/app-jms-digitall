import { Router } from 'express';
import authRoutes from './auth.routes';
import customerRoutes from './customer.routes';
import ticketRoutes from './ticket.routes';
import quoteRoutes from './quote.routes';
import webhookRoutes from './webhook.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/tickets', ticketRoutes);
router.use('/quotes', quoteRoutes);

// Webhook routes (public)
router.use('/webhooks', webhookRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

export default router;
