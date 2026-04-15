# 🔧 FIX: Erro com pnpm no EasyPanel

## ❌ Problema

```
Error: pnpm: command not found
ou
ERR! Could not find specified version of node
```

---

## ✅ Solução (3 Opções)

### **OPÇÃO 1: Instalar pnpm Automaticamente** (RECOMENDADO)

O EasyPanel não vem com pnpm pré-instalado. Adicione este comando no início:

#### Backend Build Command:
```
npm install -g pnpm && cd backend && npm install && npm run build
```

#### Frontend Build Command:
```
npm install -g pnpm && npm install && npm run build
```

#### Backend Start Command:
```
cd backend && npm start
```

#### Frontend Start Command:
```
npm run preview
```

---

### **OPÇÃO 2: Usar npm Puro** (MAIS SIMPLES)

Se o pnpm der algum problema, descarte e use npm nativo:

#### Backend Build Command:
```
cd backend && npm install
```

#### Backend Start Command:
```
cd backend && npm start
```

#### Frontend Build Command:
```
npm install
```

#### Frontend Start Command:
```
npm run preview
```

**Nota:** O `npm-lock.yaml` será convertido para `package-lock.json` automaticamente.

---

### **OPÇÃO 3: Usar Yarn** (ALTERNATIVA)

Se tiver preferência:

#### Backend Build Command:
```
cd backend && yarn install && yarn build
```

#### Frontend Build Command:
```
yarn install && yarn build
```

---

## 🚀 Qual Escolher?

| Opção | Vantagem | Desvantagem |
|-------|----------|------------|
| **OPÇÃO 1** (pnpm) | Mais rápido, menos espaço | Instala pnpm toda vez |
| **OPÇÃO 2** (npm) | Nativo, sem dependências | Mais lento, mais espaço |
| **OPÇÃO 3** (yarn) | Rápido | Precisa do yarn |

**Recomendação:** Use **OPÇÃO 1** para manter compatibilidade com suas lock files.

---

## 📋 Scripts Necessários em package.json

Certifique-se que seus `package.json` têm estes scripts:

**Frontend (raiz):**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "start": "npm run preview"
  }
}
```

**Backend:**
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx src/seed.ts"
  }
}
```

---

## 🔍 Identificar o Erro Exato

### No Log do EasyPanel, procure por:

**Erro: `pnpm: command not found`**
```
✅ Solução: Use OPÇÃO 1 (instalar pnpm no build command)
```

**Erro: `Cannot find module 'dependencies'`**
```
✅ Solução: Certifique-se que pnpm-lock.yaml está no repositório
ou use OPÇÃO 2 (npm puro)
```

**Erro: `EACCES: permission denied`**
```
✅ Solução: Adicione npm ci em vez de npm install:
cd backend && npm ci && npm run build
```

**Erro: `Timeout`**
```
✅ Solução: Aumente timeout no .npmrc
fetch-timeout=300000 (5 minutos)
```

---

## 🎯 Passos Rápidos para Arrumar

### 1. Abra o EasyPanel
- Vá ao serviço backend
- Clique em **Settings** ou **Build**

### 2. Atualize o Build Command para:
```
npm install -g pnpm && cd backend && npm install && npm run build
```

### 3. Atualize o Start Command para:
```
cd backend && npm start
```

### 4. Clique em **Redeploy** ou **Save & Deploy**
- Aguarde 3-5 minutos
- Se ainda der erro, veja a seção **Troubleshooting** abaixo

### 5. Mesmo para Frontend:
```
Build: npm install -g pnpm && npm install && npm run build
Start: npm run preview
```

---

## 🆘 Se Ainda der Erro

### Passo 1: Verificar Logs
1. EasyPanel → Serviço → **Logs** (botão em cima)
2. Procure pela mensagem de erro exata
3. Copie o erro completo

### Passo 2: Limpar e Reconstruir
1. EasyPanel → Serviço → **Settings**
2. Em **Build**, clique em **Clear Cache**
3. Clique em **Redeploy**
4. Aguarde nova compilação

### Passo 3: Usar npm Puro
Se mesmo com pnpm dar erro, use OPÇÃO 2 (npm):

```
Build: cd backend && npm install && npm run build
Start: cd backend && npm start
```

### Passo 4: Contato com EasyPanel Support
Se nada funcionar:
- Abra um ticket em EasyPanel support
- Inclua sua versão do Node.js
- Inclua a mensagem de erro completa

---

## ✨ Verificação Final

Após arrumar, verifique:

```bash
# Backend
curl https://seu-backend-url/health

# Frontend
curl https://seu-dominio.com
```

Se ambos retornarem sucesso, está pronto! 🎉

---

## 📌 Resumo de Comandos Corretos

**Backend (sugerido):**
```
Build:  npm install -g pnpm && cd backend && npm install && npm run build
Start:  cd backend && npm start
```

**Frontend (sugerido):**
```
Build:  npm install -g pnpm && npm install && npm run build
Start:  npm run preview
```

---

## 🔗 Referências

- [pnpm Installation](https://pnpm.io/installation)
- [EasyPanel Docs](https://docs.easypanel.io)
- [npm ci vs npm install](https://docs.npmjs.com/cli/v8/commands/npm-ci)

---

Agora tente esse build command no EasyPanel! Se ainda der erro, abra um novo ticket com a mensagem de erro completa. 🚀
