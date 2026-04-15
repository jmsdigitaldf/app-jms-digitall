# 🚀 PASSO A PASSO: Deploy JMS Digitall no EasyPanel

## 📌 PRÉ-REQUISITOS

✅ Repositório GitHub criado e commit feito
✅ Conta EasyPanel ativa
✅ PostgreSQL rodando em 161.97.111.53:5432 com database `jms_digitall`

---

## 🎯 FASE 1: Conectar Repositório GitHub ao EasyPanel

### 1.1 - Login no EasyPanel
1. Acesse [easypanel.io](https://easypanel.io)
2. Faça login com sua conta
3. Você verá a dashboard principal

### 1.2 - Criar Novo Projeto
1. Clique em **"+ New Project"** ou **"Create Project"**
2. Selecione **"Import from Git"**
3. Clique em **"Connect GitHub"**
   - Se for primeira vez, autorize o acesso
   - Selecione seu repositório `jms-digitall-crm`
4. Escolha a branch: **`main`**
5. Clique em **"Continue"**

---

## 🏗️ FASE 2: Criar Backend Service

### 2.1 - Configuração Initial

Na tela de criação do serviço, preencha:

```
Service Name:       jms-digitall-backend
Framework:          Node.js
Build Command:      cd backend && npm ci && npm run build
Start Command:      cd backend && npm start
Root Directory:     . (deixe em branco)
Port:               3000
Health Check:       /health
```

### 2.2 - Environment Variables (Backend)

Clique em **"Add Environment Variable"** e adicione cada linha:

```
DATABASE_URL = postgresql://user:senha@161.97.111.53:5432/jms_digitall?schema=public
NODE_ENV = production
PORT = 3000
JWT_SECRET = (gere um valor aleatório - veja abaixo)
JWT_REFRESH_SECRET = (gere outro valor aleatório)
FRONTEND_URL = https://seu-dominio.com
CORS_ORIGIN = https://seu-dominio.com,https://www.seu-dominio.com
JWT_EXPIRES_IN = 7d
JWT_REFRESH_EXPIRES_IN = 30d
RATE_LIMIT_WINDOW_MS = 900000
RATE_LIMIT_MAX_REQUESTS = 100
```

#### **Como Gerar JWT Secrets (Aleatórios e Seguros):**

**Online (rápido):**
- Acesse https://www.random.org/strings/
- Gere duas strings aleatórias
- Copie e cole nos campos

**Ou via terminal:**
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

### 2.3 - Salvar Backend
1. Clique em **"Deploy"** ou **"Save & Deploy"**
2. Aguarde o build completar (3-5 minutos)
3. Você verá status: ✅ **Healthy** quando pronto

---

## 🎨 FASE 3: Criar Frontend Service

### 3.1 - Novo Serviço para Frontend

1. Volte para a dashboard do projeto
2. Clique em **"+ Add Service"**
3. Selecione **Import from Git** (mesmo repositório)
4. Preencha:

```
Service Name:       jms-digitall-frontend
Framework:          Node.js (ou Static)
Build Command:      npm ci && npm run build
Start Command:      npm run preview
Root Directory:     . (deixe em branco)
Port:               80 (ou deixe EasyPanel escolher)
Output Directory:   dist
```

### 3.2 - Environment Variables (Frontend)

Adicione **uma única** variável:

```
VITE_API_URL = https://seu-backend-url.easypanel.io/api
```

**Importante:** Substitua `seu-backend-url` pela URL real que EasyPanel gerou para o backend!

Como encontrar:
1. Vá para o serviço backend
2. Role para baixo até "Public URL" ou "Domains"
3. Copie a URL completa (ex: `https://jms-digitall-backend-xxxxx.easypanel.io`)
4. Adicione `/api` no final

### 3.3 - Deploy Frontend
1. Clique em **"Deploy"**
2. Aguarde build (2-3 minutos)
3. Status deve ser ✅ **Healthy**

---

## 🔗 FASE 4: Configurar Domínios (OPCIONAL MAS RECOMENDADO)

### 4.1 - Adicionar Domínio Customizado

Para **Backend:**
1. Acesse serviço backend → **Domains** ou **Settings**
2. Clique em **"+ Add Domain"**
3. Digite seu domínio (ex: `api.seu-dominio.com`)
4. Confirme DNS apontando para EasyPanel
5. Ative **Auto SSL** (Let's Encrypt)

Para **Frontend:**
1. Acesse serviço frontend → **Domains**
2. Clique em **"+ Add Domain"**
3. Digite seu domínio (ex: `seu-dominio.com`)
4. Confirme DNS
5. Ative **Auto SSL**

### 4.2 - Configuração DNS (no seu registrador)

Após adicionar domínio no EasyPanel, você receberá registros DNS.

No seu registrador (GoDaddy, Namecheap, etc):

**Exemplo:**
```
Tipo: CNAME
Nome: api (ou @)
Valor: seu-backend-xxxxx.easypanel.io
TTL: 3600 (padrão)
```

Pode levar 5-30 minutos para propagar.

---

## 🗄️ FASE 5: Configurar Database (Seeds)

Agora precisa rodar o seed para popular dados iniciais.

### 5.1 - Conectar via SSH ao Backend

1. No EasyPanel, acesse serviço backend
2. Clique em **"Terminal"** ou **"SSH"**
3. Execute os comandos:

```bash
# Sincronizar schema (se necessário)
npx prisma db push

# Rodar seed com dados iniciais
npm run db:seed
```

Deve aparecer:
```
🌱 Iniciando seed de dados...
✅ Criado serviço: Troca de Tela
✅ Criado serviço: Troca de Bateria
... (10 serviços)
✨ Seed concluído com sucesso!
```

---

## ✅ FASE 6: Testes & Validação

### 6.1 - Testar Backend

```bash
# Via terminal/PowerShell
curl https://seu-dominio.com/api/health
# ou
curl https://seu-backend-xxxxx.easypanel.io/api/health

# Você deve receber:
# {"status":"ok","timestamp":"2026-04-15T..."}
```

### 6.2 - Testar Frontend

1. Acesse https://seu-dominio.com no navegador
2. Você deve ver a página de login
3. Login padrão (verifique no seu seed/database)

### 6.3 - Testar Conectividade

1. Faça login no frontend
2. Tente acessar alguma página (Dashboard, Clientes, etc)
3. Dados devem carregar do backend
4. Console da aba DevTools (F12) não deve exibir erros CORS

### 6.4 - Se Houver Erro de CORS

1. Volte ao serviço backend no EasyPanel
2. Edite variável `CORS_ORIGIN`:
   ```
   CORS_ORIGIN = https://seu-dominio.com,https://www.seu-dominio.com
   ```
3. **Redeploy** o backend

---

## 🔄 FASE 7: Auto-Deploy do GitHub (Webhook)

### 7.1 - Ativar Webhook Automático

1. No EasyPanel, acesse seu projeto
2. Vá para **Settings** ou **Project Settings**
3. Procure por **"Webhooks"** ou **"Auto-deploy"**
4. Ative **"Auto-deploy on push"**
5. Copie a URL do webhook (se necessário para GitHub)

### 7.2 - Configurar GitHub (se necessário)

1. Acesse seu repositório no GitHub
2. Vá para **Settings** → **Webhooks**
3. Clique em **"Add webhook"**
4. Cole a URL do webhook do EasyPanel
5. Evento: **Push events**
6. Clique em **"Add webhook"**

Agora, sempre que você fazer:
```bash
git push origin main
```

O EasyPanel vai automaticamente fazer:
1. Pull do código
2. Build do backend
3. Build do frontend
4. Deploy em produção

---

## 📊 Checklist Final

- [ ] Backend criado e healthy ✅
- [ ] Frontend criado e healthy ✅
- [ ] DATABASE_URL configurada corretamente
- [ ] JWT secrets gerados aleatoriamente
- [ ] VITE_API_URL apontando para backend correto
- [ ] CORS_ORIGIN configurado com domínios corretos
- [ ] Seed rodar sem erros
- [ ] Health check respondendo (/health)
- [ ] Frontend login funcionando
- [ ] Dashboard carregando dados
- [ ] Webhook GitHub configurado
- [ ] Domínio customizado (opcional)

---

## 🆘 Troubleshooting

### ❌ Backend não heala
```
Verificar:
1. DATABASE_URL está correta? (teste psql localmente)
2. JWT_SECRET foi definido?
3. Logs do EasyPanel (clique em "Logs")
4. Rodar `pnpm db:push` para sincronizar schema
```

### ❌ Frontend mostra erro em branco
```
Verificar:
1. VITE_API_URL está correta?
2. Abrir DevTools (F12) → Console
3. Procurar por erro de CORS
4. Verificar CORS_ORIGIN no backend
```

### ❌ Build falha
```
Verificar:
1. Build Command está correto?
2. Start Command aponta pro arquivo correto?
3. pnpm-lock.yaml está no repositório?
4. Limpar e rebuildar:
   git push origin main (vai triggerar rebuild)
```

### ❌ Seed falha
```
Procure por "already exists" ou constraint errors.
Solution:
1. Deletar todos os dados iniciais
2. Rodar seed novamente
Ou alterar seed script para ignorar duplicatas.
```

---

## 📞 URLs de Referência

**Seu Backend:**
```
https://seu-backend-xxxxx.easypanel.io
https://seu-backend-xxxxx.easypanel.io/api
https://seu-backend-xxxxx.easypanel.io/api/health
```

**Seu Frontend:**
```
https://seu-dominio.com
https://seu-dominio.com/login
https://seu-dominio.com/dashboard
```

---

## 🎉 Pronto!

Se todos os ✅ acima estão marcados, seu app está em PRODUÇÃO!

**Próximas etapas opcionais:**
- Configurar monitoramento
- Backup automático do banco
- CDN para assets estáticos
- Email alerts para erros

Qualquer dúvida, volte aqui!
