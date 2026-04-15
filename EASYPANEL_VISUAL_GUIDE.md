# 📸 GUIA VISUAL: Onde Colar os Comandos no EasyPanel

## 🎯 PASSO 1: Abrir Backend Service

```
EasyPanel Dashboard
    ↓
Seu Projeto → jms-digitall-crm
    ↓
Clicar em: jms-digitall-backend
    ↓
Procurar por "Settings" ou "Build"
```

---

## 🎨 PASSO 2: Atualizar Build Command (Backend)

### Localização:
```
Service: jms-digitall-backend
    ↓
Settings / Build
    ↓
"Build Command" (campo de texto)
    ↓
[Limpar conteúdo atual]
    ↓
[Colar este comando]
```

### Comando a Colar:
```
cd backend && npm ci && npm run build
```

### Resultado Esperado:
```
✅ Build Command atualizado
```

---

## 🎨 PASSO 3: Atualizar Start Command (Backend)

### Localização:
```
Mesmo local (Settings)
    ↓
"Start Command" (campo de texto abaixo)
    ↓
[Limpar conteúdo atual]
    ↓
[Colar este comando]
```

### Comando a Colar:
```
cd backend && npm start
```

### Resultado Esperado:
```
✅ Start Command atualizado
```

---

## 🎨 PASSO 4: Fazer Deploy (Backend)

### Localização:
```
Botão "Save & Deploy" ou "Redeploy"
    ↓
[CLIQUE]
    ↓
Aguarde 3-5 minutos
```

### O que Você Verá:
```
⏳ Building...
⏳ Deploying...
✅ Healthy (quando terminar)
```

---

## 🎯 PASSO 5: Abrir Frontend Service

```
Voltar para Dashboard do Projeto
    ↓
Clicar em: jms-digitall-frontend
    ↓
Procurar por "Settings" ou "Build"
```

---

## 🎨 PASSO 6: Atualizar Build Command (Frontend)

### Localização:
```
Service: jms-digitall-frontend
    ↓
Settings / Build
    ↓
"Build Command" (campo de texto)
```

### Comando a Colar:
```
npm ci && npm run build
```

---

## 🎨 PASSO 7: Atualizar Start Command (Frontend)

### Localização:
```
Mesmo local (Settings)
    ↓
"Start Command" (campo de texto abaixo)
```

### Comando a Colar:
```
npm run preview
```

---

## 🎨 PASSO 8: Fazer Deploy (Frontend)

### Localização:
```
Botão "Save & Deploy" ou "Redeploy"
    ↓
[CLIQUE]
    ↓
Aguarde 2-3 minutos
```

### Resultado:
```
✅ Healthy
```

---

## ✅ Teste Rápido

Após ambos estarem **Healthy**:

### 1. Testar Backend
```
Abra um terminal (ou teste via curl):

curl https://seu-backend-xxxxx.easypanel.io/api/health

Esperado:
{"status":"ok","timestamp":"..."}
```

### 2. Testar Frontend
```
Abra no navegador:
https://seu-dominio.com

Esperado:
Página de login da JMS Digitall
```

### 3. Fazer Login
```
Digite usuário e senha
    ↓
Acesse Dashboard
    ↓
Dados devem carregar
    ↓
✅ SUCESSO!
```

---

## 🆘 Se Der Erro

### Erro: `pnpm: command not found`
```
✅ Use este comando em vez disso:
npm install -g pnpm && cd backend && npm install && npm run build
```

### Erro: `Build failed`
```
1. Clique em "Logs" (botão superior)
2. Procure pela mensagem de erro
3. Se não entender, procure abaixo em "Troubleshooting"
```

### Erro: `Health Check Failing`
```
1. Clique no service
2. Vá em "Logs"
3. Procure por erros
4. Pode ser DATABASE_URL incorreta
```

### Erro: `Frontend não conecta na API`
```
1. Abrir DevTools (F12)
2. Aba "Console"
3. Procurar por erro CORS
4. Se xem erro CORS:
   - Backend Health Check falhou
   - DATABASE_URL está errada
```

---

## 📋 Checklist Passo a Passo

- [ ] Abriu EasyPanel Dashboard
- [ ] Clicou em jms-digitall-backend
- [ ] Atualizou Build Command
- [ ] Atualizou Start Command
- [ ] Clicou em Redeploy/Deploy
- [ ] Esperou Building completar
- [ ] Status = ✅ Healthy
- [ ] Abriu jms-digitall-frontend
- [ ] Atualizou Build Command (frontend)
- [ ] Atualizou Start Command (frontend)
- [ ] Clicou em Redeploy/Deploy
- [ ] Esperou Building completar
- [ ] Status = ✅ Healthy
- [ ] Testou /api/health (backend)
- [ ] Testou /login (frontend)
- [ ] Fez login com sucesso
- [ ] Dashboard carregando dados
- [ ] ✅ APP EM PRODUÇÃO!

---

## 💡 Dicas Importantes

### Cache & Build Issues
```
Se der erro no build:
1. No service, procure "Clear Cache"
2. Clique em Redeploy
3. Aguarde nova compilação (vai ser mais lenta)
```

### Verificar Logs
```
Sempre que algo falhar:
1. Clique no Service
2. Procure botão "Logs" (canto superior)
3. Leia a mensagem de erro
4. Procure em EASYPANEL_PNPM_FIX.md
```

### Redeploy vs Deploy
```
- Deploy: Primeira vez, instala tudo
- Redeploy: Atualiza, reconfigura
Sempre use Redeploy ao mudar Build Command
```

---

Pronto? Vá para [EASYPANEL_COMMANDS.md](./EASYPANEL_COMMANDS.md) para copiar comandos prontos!
