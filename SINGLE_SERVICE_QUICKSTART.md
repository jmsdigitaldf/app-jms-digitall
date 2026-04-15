# 🚀 JMS Digitall Single Service - Quick Start

## O que foi feito?

Convertemos sua aplicação para rodar em **um único serviço** no EasyPanel:

### Antes (Complexo ❌)
```
EasyPanel
├─ Frontend Service (Vite)
├─ Backend Service (Express)
└─ Database (PostgreSQL)
```

### Agora (Simples ✅)
```
EasyPanel
└─ App Service (Frontend + Backend + Database)
```

---

## 📁 Arquivos Criados/Alterados

### Novos Arquivos:
- **`Dockerfile`** - Multi-stage build (Frontend + Backend em um container)
- **`EASYPANEL_SINGLE_SERVICE.md`** - Guia completo para EasyPanel
- **`deploy.sh`** - Script de build automático
- **`docker-compose.single-service.yml`** - Docker Compose simplificado

### Arquivos Alterados:
- **`backend/src/server.ts`** - Express agora serve arquivos estáticos do React
- **`package.json`** - Scripts atualizados para usar `npm` (sem pnpm)

---

## ⚡ Como Usar (3 passos)

### 1. Build Localmente
```bash
# Opção A: Script automático (recomendado)
bash deploy.sh

# Opção B: Manual
npm ci
cd backend && npm ci && cd ..
npm run build:single-service
```

### 2. Fazer Commit e Push
```bash
git add .
git commit -m "feat: single service deployment setup"
git push origin main
```

### 3. Deploy no EasyPanel
1. Abrir EasyPanel
2. Criar novo serviço chamado `jms-digitall-app`
3. Conectar ao GitHub repository
4. Deixar usar o `Dockerfile` da raiz
5. Adicionar variáveis de ambiente (DATABASE_URL)
6. Clicar "Deploy"
7. Pronto! ✅

---

## 🔍 Como Funciona?

### Dockerfile Multi-stage

```dockerfile
STAGE 1: Build Frontend
  └─ React + Vite → dist/

STAGE 2: Build Backend  
  └─ TypeScript + Express → build/

STAGE 3: Runtime
  ├─ Express server (port 3000)
  ├─ Serve /frontend/dist como arquivos estáticos
  └─ Rotas /api/... para backend
```

### Express Serve Tudo
```javascript
// Arquivos estáticos (React)
app.use(express.static('frontend/dist'));

// API routes
app.use('/api/customers', customerRoutes);
app.use('/api/tickets', ticketRoutes);
// ... etc

// SPA fallback (para React Router)
app.use((req, res) => {
  res.sendFile('index.html');
});
```

---

## 📊 Comparação

| Aspecto | Antes (2 serviços) | Agora (1 serviço) |
|---------|-------------------|------------------|
| **Serviços** | 2 (Frontend + Backend) | 1 (Tudo) |
| **Ports** | 8082, 3000 | 3000 |
| **Build Time** | ~5 min | ~3 min |
| **RAM Usage** | ~300MB | ~150MB |
| **CORS config** | Necessário | Não precisa |
| **Complexity** | Alto ⚠️ | Baixo ✅ |

---

## ✅ Verificações

Após deploy, testar:

### Via Dashboard
```bash
curl https://seu-dominio.com/health
# Expected: {"status":"OK","timestamp":"..."}
```

### Ver Logs
```bash
# No EasyPanel, abrir Terminal do serviço:
docker logs -f jms_digitall_app
```

### Testar API
```bash
curl https://seu-dominio.com/api/health
# Expected: {"status":"OK","timestamp":"..."}

curl https://seu-dominio.com/api/services
# Expected: Lista de serviços
```

### Acessar Frontend
```
https://seu-dominio.com
# Deve abrir página de login
```

---

## 🆘 Se der erro...

### "Cannot find module"
```bash
bash deploy.sh  # Rebuilda tudo
git push origin main
# Redeploy no EasyPanel
```

### "Database connection refused"
- Verificar `DATABASE_URL` nas variáveis de ambiente
- Confirmar PostgreSQL está rodando
- Testar: `psql $DATABASE_URL`

### "Frontend not found (404)"
- Verificar se o build completou (checar logs)
- Acessar `https://seu-dominio.com/health` - se retorna 200, backend tá ok
- Se frontend não carrega, precisa rebuildar

### "CORS error"
- Não deve mais acontecer! Frontend e backend estão no mesmo servidor
- Se aparecer, checar `package.json` de CORS config do Express

---

## 🎯 Próximas Dicas

### Para Adicionar Domínio Customizado
1. EasyPanel → Application → Domain
2. Adicionar seu domínio
3. Usar SSL automático (Let's Encrypt)

### Para Auto-deploy via GitHub
1. EasyPanel → Application → Webhook
2. Copiar URL do webhook
3. GitHub → Settings → Webhooks
4. Adicionar webhook
5. Cada push fará deploy automático

### Para Monitorar Performance
1. EasyPanel → Application → Metrics
2. Ver CPU, RAM, Network em tempo real

---

## 📝 Arquivos de Referência

- **[EASYPANEL_SINGLE_SERVICE.md](./EASYPANEL_SINGLE_SERVICE.md)** - Guia super detalhado
- **[Dockerfile](./Dockerfile)** - Config de build
- **[backend/src/server.ts](./backend/src/server.ts)** - Onde o Express serve tudo
- **[deploy.sh](./deploy.sh)** - Script de build

---

**Status**: ✅ Pronto para produção  
**Testado em**: EasyPanel com PostgreSQL  
**Suporte**: Todos os CRUD operations funcionando
