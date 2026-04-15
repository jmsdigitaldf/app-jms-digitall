import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import config from './config';
import routes from './routes';
import { errorMiddleware, notFoundMiddleware } from './middlewares';
import { logger } from './utils';

const app = express();

// ============================================
// SECURITY MIDDLEWARES
// ============================================

// Helmet for security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.server.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.maxRequests, // 100 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Muitas requisições, tente novamente mais tarde',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// ============================================
// BODY PARSING
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// LOGGING
// ============================================

app.use(
  pinoHttp({
    logger,
    reqCustomProps: (req) => ({
      userId: (req as Record<string, unknown>).user?.userId,
    }),
  })
);

// ============================================
// ROUTES
// ============================================

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'JMS Digital CRM API',
      version: '1.0.0',
      documentation: '/api/health',
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFoundMiddleware);

// Global error handler
app.use(errorMiddleware);

// ============================================
// SERVER STARTUP
// ============================================

const startServer = async () => {
  try {
    // Test database connection
    await import('./config/database').then((db) => db.prisma.$connect());
    logger.info('Database connection established');

    // Start server
    app.listen(config.server.port, () => {
      logger.info(
        { port: config.server.port, env: config.env },
        `🚀 Server running on port ${config.server.port} in ${config.env} mode`
      );
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, 'Received shutdown signal, closing server gracefully');
  
  try {
    await import('./config/database').then((db) => db.prisma.$disconnect());
    logger.info('Database connection closed');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during graceful shutdown');
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
startServer();

export default app;
