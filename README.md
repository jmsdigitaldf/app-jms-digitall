# JMS Digital CRM 🚀

Sistema completo de gestão para assistência técnica de computadores e laptops com automação via IA.

## 📋 Sobre o Projeto

O **JMS Digital CRM** é uma plataforma SaaS enterprise-grade desenvolvida para:

- 📱 Atendimento automatizado via WhatsApp Business API
- 🤖 Geração inteligente de orçamentos com IA
- 👥 Gestão completa de clientes e atendimentos
- 📊 Dashboard com métricas em tempo real
- 🔐 Sistema de autenticação seguro com JWT

### Stack Tecnológica

**Backend:**
- Node.js 20+ com TypeScript
- Express.js
- PostgreSQL 17 com Prisma ORM
- JWT para autenticação
- Zod para validação
- Pino para logging estruturado

**Frontend:**
- React 18+ com TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Query para cache
- Zustand para estado global
- React Hook Form + Zod

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- npm 9+
- PostgreSQL 17 (ou Docker)
- Git

### Opção 1: Desenvolvimento Local

```bash
# 1. Clonar repositório
git clone <repository-url>
cd jms-digital-crm

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Iniciar banco de dados (Docker)
docker-compose up -d postgres

# 5. Rodar migrations
cd backend
npm run db:generate
npm run db:migrate

# 6. Iniciar aplicação
cd ..
npm run dev
```

Acesse:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Opção 2: Docker Compose (Recomendado)

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 📁 Estrutura do Projeto

```
jms-digital-crm/
├── backend/
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── controllers/    # Controladores HTTP
│   │   ├── services/       # Regras de negócio
│   │   ├── repositories/   # Acesso a dados
│   │   ├── middlewares/    # Auth, validação, errors
│   │   ├── routes/         # Rotas da API
│   │   ├── schemas/        # Validações Zod
│   │   ├── types/          # Tipos TypeScript
│   │   ├── utils/          # Funções auxiliares
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── ui/         # Componentes base
│   │   │   └── layout/     # Layout components
│   │   ├── pages/          # Páginas
│   │   ├── services/       # API calls
│   │   ├── stores/         # Zustand stores
│   │   ├── types/          # Tipos TypeScript
│   │   ├── lib/            # Configurações
│   │   └── App.tsx
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## 🔐 Autenticação

O sistema utiliza JWT com refresh tokens:

- **Access Token:** 7 dias de validade
- **Refresh Token:** 30 dias de validade
- **Hash:** bcrypt com 12 rounds

### Usuário Admin Padrão

Após rodar as migrations, crie um usuário admin:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@jmsdigital.com",
    "password": "Admin@123",
    "role": "ADMIN"
  }'
```

## 📊 Modelagem do Banco

### Principais Entidades

- **User:** Usuários do sistema
- **Customer:** Clientes
- **Ticket:** Atendimentos
- **Quote:** Orçamentos
- **Service:** Serviços disponíveis
- **Part:** Peças em estoque

Veja o schema completo em `backend/prisma/schema.prisma`.

## 🤖 Integração com IA

O sistema inclui um serviço de IA para:

1. **Análise de Mensagens:** Identifica o tipo de problema
2. **Geração de Orçamentos:** Cria orçamentos automáticos
3. **Classificação:** Prioriza atendimentos

### Configurar IA (Opcional)

```bash
# backend/.env
OPENAI_API_KEY=sk-...
```

O sistema funciona sem IA usando regras baseadas em palavras-chave.

## 📱 WhatsApp Webhook

### Configurar WhatsApp Cloud API

1. Acesse [Meta Developers](https://developers.facebook.com/)
2. Crie um app WhatsApp
3. Obtenha as credenciais
4. Configure no `.env`:

```bash
WHATSAPP_TOKEN=your-token
WHATSAPP_VERIFY_TOKEN=your-verify-token
WHATSAPP_PHONE_ID=your-phone-id
WHATSAPP_BUSINESS_ID=your-business-id
```

### Webhook URL

```
https://your-domain.com/api/webhooks/whatsapp
```

## 📖 API Documentation

### Endpoints Principais

#### Auth
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Perfil atual

#### Customers
- `GET /api/customers` - Listar clientes
- `GET /api/customers/:id` - Buscar cliente
- `POST /api/customers` - Criar cliente
- `PUT /api/customers/:id` - Atualizar cliente
- `DELETE /api/customers/:id` - Deletar cliente

#### Tickets
- `GET /api/tickets` - Listar atendimentos
- `GET /api/tickets/:id` - Buscar atendimento
- `POST /api/tickets` - Criar atendimento
- `PATCH /api/tickets/:id/status` - Atualizar status
- `PATCH /api/tickets/:id/assign` - Atribuir técnico

#### Quotes
- `GET /api/quotes` - Listar orçamentos
- `POST /api/quotes` - Criar orçamento
- `POST /api/quotes/:id/approve` - Aprovar orçamento
- `POST /api/quotes/:id/reject` - Rejeitar orçamento

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run test
```

## 📝 Scripts Disponíveis

### Root
```bash
npm run dev          # Inicia backend + frontend
npm run build        # Build de produção
npm run lint         # Lint em todos os projetos
```

### Backend
```bash
npm run dev          # Development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run db:migrate   # Rodar migrations
npm run db:seed      # Seed inicial
npm run db:studio    # Prisma Studio
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Build produção
npm run preview      # Preview build
npm run lint         # ESLint
```

## 🔒 Segurança

- ✅ Helmet.js para headers HTTP seguros
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configurado
- ✅ Validação de inputs com Zod
- ✅ JWT com refresh tokens
- ✅ Hash de senhas com bcrypt
- ✅ Logs estruturados
- ✅ Tratamento global de erros

## 🚀 Deploy

### Variáveis de Ambiente de Produção

```bash
# Backend
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
FRONTEND_URL=https://seu-domínio.com
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Próximos Recursos

- [ ] Multi-tenancy (SaaS multi-empresa)
- [ ] Geração de PDF de orçamentos
- [ ] Sistema de notificações (email/push)
- [ ] Analytics e relatórios avançados
- [ ] Integração com pagamentos
- [ ] API pública (Swagger)
- [ ] Testes automatizados
- [ ] CI/CD pipeline

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Open um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Equipe

Desenvolvido por **JMS Digital**

---

**Suporte:** suporte@jmsdigital.com

**Documentação:** https://docs.jmsdigital.com
