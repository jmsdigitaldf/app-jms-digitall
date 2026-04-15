# 🎯 JMS Digitall - Single Service: PRONTO PARA PRODUÇÃO

## ✅ Status Atual

```
✅ Frontend:   Build completo em frontend/dist/
✅ Backend:    Build completo em backend/dist/
✅ Dockerfile: Multi-stage configurado
✅ Docker Compose: Simplificado com 1 serviço
✅ Scripts:    npm run build:single-service funciona
✅ Express:    Servindo frontend + API
```

---

## 🚀 Como Fazer Deploy Agora no EasyPanel

### Passo 1: Git Commit & Push

```bash
git add .
git commit -m "feat: single service deployment ready"
git push origin main
```

### Passo 2: Criar Serviço no EasyPanel

**URL**: https://seu-easypanel.com

1. Go to **Applications**
2. Click **+ New Application**  
3. Select **Docker**
4. Fill:
   - **Name**: `jms-digitall-app`
   - **Repository**: `https://github.com/SEU_USER/jms-digitall.git`
   - **Branch**: `main`
   - **Dockerfile Location**: `/Dockerfile`

5. **Port**: `3000`

### Passo 3: Environment Variables

Adicione no EasyPanel:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:SEU_PASSWORD@postgres:5432/jms_digitall
```

### Passo 4: Deploy!

Click **Deploy** ou **Build & Deploy**

⏳ Espere 5-7 minutos para:
- Build frontend (Vite)
- Build backend (TypeScript)
- Start aplicação

---

## 📊 O Que Mudou

### Antes (Complexo ❌)
```
2 Serviços:
- Frontend Service (Vite) → Port 8082
- Backend Service (Express+Node) → Port 3000
- Banco de dados separado
```

### Agora (Simples ✅)
```
1 Serviço:
- Backend Express serve TUDO → Port 3000
  ├─ /api/...  (rotas JSON)
  ├─ /        (React SPA)
  └─ /health  (health check)
```

---

## 🔧 Arquivos-Chave

### [Dockerfile](./Dockerfile)
```dockerfile
# STAGE 1: Build Frontend (Vite)
FROM node:20-alpine AS frontend-builder
# ... builds React app to dist/

# STAGE 2: Build Backend (TypeScript)
FROM node:20-alpine AS backend-builder  
# ... compiles TS to JS

# STAGE 3: Runtime (Final image)
FROM node:20-alpine
# Copia ambos frontend + backend
# CMD node backend/dist/server.js
```

### [backend/src/server.ts](./backend/src/server.ts)
```typescript
// Serve arquivos estáticos do frontend
app.use(express.static('frontend/dist'));

// Rotas API
app.use('/api/customers', customerRoutes);
app.use('/api/tickets', ticketRoutes);
// ...

// SPA Fallback (importante para React Router)
app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile('frontend/dist/index.html');
  }
});
```

### [vite.config.ts](./vite.config.ts)
```typescript
build: {
  outDir: './frontend/dist', // Cria frontend/dist/
},
```

### [package.json](./package.json)
```json
{
  "scripts": {
    "build:single-service": "npm run build:all",
    "build:all": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "npm run build"
  }
}
```

---

## 🧪 Teste Localmente (Opcional)

```bash
# Build
npm run build:single-service

# Rodar backend (servirá frontend também)
cd backend
npm start
# Abrirá em http://localhost:3000

# Teste:
curl http://localhost:3000/health
# Esperado: {"status":"OK","timestamp":"..."}

# Acesse:
http://localhost:3000
# Deve carregar a página de login
```

---

## 📋 Checklist Antes de Deploy

- [ ] Commit e push feito
- [ ] Repo GitHub está atualizado
- [ ] EasyPanel conectado ao GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Dockerfile apontando para / (raiz)

---

## 🎯 Fluxo na Produção

```
User abre: https://seu-dominio.com
          ↓
  Express recebe requisição (Port 3000)
          ↓
  ├─ Se /api/... → Processa JSON (Rotas)
  ├─ Se /health → Retorna status
  └─ Caso contrário → Serve index.html
          ↓
  React Router toma conta (SPA Magic!)
          ↓
  Frontend chama:  /api/customers, /api/tickets, etc
          ↓
  Express retorna JSON
          ↓
  React renderiza no browser
```

---

## 🆘 Se der erro...

### "Cannot GET /"
- Verificar se `frontend/dist/index.html` existe
- Acessar `/health` para confirmar que Express tá ok

### "Cannot GET /api/..."
- Verificar se rotas estão registradas em server.ts
- Checar se tipo de rota (GET, POST, etc) está correto
- Logs: `docker logs jms_digitall_app`

### "Database connection refused"
- Confirmar `DATABASE_URL` está correto
- PostgreSQL está rodando
- Testar: `psql $DATABASE_URL`

### "Build failed"
- Checar logs EasyPanel
- Common: dependências faltando
- Solução: `npm ci` em vez de `npm install`

---

## 📈 Próximos Passos (Opcional)

### Domínio Customizado
1. EasyPanel → App → Domain
2. Adicionar seu domínio
3. SSL automático ✅

### Auto-Deploy via GitHub
1. EasyPanel → Webhook
2. Copiar URL
3. GitHub Settings → Webhooks
4. Pronto!

### Monitoramento
1. EasyPanel → Metrics
2. Ver CPU, RAM, Network em tempo real

---

## 📞 Resumo Final

✨ **Uma imagem Docker. Um comando para servir frontend + backend + API.**

Simples, eficiente, pronto para produção.

**Deploy em 5 minutos. ⚡**

---

**Tecnologias**:
- Node.js 20
- React 18
- Express.js
- PostgreSQL
- Docker
- EasyPanel

**Última atualização**: Abril 2026  
**Status**: ✅ Production Ready
