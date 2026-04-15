# ============ STAGE 1: Build Frontend ============
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY frontend/ ./

# Instalar dependências com npm ci (determinístico para CI/CD)
RUN npm ci

# Build do Vite
RUN npm run build

# ============ STAGE 2: Build Backend ============
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copiar apenas os arquivos que existem
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json backend/pnpm-lock.yaml ./
COPY backend/ ./

# Instalar dependências
RUN npm ci

# Build TypeScript backend
RUN npm run build

# ============ STAGE 3: Runtime ============
FROM node:20-alpine

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Instalar apenas dependências de produção
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json backend/pnpm-lock.yaml ./backend/

RUN npm ci --only=production

# Copiar backend compilado
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/src ./backend/src
COPY backend/.env* ./backend/

# Copiar frontend compilado (dist) para ser servido pelo backend
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Se houver prisma schema
COPY backend/prisma ./backend/prisma/

# Expo rtar porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Iniciar aplicação
WORKDIR /app/backend
CMD ["node", "dist/server.js"]
