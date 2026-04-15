# ⚡ COMANDOS PRONTOS PARA EASYPANEL

## 🎯 Copie e Cole Estes Comandos

### BACKEND SERVICE

**Build Command** (copie inteiro):
```
cd backend && npm ci && npm run build
```

**Start Command**:
```
cd backend && npm start
```

**Port**:
```
3000
```

**Health Check**:
```
/health
```

---

### FRONTEND SERVICE

**Build Command**:
```
npm ci && npm run build
```

**Start Command**:
```
npm run preview
```

**Port**:
```
3000
```

---

## 🚨 Se Ainda Dar Erro

**Use esta alternativa (npm puro, sem pnpm):**

### BACKEND SERVICE (Alternativa)

**Build Command**:
```
cd backend && npm install
```

**Start Command**:
```
cd backend && npm start
```

---

### FRONTEND SERVICE (Alternativa)

**Build Command**:
```
npm install
```

**Start Command**:
```
npm run preview
```

---

## ✅ Checklist Rápido

No EasyPanel, para cada service:

1. [ ] Clique em **Service**
2. [ ] Clique em **Settings** ou **Build**
3. [ ] Copie o **Build Command** acima
4. [ ] Copie o **Start Command** acima
5. [ ] Clique em **Save & Deploy** ou **Redeploy**
6. [ ] Aguarde 3-5 minutos
7. [ ] Verifique:
   - Status = ✅ **Healthy**
   - Health Check respondendo
   - Logs sem erros

---

## 🎓 Ou Leia Guia Completo

Se quiser entender melhor: [EASYPANEL_PNPM_FIX.md](./EASYPANEL_PNPM_FIX.md)

---

## 💡 Pro Tips

1. **Se build falhar:** Clique em **Clear Cache** e **Redeploy**
2. **Se timeout:** Aumente `fetch-timeout=300000` no `.npmrc`
3. **Se nada funcionar:** Use alternativa com npm puro (sem pnpm)
4. **Check logs:** Botão **Logs** no service para ver erro exato

---

Sucesso! 🚀
