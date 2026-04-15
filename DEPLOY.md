# 🚀 Guia de Deploy - JMS Digitall CRM

## Pré-requisitos
- Node.js 22.21.0 (use `nvm use` para ativar)
- pnpm
- PostgreSQL 16+
- Git

## 1️⃣ Preparação Local

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.production
# Editar .env.production com seus valores
```

## 2️⃣ Build para Produção

```bash
# Build completo (backend + frontend)
pnpm build:all

# Ou separadamente:
pnpm build:backend  # Build backend
pnpm build:frontend # Build frontend Vite
```

## 3️⃣ Deploy no EasyPanel

### **Backend (Express API)**

1. **Conectar Repositório GitHub**
   - URL: `https://github.com/seu-usuario/jms-digitall-crm`
   - Branch: `main`

2. **Build Configuration**
   - **Build Command:** `cd backend && pnpm install && pnpm build`
   - **Start Command:** `cd backend && node dist/server.js`
   - **Output Directory:** `backend/dist`

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://user:password@161.97.111.53:5432/jms_digitall
   FRONTEND_URL=https://seu-dominio.com
   JWT_SECRET=valor-aleatorio-seguro
   JWT_REFRESH_SECRET=outro-valor-aleatorio-seguro
   CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com
   ```

4. **Health Check**
   - URL: `/health`

### **Frontend (React + Vite)**

1. **Build Configuration**
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm preview`
   - **Output Directory:** `dist`

2. **Environment Variables**
   ```
   VITE_API_URL=https://seu-backend-url.easypanel.io/api
   ```

3. **Deploy Automático**
   - Ativar Webhook do GitHub para deploy automático ao fazer push em `main`

## 4️⃣ Configurar Domínio no EasyPanel

1. Adicionar domínio ao seu projeto
2. Configurar SSL/TLS automático (Let's Encrypt)
3. Configurar redirect HTTP → HTTPS

## 5️⃣ Setup do Database

```bash
# Connect ao banco em produção
export DATABASE_URL="postgresql://user:password@161.97.111.53:5432/jms_digitall"

# Rodar migrations
pnpm db:push

# Seed inicial (se necessário)
pnpm db:seed
```

## 6️⃣ Checklist Final

- [ ] Repository no GitHub com todos os commits
- [ ] `.env.production` configurado no EasyPanel
- [ ] Database URL apontando para PostgreSQL correto
- [ ] Backend compilando sem erros
- [ ] Frontend compilando sem erros  
- [ ] CORS configurado com domínios corretos
- [ ] JWT secrets gerados aleatorios
- [ ] SSL/TLS ativado
- [ ] Webhook GitHub configurado para auto-deploy
- [ ] Health check respondendo
- [ ] API respondendo em `/api/health`

## 🔄 Deploy Automático

Depois de configurado, qualquer push em `main` vai triggerar:
1. Build do backend
2. Build do frontend
3. Deploy automático

## 📋 Estrutura de Deploy

```
EasyPanel (seu-backend-url.easypanel.io)
├── Backend (Node.js + Express)
│   ├── PORT: 3000
│   └── Database: PostgreSQL 161.97.111.53:5432
└── Frontend (nginx)
    ├── PORT: 80
    └── SPA Routing configurado

Custom Domain
├── seu-dominio.com → Frontend
└── api.seu-dominio.com → Backend (opcional)
```

## 🆘 Troubleshooting

**Build falha no backend:**
```bash
# Limpar node_modules
rm -rf backend/node_modules pnpm-lock.yaml
pnpm install
```

**Database connection error:**
```bash
# Verificar DATABASE_URL
psql $DATABASE_URL

# Rodar migrations
pnpm db:push
```

**Frontend não conecta na API:**
- Verificar `VITE_API_URL` do frontend
- Verificar CORS no backend (variável `CORS_ORIGIN`)
- Checar console do navegador (F12)

## 📞 Contato/Suporte

Em caso de problemas, verifique:
1. Logs do EasyPanel
2. Console do navegador (DevTools)
3. Backend logs (conectar via SSH ao EasyPanel)
