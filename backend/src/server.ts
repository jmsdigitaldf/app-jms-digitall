import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

// Rotas
import customerRoutes from './routes/customers.js';
import ticketRoutes from './routes/tickets.js';
import quoteRoutes from './routes/quotes.js';
import serviceRoutes from './routes/services.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ESM path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (dist)
const publicPath = path.join(__dirname, '../../frontend/dist');
console.log(`📁 Serving static files from: ${publicPath}`);
app.use(express.static(publicPath));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({ error: 'Database error', message: err.message });
  }
  
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/customers', customerRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/services', serviceRoutes);

// SPA fallback - serve index.html para rotas não encontradas na API
// Isso permite que o React Router funcione corretamente
app.use((req: Request, res: Response) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(__dirname, '../../frontend/dist/index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).json({ error: 'File not found' });
      }
    });
  }
  res.status(404).json({ error: 'Route not found' });
});

// Iniciar servidor
async function startServer() {
  try {
    // Testar conexão com banco de dados (não-bloqueante)
    prisma.$connect()
      .then(() => console.log('✅ Database connected successfully'))
      .catch((error) => {
        console.warn('⚠️  Database not available - using in-memory data');
        console.warn('  Error:', error.message);
      });

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
