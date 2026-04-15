# 🚀 JMS Digitall - Setup Completo

Sistema CRM completo para gerenciamento de atendimentos de reparo de computadores.

## 📋 Estrutura do Projeto

```
jms-digitall/
├── frontend/          # Aplicação React (Vite)
├── backend/          # API Node.js/Express
└── docs/
```

## 🔧 Instalação & Setup

### 1️⃣ Clonar e Instalar Frontend

```bash
# Instalar dependências
pnpm install

# Criar arquivo .env.local
echo 'VITE_API_URL=http://localhost:3000/api' > .env.local

# Iniciar servidor de desenvolvimento
pnpm dev
```

**Frontend rodará em:** `http://localhost:8080`

### 2️⃣ Configurar e Iniciar Backend

```bash
cd backend

# Instalar dependências
pnpm install

# Criar arquivo .env
cat > .env << 'EOF'
DATABASE_URL="postgres://postgres:nsLh'7Y8SR9\`@postgres_postgress:5432/jms_digitall?sslmode=disable"
PORT=3000
NODE_ENV=development
EOF
```

#### ⚠️ Nota Importante sobre PostgreSQL

O host ingresso `postgres_postgress:5432` é um **hostname interno do EasyPanel**. Ele funciona apenas:
- ✅ Dentro do EasyPanel (quando o backend estiver rodando como serviço)
- ✅ Dentro de um container Docker no mesmo serviço

Para desenvolvimento local, há duas opções:

**Opção A: Usar dados locais em desenvolvimento**
```bash
# O backend já está configurado para funcionar sem BD
# Se o BD não estiver acessível, ele usará dados em memória
pnpm dev
```

**Opção B: Usar PostgreSQL local para desenvolvimento**
```bash
# Instale PostgreSQL localmente e altere o .env para:
DATABASE_URL="postgres://postgres:senha@localhost:5432/jms_digitall"
```

### 3️⃣ Sincronizar Banco de Dados (quando acessível)

```bash
cd backend

# Push do schema para o banco de dados
pnpm db:push

# Ou criar uma migration
pnpm db:migrate

# Ver dados com Prisma Studio
pnpm db:studio
```

## 🌐 Acessar a Aplicação

1. **Frontend:** http://localhost:8080
2. **Backend API:** http://localhost:3000/api
3. **Health Check:** http://localhost:3000/health

### Dados de Demo

Para login, use qualquer credencial de teste (a autenticação está em modo demo).

## 📡 API Endpoints Disponíveis

### Clientes
```
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Atendimentos (Tickets)
```
GET     /api/tickets
POST    /api/tickets
GET     /api/tickets/:id
PUT     /api/tickets/:id
PATCH   /api/tickets/:id/status
DELETE  /api/tickets/:id
```

### Orçamentos (Quotes)
```
GET     /api/quotes
POST    /api/quotes
GET     /api/quotes/ticket/:ticketId
PUT     /api/quotes/:id
PATCH   /api/quotes/:id/status
DELETE  /api/quotes/:id
```

### Serviços
```
GET    /api/services
POST   /api/services
GET    /api/services/:id
PUT    /api/services/:id
DELETE /api/services/:id
```

## 🚀 Deploy no EasyPanel

### Passo 1: Git Push

```bash
git add .
git commit -m "Setup completo com backend"
git push
```

### Passo 2: Configurar Variáveis no EasyPanel

Adicione no painel do EasyPanel:
```
DATABASE_URL=postgres://postgres:nsLh'7Y8SR9`@postgres_postgress:5432/jms_digitall?sslmode=disable
PORT=3000
NODE_ENV=production
```

### Passo 3: Rodas Migrations

Dentro do container do backend:
```bash
cd backend
pnpm db:push
```

### Passo 4: Iniciar Serviços

O EasyPanel iniciará automaticamente:
- **Frontend:** (porta 3000 ou conforme configurado)
- **Backend:** (porta 3000)

## 🛠️ Troubleshooting

### ❌ Erro: "Can't reach database server"

**Causa:** Hostname `postgres_postgress` só funciona dentro do EasyPanel

**Solução:**
1. Em desenvolvimento: ignorar o erro, app funcionará com dados locais
2. Em produção: certificar que está rodando no EasyPanel
3. Ou: configurar PostgreSQL local (veja Opção B acima)

### ❌ Frontend não consegue conectar ao Backend

**Verificar:**
1. Backend está rodando? (`pnpm dev` no diretório backend)
2. `.env.local` tem a URL correta? (`VITE_API_URL=http://localhost:3000/api`)
3. Portas não estão ocupadas? (frontend:8080, backend:3000)

### ❌ Erros de tipo TypeScript no Backend

```bash
cd backend
npx tsc --noEmit  # Verificar erros
```

## 🔄 Workflow em Desenvolvimento

**Terminal 1 - Frontend:**
```bash
pnpm dev
```

**Terminal 2 - Backend:**
```bash
cd backend
pnpm dev
```

Ambos terão hot-reload automático durante edição.

## 📚 Estrutura do Backend

```
backend/
├── src/
│   ├── server.ts           # Servidor Express principal
│   ├── routes/
│   │   ├── customers.ts    # Rotas de clientes
│   │   ├── tickets.ts      # Rotas de atendimentos
│   │   ├── quotes.ts       # Rotas de orçamentos
│   │   └── services.ts     # Rotas de serviços
│   └── middleware/         # (futuro)
├── prisma/
│   └── schema.prisma       # Schema do banco de dados
├── .env                    # Variáveis de ambiente
└── package.json
```

## 📋 Tarefas Futuras

- [ ] Autenticação JWT
- [ ] Integração WhatsApp Business API
- [ ] Geração de PDF para orçamentos
- [ ] Agendamento automático
- [ ] Notificações por email
- [ ] Backup automático de dados

## ✉️ Suporte

Se encontrar problemas:
1. Verifique os logs do backend: `pnpm dev` mostra tudo
2. Verifique o console do navegador (F12)
3. Verifique a conexão do banco de dados no EasyPanel

---

**Desenvolvido com ❤️ para JMS Digitall**
