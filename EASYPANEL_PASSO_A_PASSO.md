# 🎯 EasyPanel - Passo a Passo Detalhado

## LOGIN no EasyPanel

```
URL: https://seu-easypanel.url
Usuário: seu email/usuário
Senha: sua senha
```

---

## PASSO 1: Ir para Aplicações

### 📍 No Menu Esquerdo:
```
Applications  ← CLIQUE AQUI
   ou
Services
   ou  
Deployments
```

**Você verá uma página com seus serviços atuais**

---

## PASSO 2: Criar Nova Aplicação

### 🔘 Botão para Clicar:

```
┌────────────────────────────┐
│ + New Application          │  ← CLIQUE
│              ou            │
│ + Add Service              │
│              ou            │
│ + Create Deployment        │
└────────────────────────────┘
```

---

## PASSO 3: Selecionar Docker

```
┌─────────────────────────────────┐
│ Select a deployment method:     │
├─────────────────────────────────┤
│ [ ] Dockerfile                  │
│ [ ] Docker Compose              │
│ [ ] Git Push                    │  ← ESTE (GitHub)
│ [ ] Upload Files                │
│ [ ] Manual                      │
└─────────────────────────────────┘
```

**Clique em:** `Git Push` ou `Docker` (depende da interface)

---

## PASSO 4: Preencher Informações Básicas

```
┌─────────────────────────────────────────────────────┐
│ GENERAL SETTINGS                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Name *                                              │
│ ┌─────────────────────────────────────────────────┐ │
│ │ jms-digitall-app                                │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Description (optional)                              │
│ ┌─────────────────────────────────────────────────┐ │
│ │ JMS Digitall CRM - Full Stack Application       │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## PASSO 5: Conectar ao GitHub

```
┌─────────────────────────────────────────────────────┐
│ REPOSITORY SETTINGS                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Repository URL *                                    │
│ ┌─────────────────────────────────────────────────┐ │
│ │ https://github.com/SEU_USER/jms-digitall.git   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Branch *                                            │
│ ┌─────────────────────────────────────────────────┐ │
│ │ main                                            │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Dockerfile Location (Path)                          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ /Dockerfile                                     │ │
│ └─────────────────────────────────────────────────┘ │
│  ↑ IMPORTANTE: Tem que estar na RAIZ (/)           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## PASSO 6: Configurar Build Command

```
┌─────────────────────────────────────────────────────┐
│ BUILD SETTINGS                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Build Command (optional)                            │
│ ┌─────────────────────────────────────────────────┐ │
│ │ (deixar vazio)                                  │ │
│ │                                                 │ │
│ │ ou usar padrão: docker build .                  │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Build Context                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ /                                               │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## PASSO 7: Configurar Porta

```
┌─────────────────────────────────────────────────────┐
│ PORTS & EXPOSURE                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Expose Port *                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 3000                                            │ │
│ └─────────────────────────────────────────────────┘ │
│ IMPORTANTE: Nossa app roda na porta 3000           │
│                                                     │
│ Protocol *                                          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ HTTP                                            │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Public URL (gerado automaticamente)                 │
│ ┌─────────────────────────────────────────────────┐ │
│ │ https://jms-digitall-app-xxxxx.easypanel.io   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## PASSO 8: Adicionar Variáveis de Ambiente

### Procurar por:
```
[ ] Environment Variables
[ ] Env Vars
[ ] Advanced Settings
[ ] Environment
```

### Clicar em "+ Add Environment Variable" ou similar

### Adicionar EXATAMENTE estas 3:

```
┌──────────────────┬────────────────────────────────────┐
│ VARIABLE         │ VALUE                              │
├──────────────────┼────────────────────────────────────┤
│ NODE_ENV         │ production                         │
├──────────────────┼────────────────────────────────────┤
│ PORT             │ 3000                               │
├──────────────────┼────────────────────────────────────┤
│ DATABASE_URL     │ postgresql://postgres:SENHA@       │
│                  │ postgres:5432/jms_digitall         │
└──────────────────┴────────────────────────────────────┘
```

### ⚠️ IMPORTANTE - DATABASE_URL:

Se você tiver PostgreSQL NO SEU SERVIDOR:
```
postgresql://postgres:SUA_SENHA@seu-ip:5432/jms_digitall
```

Se você tiver PostgreSQL NO EASYPANEL:
```
postgresql://postgres:SUA_SENHA@postgres:5432/jms_digitall
```

Se usar servidor local:
```
postgresql://postgres:SUA_SENHA@localhost:5432/jms_digitall
```

**Exemplo real:**
```
postgresql://postgres:senha123@161.97.111.53:5432/jms_digitall
```

---

## PASSO 9: Health Check (Opcional)

```
┌─────────────────────────────────────────────────────┐
│ HEALTH CHECK (opcional)                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Health Check Path                                   │
│ ┌─────────────────────────────────────────────────┐ │
│ │ /health                                         │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Check Interval: 30s                                 │
│ Timeout: 10s                                        │
│ Retries: 3                                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## PASSO 10: DEPLOY! 🚀

### Procurar pelo Botão:

```
┌────────────────────────────────────────┐
│  🟦 Deploy                             │  ← CLIQUE AQUI
│              ou                        │
│  🟦 Build & Deploy                     │
│              ou                        │
│  🟦 Create                             │
└────────────────────────────────────────┘
```

---

## ⏳ AGUARDAR BUILD

Depois que clicar em Deploy, você vai ver:

### Logs em tempo real:

```
[15:30:45] Starting build...
[15:30:46] Cloning repository...
[15:31:00] ✓ Repository cloned
[15:31:05] Building Docker image...
[15:31:10] FROM node:20-alpine  ← Frontend build
[15:32:00] ✓ Frontend built
[15:32:10] Backend compilation...  ← Backend build
[15:33:00] ✓ Backend built
[15:33:10] Starting container...
[15:33:20] ✓ Application started
[15:33:25] ✓ Health check passed
[15:33:30] ✓ DEPLOYMENT SUCCESSFUL ✅
```

### Status esperado: **✅ Healthy** (verde)

---

## 📊 ACOMPANHAR PROGRESSO

No EasyPanel você verá uma timeline:

```
├─ Cloning Repository       [✅ Done]
├─ Building Docker Image    [✅ Done] 
├─ Pushing Image            [✅ Done]
├─ Starting Container       [✅ Done]
├─ Health Check             [✅ Done]
└─ Application Ready        [✅ LIVE]

Status: ✅ HEALTHY
URL: https://seu-url.easypanel.io
```

---

## ✅ PRONTO! TESTAR!

### Opção 1: Clicar no URL
```
EasyPanel → jms-digitall-app → [Clique no URL]
```

### Opção 2: Acessar diretamente
```
https://seu-url.easypanel.io
        ↓
     [Deve abrir página de LOGIN]
```

### Opção 3: Testar API
```powershell
curl https://seu-url/health
# Esperado: {"status":"OK","timestamp":"..."}
```

---

## 🎊 PRONTO! SEU APP ESTÁ VIVO!

```
┌─────────────────────────────────────────┐
│ 🌟 Seu CRM em Produção!                │
│                                         │
│ ✅ Frontend: React rodando               │
│ ✅ Backend: API respondendo              │
│ ✅ Database: Conectado                   │
│ ✅ Domínio: Configurado                  │
│                                         │
│ You did it! 🎉                          │
└─────────────────────────────────────────┘
```

---

## 🆘 Problemas Comuns?

### ❌ "Build failed"
- Checar Logs → Procurar por ERROR/erro
- Mais comum: falta dependência no npm ci

### ❌ "Health Check Failed"
- Esperar mais tempo (build leva 5-7 min)
- Checar DATABASE_URL está correto

### ❌ "Cannot access /health"
- App ainda está buildando
- Acompanhar os logs na dashboard

### ❌ "Database connection refused"
- DATABASE_URL está wrong
- PostgreSQL não tá rodando
- Verificar IP, porta, senha

### ✅ Se tudo funcionou:
- Frontend carrega? ✓
- Login page aparece? ✓
- API responde? ✓
- Dashboard mostra dados? ✓
- Consegue criar/editar/deletar? ✓

**Parabéns! Deploy foi sucesso!** 🎉

---

## 📝 RESUMO FINAL

**O que você vai fazer:**

1. ✅ Fazer commit/push no GitHub
2. ✅ Abrir EasyPanel
3. ✅ Criar novo App com Dockerfile
4. ✅ Conectar ao GitHub repo
5. ✅ Adicionar 3 Environment Variables
6. ✅ Clicar Deploy
7. ✅ Acompanhar logs (5-7 min)
8. ✅ Acessar URL final

**Resultado:** App em produção! 🚀

**Tempo total:** ~10 minutos
