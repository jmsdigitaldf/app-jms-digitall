# 🚀 JMS Digitall CRM - Preparação para Produção

## ✅ Arquivos de Configuração Criados

Foram criados os seguintes arquivos para preparar sua aplicação para produção:

### 📦 **Variáveis de Ambiente**
- **`.env.example`** - Variáveis necessárias (raiz)
- **`backend/.env.example`** - Configurações backend
- **`backend/.env.production.example`** - Template para produção
- **`backend/.env.production`** - ⚠️ Nunca commitar (seu arquivo real)
- **`.env.production.example`** - Template frontend

### 🐳 **Docker (Opcional)**
- **`docker-compose.yml`** - Compose para rodar local com PostgreSQL
- **`backend/Dockerfile`** - Build do backend
- **`Dockerfile.frontend`** - Build do frontend
- **`nginx.conf`** - Configuração nginx para SPA

### 📚 **Documentação**
- **`DEPLOY.md`** - Guia completo de deploy no EasyPanel
- **`.nvmrc`** - Versão Node.js padronizada (22.21.0)

### 🔧 **Scripts Atualizados**
- **`package.json`** - Novos scripts: `build:all`, `build:backend`, `build:frontend`, `start`, `db:seed`, `db:push`

---

## 📋 Próximo Passos

### 1️⃣ **Fazer Commit no Git**

```bash
# Adicionar todos os novos arquivos
git add .

# Commit
git commit -m "chore: prepare app for production

- Add .env.example files for configuration
- Create Docker files for containerization
- Add production deployment guide (DEPLOY.md)
- Update package.json with build scripts
- Add nginx configuration for SPA
- Add .nvmrc for Node version management"

# Enviar para GitHub
git push origin main
```

### 2️⃣ **Configurar Variáveis de Ambiente**

Existem **duas formas** de configurar:

#### **Opção A: Localmente** (Para testes)
```bash
# Backend
cp backend/.env.production.example backend/.env.production
# Edite backend/.env.production com seus valores reais

# Frontend
cp .env.production.example .env.production
# Edite .env.production com URL da API
```

#### **Opção B: No EasyPanel** (Recomendado para produção)
- Não precisa de arquivo `.env` no GitHub
- Configure tudo na interface do EasyPanel
- Mais seguro (variáveis secret não ficam no código)

### 3️⃣ **Testar Build Localmente**

```bash
# Build completo
pnpm build:all

# Se houver erros, rodar separadamente:
pnpm build:backend
pnpm build:frontend
```

### 4️⃣ **Testar com Docker** (Opcional)

```bash
# Rodar local com Docker
docker-compose up

# Acessar:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Database: localhost:5432
```

---

## 🔐 Segurança - Importante!

### **NÃO faça commit destes arquivos:**
```
backend/.env.production  ← Contém JWT secrets reais
.env.production          ← Contém URLs sensíveis
```

Eles já estão no `.gitignore`, mas **NUNCA** os commit manualmente!

### **JWT Secrets**
Gerar valores aleatórios com:
```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))
```

---

## 📊 Estrutura de Produção

```
github.com/seu-usuario/jms-digitall-crm (Main)
│
└── EasyPanel Deploy
    ├── Backend Service
    │   ├── Build: cd backend && pnpm install && pnpm build
    │   ├── Start: cd backend && node dist/server.js
    │   ├── PORT: 3000
    │   └── DATABASE: PostgreSQL 161.97.111.53:5432
    │
    ├── Frontend Service
    │   ├── Build: pnpm install && pnpm build
    │   ├── Start: pnpm preview
    │   ├── PORT: 80/443
    │   └── Serve: dist/
    │
    └── Custom Domain
        ├── seu-dominio.com (Frontend)
        └── api.seu-dominio.com (Backend opcional)
```

---

## 🚀 Deploy no EasyPanel

1. **Conectar Repositório**
   - Vá para EasyPanel → Novo Projeto
   - Conecte seu repositório GitHub
   - Branch: `main`

2. **Configurar Backend**
   - Build Command: `cd backend && pnpm install && pnpm build`
   - Start Command: `cd backend && node dist/server.js`
   - Variáveis de Ambiente: (veja `DEPLOY.md`)

3. **Configurar Frontend**
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm preview`
   - Output: `dist/`
   - Variáveis: `VITE_API_URL`

4. **Ativar Auto-Deploy**
   - GitHub Webhook automático
   - Deploy ao fazer push em `main`

---

## ✅ Checklist Final Antes de Deploy

- [ ] Repository GitHub atualizado com todos os commits
- [ ] Novos arquivos criados (`.env.example`, `docker-compose.yml`, etc)
- [ ] Build local testado (`pnpm build:all` sem erros)
- [ ] `.env.production` nunca foi commitado
- [ ] EasyPanel conectado ao repositório GitHub
- [ ] Variáveis de ambiente configuradas no EasyPanel
- [ ] Database URL testada
- [ ] CORS configurado com domínios corretos
- [ ] JWT secrets gerados aleatoriamente
- [ ] SSL/TLS habilitado
- [ ] Webhook GitHub configurado
- [ ] Health check respondendo (`GET /health`)

---

## 🆘 Troubleshooting

### Build falha no EasyPanel
```bash
# Limpar dependências localmente
rm -rf node_modules backend/node_modules
rm pnpm-lock.yaml

# Reinstalar
pnpm install
```

### Database não conecta
```bash
# Testar CONNECTION localmente
psql "$DATABASE_URL"

# Se falhar, rodar migrations
pnpm db:push
pnpm db:seed
```

### Frontend não conecta na API
- Verificar `VITE_API_URL` no frontend (.env.production)
- Verificar `CORS_ORIGIN` no backend
- Ver console do navegador (F12)

---

## 📞 Ajuda

Ver arquivo completo: [DEPLOY.md](./DEPLOY.md)

Qualquer dúvida, revise o guia de deploy completo!
