# JMS Digitall Backend

Backend API para o CRM JMS Digitall construído com Express, Prisma e PostgreSQL.

## 🚀 Começar em Desenvolvimento

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do backend com:

```env
DATABASE_URL="postgres://postgres:nsLh'7Y8SR9\`@postgres_postgress:5432/jms_digitall?sslmode=disable"
PORT=3000
NODE_ENV=development
```

### 3. Sincronizar Banco de Dados
Quando estiver no EasyPanel ou com o banco acessível:

```bash
pnpm db:push
```

Para criar uma migration:
```bash
pnpm db:migrate
```

Para gerar o cliente Prisma:
```bash
pnpm db:generate
```

### 4. Iniciar o Servidor

**Desenvolvimento (com auto-reload):**
```bash
pnpm dev
```

O servidor estará em `http://localhost:3000`

**Produção:**
```bash
pnpm build
pnpm start
```

## 📚 API Endpoints

### Customers (Clientes)
- `GET /api/customers` - Listar todos os clientes
- `GET /api/customers/:id` - Obter cliente específico
- `POST /api/customers` - Criar novo cliente
- `PUT /api/customers/:id` - Atualizar cliente
- `DELETE /api/customers/:id` - Deletar cliente

### Tickets (Atendimentos)
- `GET /api/tickets` - Listar todos os atendimentos
- `GET /api/tickets/:id` - Obter atendimento específico
- `POST /api/tickets` - Criar novo atendimento
- `PUT /api/tickets/:id` - Atualizar atendimento
- `PATCH /api/tickets/:id/status` - Atualizar status do atendimento
- `DELETE /api/tickets/:id` - Deletar atendimento

### Quotes (Orçamentos)
- `GET /api/quotes` - Listar todos os orçamentos
- `GET /api/quotes/ticket/:ticketId` - Obter orçamentos de um atendimento
- `POST /api/quotes` - Criar novo orçamento
- `PUT /api/quotes/:id` - Atualizar orçamento
- `PATCH /api/quotes/:id/status` - Atualizar status do orçamento
- `DELETE /api/quotes/:id` - Deletar orçamento

### Services (Serviços)
- `GET /api/services` - Listar todos os serviços
- `GET /api/services/:id` - Obter serviço específico
- `POST /api/services` - Criar novo serviço
- `PUT /api/services/:id` - Atualizar serviço
- `DELETE /api/services/:id` - Deletar serviço

## 📋 Modelos de Dados

Ver `prisma/schema.prisma` para a estructura completa do banco de dados.

## 🔗 Integração com Frontend

O frontend em `../frontend` está configurado para chamar os endpoints da API em `http://localhost:3000/api`.

As chamadas são feitas usando Axios. Para detalhes, ver `src/services/api.ts` ou similar no frontend.

## 🛠 Troubleshooting

### Erro de Conexão ao Banco

Se receber erro `P1001: Can't reach database server`, verifique:
1. O banco está rodando em `postgres_postgress:5432`
2. As credenciais estão corretas no `.env`
3. Você está rodando dentro do EasyPanel ou tem acesso ao host

### Migrations Falhadas

Se uma migration falhar, você pode resetar o banco (cuidado - deleta tudo):
```bash
npx prisma migrate reset
```

## 📦 Deploy no EasyPanel

1. Push do código para o repositório
2. Configure as variáveis de ambiente no EasyPanel
3. Execute `pnpm db:push` ou `pnpm db:migrate` dentro do container
4. O serviço iniciará automaticamente
