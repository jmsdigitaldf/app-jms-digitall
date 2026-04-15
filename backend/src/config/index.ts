import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
    phoneId: process.env.WHATSAPP_PHONE_ID || '',
    businessId: process.env.WHATSAPP_BUSINESS_ID || '',
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

export default config;
