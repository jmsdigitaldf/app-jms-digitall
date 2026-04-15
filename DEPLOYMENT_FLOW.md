# 🗺️ FLUXO VISUAL DE DEPLOYMENT

## 📊 Diagrama Completo

```
SEU COMPUTADOR                   GITHUB                      EASYPANEL
┌──────────────────┐      ┌─────────────────┐      ┌────────────────────┐
│                  │      │                 │      │                    │
│  Código Local    │──git push──>  main    │──────>│  Build Pipeline    │
│                  │      │   repository    │      │                    │
│  (src/, backend/)│      │                 │      │  ┌──────────────┐  │
│                  │      │                 │      │  │ cd backend   │  │
└──────────────────┘      │ ✅ Commit       │      │  │ pnpm build   │  │
                          │    OK            │      │  └──────────────┘  │
                          │                 │      │         ↓           │
                          └─────────────────┘      │  ┌──────────────┐  │
                                                   │  │ pnpm build   │  │
                                                   │  │ (frontend)   │  │
                                                   │  └──────────────┘  │
                                                   │         ↓           │
                                                   │   DEPLOY ✅        │
                                                   │                    │
                                                   └────────────────────┘
                                                             ↓
                                    ┌────────────────────────────────────────┐
                                    │          SEU SITE EM PRODUÇÃO         │
                                    │                                        │
                                    │  ┌─────────────────────────────────┐  │
                                    │  │  Frontend (React/Vite)          │  │
                                    │  │  https://seu-dominio.com        │  │
                                    │  └────────────┬────────────────────┘  │
                                    │               │ (chama API)            │
                                    │  ┌────────────▼────────────────────┐  │
                                    │  │  Backend (Express/Node)         │  │
                                    │  │  https://seu-backend-xxx...io   │  │
                                    │  └────────────┬────────────────────┘  │
                                    │               │ (consulta dados)       │
                                    │  ┌────────────▼────────────────────┐  │
                                    │  │  PostgreSQL Database            │  │
                                    │  │  161.97.111.53:5432             │  │
                                    │  └─────────────────────────────────┘  │
                                    │                                        │
                                    └────────────────────────────────────────┘
```

---

## 🚀 Sequência Passo a Passo

```
PASSO 1: Criar Backend Service
┌─────────────────────────────────────────┐
│ 1. EasyPanel → + New Project             │
│ 2. Connect GitHub → Select repository   │
│ 3. Create Backend Service               │
│    • Name: jms-digitall-backend         │
│    • Build: cd backend && pnpm build    │
│    • Start: cd backend && node dist...  │
│ 4. Environment Variables (11 vars)      │
│ 5. [Deploy] → ⏳ Building...            │
│    Aguarde → ✅ Healthy                 │
└─────────────────────────────────────────┘
                    ↓

PASSO 2: Obter URL do Backend
┌─────────────────────────────────────────┐
│ Backend Service → Public URL             │
│ Copie: https://seu-backend-xxxxx...io  │
│ Você usará isso no PASSO 3               │
└─────────────────────────────────────────┘
                    ↓

PASSO 3: Criar Frontend Service
┌─────────────────────────────────────────┐
│ 1. Backend Service → + Add Service      │
│ 2. Create Frontend Service              │
│    • Name: jms-digitall-frontend        │
│    • Build: pnpm install && build       │
│    • Start: pnpm preview                │
│ 3. Environment Variables (1 var)        │
│    VITE_API_URL = URL do backend + /api │
│ 4. [Deploy] → ⏳ Building...            │
│    Aguarde → ✅ Healthy                 │
└─────────────────────────────────────────┘
                    ↓

PASSO 4: Rodar Seeds (Dados Iniciais)
┌─────────────────────────────────────────┐
│ 1. Backend Service → Terminal            │
│ 2. npx prisma db push                   │
│ 3. npm run db:seed                      │
│    ✅ Seed concluído com sucesso!       │
└─────────────────────────────────────────┘
                    ↓

PASSO 5: Testar
┌─────────────────────────────────────────┐
│ 1. Abre: https://seu-dominio.com        │
│ 2. Vê página de login                   │
│ 3. Faz login                            │
│ 4. Dashboard carrega dados do backend   │
│    ✅ TUDO FUNCIONANDO!                 │
└─────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Update (Auto-Deploy)

```
Você faz alteração local:
┌────────────────────────────┐
│ 1. Edita arquivo (ex: fix) │
│ 2. git add .               │
│ 3. git commit -m "fix: ..." │
│ 4. git push origin main    │
└────────────────────────────┘
            │
            ↓
    GitHub recebe (main)
            │
            ↓
EasyPanel Webhook dispara
            │
            ↓
┌────────────────────────────┐
│ 1. Git pull               │
│ 2. Backend build           │
│ 3. Frontend build          │
│ 4. Deploy automático       │
│ 5. Em produção! (5 min)    │
└────────────────────────────┘
```

---

## 📍 Locais Importantes no EasyPanel

```
Dashboard
│
├─ Projects
│  │
│  └─ jms-digitall-crm
│     │
│     ├─ jms-digitall-backend
│     │  ├─ Environment      ← Editar variáveis
│     │  ├─ Logs             ← Ver erros
│     │  ├─ Terminal         ← Rodar npm commands
│     │  ├─ Domains          ← Adicionar domínio
│     │  ├─ Deploy History   ← Ver histórico de deploys
│     │  └─ Redeploy         ← Forçar deploy
│     │
│     └─ jms-digitall-frontend
│        ├─ Environment      ← Editar VITE_API_URL
│        ├─ Logs             ← Ver erros
│        ├─ Domains          ← Adicionar domínio
│        ├─ Deploy History   ← Ver histórico
│        └─ Redeploy         ← Forçar deploy
│
└─ Settings
   ├─ Webhooks              ← Auto-deploy
   ├─ Team Members
   └─ Billing
```

---

## 🔌 Conexões (Diagrama Técnico)

```
┌────────────────────────────────────────────────────────────────┐
│                        Frontend                                │
│                  (React + Vite)                                │
│            https://seu-dominio.com                            │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Login Page                                          │    │
│  │  Dashboard                                           │    │
│  │  Clientes, Atendimentos, Orçamentos, Serviços      │    │
│  │                                                      │    │
│  │  useEffect(() => {                                  │    │
│  │    axios.get(VITE_API_URL + "/customers")          │    │
│  │  })                                                  │    │
│  └──────────────────┬───────────────────────────────────┘    │
└─────────────────────┼──────────────────────────────────────────┘
                      │ HTTP Request
                      │ GET /api/customers
                      │ POST /api/tickets
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API                                │
│                  (Express + Node.js)                            │
│        https://seu-backend-xxxxx.easypanel.io                 │
│                    PORT 3000                                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  REST API Endpoints                                  │     │
│  │  GET    /api/customers                               │     │
│  │  POST   /api/customers                               │     │
│  │  PUT    /api/customers/:id                           │     │
│  │  DELETE /api/customers/:id                           │     │
│  │  GET    /api/tickets                                 │     │
│  │  POST   /api/tickets                                 │     │
│  │  ...                                                 │     │
│  │  GET    /api/health                                  │     │
│  │                                                      │     │
│  │  Prisma ORM                                          │     │
│  └──────────────────┬───────────────────────────────────┘     │
└─────────────────────┼──────────────────────────────────────────┘
                      │ SQL Query
                      │ SELECT * FROM Customer
                      │ INSERT INTO Ticket VALUES (...)
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                           │
│                                                                 │
│  Host:  161.97.111.53                                          │
│  Port:  5432                                                    │
│  Database: jms_digitall                                        │
│                                                                 │
│  Tables:                                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐           │
│  │  Customer   │  │   Ticket    │  │    Quote     │           │
│  ├─────────────┤  ├─────────────┤  ├──────────────┤           │
│  │ id          │  │ id          │  │ id           │           │
│  │ name        │  │ customerId  │  │ ticketId     │           │
│  │ email       │  │ protocol    │  │ service      │           │
│  │ phone       │  │ status      │  │ price        │           │
│  │ ...         │  │ deviceType  │  │ status       │           │
│  └─────────────┘  │ ...         │  │ ...          │           │
│                   └─────────────┘  └──────────────┘           │
│  ┌─────────────┐  ┌─────────────┐                             │
│  │   Service   │  │    User     │                             │
│  ├─────────────┤  ├─────────────┤                             │
│  │ id          │  │ id          │                             │
│  │ name        │  │ email       │                             │
│  │ category    │  │ password    │                             │
│  │ description │  │ role        │                             │
│  │ price       │  │ ...         │                             │
│  └─────────────┘  └─────────────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Checklist Paralelo (O que fazer quando)

```
DURANTE BUILD (EasyPanel)
✅ Variáveis configuradas corretamente?
✅ Build command está certo?
✅ Start command aponta para arquivo certo?

APÓS BUILD (Backend)
✅ Status = Healthy?
✅ Health check responde?
✅ Logs não mostram erros?

APÓS BUILD (Frontend)
✅ Status = Healthy?
✅ Public URL exibe?
✅ VITE_API_URL = Backend URL + /api?

APÓS TUDO PRONTO
✅ Abre frontend URL no navegador
✅ Vê página de login?
✅ Consegue fazer login?
✅ Dashboard carrega dados?
✅ Sem erros no console (F12)?
```

---

## 🚨 Status Esperados

```
BACKEND Service
┌──────────────────────────────────┐
│ Status: ✅ Healthy               │
│ Build: ✅ Done                   │
│ Health Check: ✅ Passing         │
│ Public URL: https://xxx...io     │
└──────────────────────────────────┘

FRONTEND Service
┌──────────────────────────────────┐
│ Status: ✅ Healthy               │
│ Build: ✅ Done                   │
│ Domains: seu-dominio.com         │
│ Public URL: https://seu-dominio  │
└──────────────────────────────────┘
```

---

Agora abra **[EASYPANEL_STEP_BY_STEP.md](./EASYPANEL_STEP_BY_STEP.md)** e siga o passo a passo! 🚀
