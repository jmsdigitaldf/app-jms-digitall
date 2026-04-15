# 🎯 REFERÊNCIA RÁPIDA: Deploy EasyPanel

## 1️⃣ Conectar GitHub

```
EasyPanel Dashboard
    ↓
[+ New Project] ou [+ Create]
    ↓
[Import from Git]
    ↓
[Connect GitHub] → Selecione repositório → Branch: main
    ↓
✅ Continue
```

---

## 2️⃣ Backend Service

### Criação
```
Service Name:      jms-digitall-backend
Framework:         Node.js
Build Command:     cd backend && pnpm install && pnpm build
Start Command:     cd backend && node dist/server.js
Port:              3000
Health Check:      /health
```

### Variáveis de Ambiente (21 linhas)

Copie e cole no EasyPanel:

```env
DATABASE_URL=postgresql://user:senha@161.97.111.53:5432/jms_digitall?schema=public
NODE_ENV=production
PORT=3000
JWT_SECRET=(gere com: openssl rand -base64 32)
JWT_REFRESH_SECRET=(gere outro valor)
FRONTEND_URL=https://seu-dominio.com
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
WHATSAPP_TOKEN=futura-integracao
WHATSAPP_VERIFY_TOKEN=futura-integracao
WHATSAPP_PHONE_ID=futura-integracao
WHATSAPP_BUSINESS_ID=futura-integracao
OPENAI_API_KEY=futura-integracao
```

### Deploy
```
[Deploy] → Aguarde 3-5 min → ✅ Healthy
```

---

## 3️⃣ Frontend Service

### Criação
```
Service Name:      jms-digitall-frontend
Framework:         Node.js
Build Command:     pnpm install && pnpm build
Start Command:     pnpm preview
Port:              (deixe automático ou 3000)
```

### Variáveis de Ambiente

```env
VITE_API_URL=https://seu-backend-xxxxx.easypanel.io/api
```

**⚠️ Substitua `seu-backend-xxxxx` pela URL real do seu backend!**

### Deploy
```
[Deploy] → Aguarde 2-3 min → ✅ Healthy
```

---

## 4️⃣ Testar Conectividade

### Health Check
```
Backend: https://seu-backend-xxxxx.easypanel.io/api/health
✅ Response: {"status":"ok","timestamp":"..."}
```

### CRUD Test
1. Abre Frontend: https://seu-dominio.com
2. Faz login
3. Acessa Dashboard ou Clientes
4. Dados devem carregar de backend

**Se erro CORS:**
- Edita Backend → Environment
- Atualiza `CORS_ORIGIN` com domínio correto
- Clica Redeploy

---

## 5️⃣ Seeds (Dados Iniciais)

No EasyPanel, acesse Terminal do Backend:

```bash
# Sincronizar schema
npx prisma db push

# Popular dados iniciais
npm run db:seed
```

Verá:
```
✅ Criado serviço: Troca de Tela
✅ Criado serviço: Troca de Bateria
... (10 serviços)
✨ Seed concluído com sucesso!
```

---

## 6️⃣ Auto-Deploy (GitHub Webhook)

### No EasyPanel
```
Project Settings → Webhooks → [Auto-deploy on push]
Copie URL (se necessário)
```

### No GitHub (se necessário)
```
Repositório → Settings → Webhooks → [Add webhook]
Cole URL do EasyPanel
Event: Push events
[Add webhook]
```

---

## 📌 Checklist Rápido

```
✅ Backend service criado
✅ Frontend service criado
✅ DATABASE_URL = postgresql://...
✅ JWT_SECRET = valor aleatório
✅ VITE_API_URL = backend URL correto
✅ CORS_ORIGIN = seu domínio
✅ Backend status = Healthy
✅ Frontend status = Healthy
✅ Health check respondendo
✅ Login funciona
✅ Dashboard carrega dados
✅ Webhook GitHub ativo
```

---

## 🚨 Erros Comuns & Soluções

| Erro | Solução |
|------|---------|
| Backend não heals | Verificar DATABASE_URL, rodar `npx prisma db push` |
| CORS error | Atualizar `CORS_ORIGIN`, redeploy backend |
| Build falha | Verificar Build Command, limpar cache, novo push |
| Frontend branco | Abrir DevTools (F12), verificar console |
| Seed falha | Deletar dados, tentar novamente ou editar seed |
| Timeout | Aumentar timeout do health check a 30s |

---

## 💡 Pro Tips

1. **Copiando Variáveis:** Use [.env.production.example](./backend/.env.production.example) como template
2. **JWT Secrets:** Gere valores diferentes, não reutilize!
3. **Domínios:** Propagação DNS leva 5-30 min, seja paciente
4. **Logs:** Sempre clique em "Logs" quando algo falhar
5. **Redeploy:** Menu do serviço → Redeploy (sem git push)

---

## 🔗 Guias Completos

- **[EASYPANEL_STEP_BY_STEP.md](./EASYPANEL_STEP_BY_STEP.md)** ← Leia isto AGORA
- **[DEPLOY.md](./DEPLOY.md)** ← Detalhes adicionais
- **[backend/.env.production.example](./backend/.env.production.example)** ← Template variáveis

---

## 📞 Precisa de Ajuda?

1. Leia [EASYPANEL_STEP_BY_STEP.md](./EASYPANEL_STEP_BY_STEP.md)
2. Verifique "Erros Comuns" acima
3. Abra DevTools nel navegador (F12)
4. Veja logs no EasyPanel (botão Logs)
5. Tente redeploy (botão Redeploy do serviço)

---

Boa sorte! 🚀
