# ✨ EasyPanel - Deployment com Um Único Serviço

## 🎯 Objetivo

Implanta a aplicação JMS Digitall (Frontend + Backend + Database) **em um único serviço** no EasyPanel.

---

## 📦 Arquitetura

```
┌─────────────────────────────────────┐
│    EasyPanel - Single Service       │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Node.js + Express            │  │
│  │  ├─ Backend API (/api/*)      │  │
│  │  ├─ Frontend React (dist/)    │  │
│  │  └─ Port 3000                 │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  PostgreSQL Database          │  │
│  │  ├─ Host: postgres:5432       │  │
│  │  ├─ Database: jms_digitall    │  │
│  │  └─ User: postgres            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## ⚡ Benefícios desta Abordagem

✅ **Um único serviço** - sem complexidade de múltiplos containers  
✅ **Menos recursos** - roda em um único container  
✅ **Mais rápido** - build e deploy simplificados  
✅ **Fácil manutenção** - uma única unidade para gerenciar  
✅ **Sem CORS** - frontend e backend no mesmo servidor  

---

## 🚀 Passo a Passo para EasyPanel

### 1️⃣ **Preparar o Código Localmente**

```bash
# Limpar caches anteriores
rm -rf frontend/dist
rm -rf backend/dist
rm -rf node_modules backend/node_modules

# Instalar dependências
npm ci
cd backend && npm ci && cd ..

# Build tudo
npm run build
cd backend && npm run build && cd ..

# Testar localmente
cd backend && npm start
```

### 2️⃣ **Fazer Commit e Push no GitHub**

```bash
git status
git add .
git commit -m "feat: single service setup for easypanel"
git push origin main
```

### 3️⃣ **Criar Serviço no EasyPanel**

#### **Passo A: Ir para a seção de Aplicações**
1. Abrir EasyPanel https://seu-easypanel-url
2. Login com suas credenciais
3. Go to **Applications** ou **Services**

#### **Passo B: Criar Novo Serviço**
1. Clique em **+ New Application** ou **+ Create Service**
2. Escolha **Docker**
3. Preencha os dados:
   - **Name**: `jms-digitall-app`
   - **Description**: `JMS Digitall CRM - Full Stack Application`

#### **Passo C: Configurar Build**
1. Abra a seção **Build Settings**
2. Escolha: **Git Repository**
3. Configure:
   - **Repository**: `https://github.com/SEU_USUARIO/jms-digitall.git`
   - **Branch**: `main`
   - **Dockerfile Location**: `/Dockerfile` ← (raiz do projeto)

#### **Passo D: Build Command**
```bash
# Build command (deixe VAZIO ou use o padrão docker build)
# EasyPanel vai usar o Dockerfile do repositório
```

#### **Passo E: Portas**
1. **Porta Exposta**: `3000`
2. **Protocolo**: HTTP
3. **Health Check**: `/health` (opcional)

### 4️⃣ **Configurar Database**

#### **Opção A: PostgreSQL no EasyPanel**
Se você já tem PostgreSQL rodando:

1. Abra **Advanced Settings** ou **Environment Variables**
2. Adicione:
```
DATABASE_URL=postgresql://postgres:SEU_PASSWORD@postgres:5432/jms_digitall
NODE_ENV=production
```

#### **Opção B: PostgreSQL Externo**
Se usar seu servidor PostgreSQL (161.97.111.53):

```
DATABASE_URL=postgresql://postgres:SEU_PASSWORD@161.97.111.53:5432/jms_digitall
```

### 5️⃣ **Deploy e Testes**

#### **Iniciar Deploy**
1. Click em **Deploy** ou **Build & Deploy**
2. Acompanhe o log:
   - ✅ **Frontend build**: ~1-2 min
   - ✅ **Backend build**: ~2-3 min
   - ✅ **Start application**: soubé em PORT 3000

#### **Verificar Status**
```bash
# No terminal do EasyPanel, rode:
curl http://localhost:3000/health

# Esperado:
# {"status":"OK","timestamp":"2026-04-15T..."}
```

#### **Acessar Aplicação**
1. Clique no URL fornecido pelo EasyPanel
2. Você deve ver a página de **Login** do JMS Digitall
3. Pronto! ✅

---

## 🔧 Troubleshooting

### ❌ Erro: "Cannot find module"
**Solução**: 
```bash
# Local
npm ci
cd backend && npm ci && cd ..
npm run build-all
git push origin main
# Redeploy no EasyPanel
```

### ❌ Erro: "Database connection refused"
**Solução**:
1. Verificar se PostgreSQL está rodando
2. Confirmar `DATABASE_URL` está correto
3. Testar conexão: `psql $DATABASE_URL`

### ❌ Frontend não carrega (404)
**Solução**:
1. Verificar se o build do frontend completou
2. Checar logs do Docker
3. Acessar `http://seu-url:3000/health` diretamente

---

## 📊 Monitoramento

### Verificar Logs em Tempo Real
```bash
docker logs -f jms_digitall_app
```

### Health Check
- **URL**: `https://seu-dominio.com/health`
- **Frequência**: A cada 30 segundos
- **Esperado**: Status 200 com `{"status":"OK"}`

### Estatísticas de Uso
1. Vá para EasyPanel → Application
2. Abra a aba **Metrics** ou **Analytics**
3. Monitore CPU, RAM, Network

---

## 🆘 Suporte

Se encontrar problemas:

1. **Verificar logs**:
   ```bash
   docker logs jms_digitall_app | grep ERROR
   ```

2. **Reiniciar aplicação**:
   ```bash
   docker restart jms_digitall_app
   ```

3. **Fazer seed da base de dados**:
   ```bash
   docker exec jms_digitall_app npm run db:seed
   ```

4. **Resetar tudo** (se necessário):
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

---

## ✅ Checklist Final

- [ ] Código committed e pushed no GitHub
- [ ] Serviço criado no EasyPanel
- [ ] Build completado com sucesso
- [ ] `/health` retorna 200 OK
- [ ] Login page carrega
- [ ] Database conectado (verifiable no Dashboard)
- [ ] CRUD operations funcionando
- [ ] Sem erros no console (F12)

---

## 📝 Notas Importantes

1. **Um Dockerfile**: Localizado na raiz do projeto, faz build tanto frontend quanto backend
2. **Express serve ambos**: Backend serve API + arquivos estáticos do React
3. **Sem pnpm necessário**: Usa `npm ci` natively (compatível com EasyPanel)
4. **Escalável**: Pode usar múltiplos serviços depois se necessário

---

**Criado em**: Abril/2026  
**Stack**: Node.js + React + PostgreSQL  
**Deployment**: EasyPanel (Docker)  
**Status**: ✅ Production Ready
