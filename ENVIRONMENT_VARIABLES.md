# 📋 Variáveis Prontas para Colar no EasyPanel

## Backend Service - Variáveis de Ambiente

**⚠️ IMPORTANTE:** 
1. Copie cada linha abaixo
2. No EasyPanel, clique em "Add Environment Variable"
3. Cole a variável
4. **NÃO modifique o nome** (ex: DATABASE_URL)
5. Para valores com `(gere...)`, veja instruções abaixo

---

## OBRIGATÓRIAS (Copie e Cole)

### Database
```
DATABASE_URL
postgresql://user:senha@161.97.111.53:5432/jms_digitall?schema=public
```

### Server
```
NODE_ENV
production
```

```
PORT
3000
```

### JWT Secrets (⚠️ Veja "Como Gerar" abaixo)
```
JWT_SECRET
(COPIE UM VALOR GERADO - veja abaixo)
```

```
JWT_REFRESH_SECRET
(COPIE OUTRO VALOR GERADO - diferente do anterior)
```

### CORS & Frontend
```
FRONTEND_URL
https://seu-dominio.com
```

```
CORS_ORIGIN
https://seu-dominio.com,https://www.seu-dominio.com
```

---

## OPCIONAIS (Padrões - Pode deixar como está)

```
JWT_EXPIRES_IN
7d
```

```
JWT_REFRESH_EXPIRES_IN
30d
```

```
RATE_LIMIT_WINDOW_MS
900000
```

```
RATE_LIMIT_MAX_REQUESTS
100
```

---

## FUTURAS INTEGRAÇÕES (Configure depois)

```
WHATSAPP_TOKEN
(deixe em branco por enquanto)
```

```
WHATSAPP_VERIFY_TOKEN
(deixe em branco por enquanto)
```

```
WHATSAPP_PHONE_ID
(deixe em branco por enquanto)
```

```
WHATSAPP_BUSINESS_ID
(deixe em branco por enquanto)
```

```
OPENAI_API_KEY
(deixe em branco por enquanto)
```

---

## ✅ Como Gerar JWT Secrets (Seguro)

### OPÇÃO 1: Online (Recomendado - Mais Fácil)

1. Abra https://www.uuidgenerator.net/
2. Clique em "GENERATE" várias vezes
3. Copie um UUID bem longo
4. Copie para `JWT_SECRET`
5. Gere outro UUID diferente
6. Copie para `JWT_REFRESH_SECRET`

### OPÇÃO 2: Linha de Comando

**macOS/Linux:**
```bash
openssl rand -base64 32
# Copie resultado para JWT_SECRET

openssl rand -base64 32
# Copie resultado para JWT_REFRESH_SECRET
```

**Windows PowerShell:**
```powershell
$secret1 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
Write-Host $secret1

$secret2 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
Write-Host $secret2
```

### OPÇÃO 3: Python
```python
import secrets
print(secrets.token_urlsafe(32))  # Para JWT_SECRET
print(secrets.token_urlsafe(32))  # Para JWT_REFRESH_SECRET
```

---

## 🎯 Checklist de Preenchimento

- [ ] DATABASE_URL = postgresql://user:senha@161.97.111.53:5432/jms_digitall?schema=public
- [ ] NODE_ENV = production
- [ ] PORT = 3000
- [ ] JWT_SECRET = (valor aleatório gerado)
- [ ] JWT_REFRESH_SECRET = (outro valor aleatório diferente)
- [ ] FRONTEND_URL = https://seu-dominio.com
- [ ] CORS_ORIGIN = https://seu-dominio.com,https://www.seu-dominio.com
- [ ] Opcionais preenchidos conforme detalhado
- [ ] Valores futuros deixados em branco

---

## 🚀 Frontend Service - Variáveis

### OBRIGATÓRIA (Copie)

```
VITE_API_URL
https://seu-backend-xxxxx.easypanel.io/api
```

**⚠️ Substitua `seu-backend-xxxxx` pela URL real do seu backend!**

Como encontrar:
1. No EasyPanel, acesse serviço "jms-digitall-backend"
2. Role até "Public URL" ou "Domains"
3. Copie URL completa
4. Adicione `/api` no final

Exemplo:
```
Se a URL do backend é: https://jms-digitall-backend-abc123.easypanel.io
Então VITE_API_URL = https://jms-digitall-backend-abc123.easypanel.io/api
```

---

## 📝 Template Pronto Para Copiar (Backend)

Se preferir copiar tudo de uma vez, edite e adicione uma variável por linha:

```
DATABASE_URL = postgresql://user:senha@161.97.111.53:5432/jms_digitall?schema=public
NODE_ENV = production
PORT = 3000
JWT_SECRET = (gere valor)
JWT_REFRESH_SECRET = (gere outro)
FRONTEND_URL = https://seu-dominio.com
CORS_ORIGIN = https://seu-dominio.com,https://www.seu-dominio.com
JWT_EXPIRES_IN = 7d
JWT_REFRESH_EXPIRES_IN = 30d
RATE_LIMIT_WINDOW_MS = 900000
RATE_LIMIT_MAX_REQUESTS = 100
WHATSAPP_TOKEN = 
WHATSAPP_VERIFY_TOKEN = 
WHATSAPP_PHONE_ID = 
WHATSAPP_BUSINESS_ID = 
OPENAI_API_KEY = 
```

---

## ✅ Ordem Recomendada de Preenchimento

1. **Preencher todas as variáveis no Backend service**
2. **Clicar Deploy do Backend** (aguarde ✅ Healthy)
3. **Anotar URL do Backend** (para VITE_API_URL)
4. **Preencher Frontend service**
5. **Clicar Deploy do Frontend** (aguarde ✅ Healthy)
6. **Testar endpoints** (/api/health)
7. **Acessar frontend** (verificar se conecta na API)

---

## 🆘 Valores Incorretos = Erros

| Se você colocar | O que acontece |
|---|---|
| DATABASE_URL errada | Backend não healthea |
| JWT_SECRET em branco | Backend falha ao iniciar |
| VITE_API_URL errada | Frontend mostra erro CORS |
| CORS_ORIGIN errado | Frontend não consegue chamar API |
| FRONTEND_URL incompleto | Alguns links quebram |

---

## 📞 Dúvidas Frequentes

**P: Posso copiar o JWT_SECRET de outro lugar?**
R: Não! Gere um novo valor aleatório, nunca reutilize!

**P: E se esquecer qual foi meu JWT_SECRET?**
R: Você pode editar a variável depois no EasyPanel

**P: CORS_ORIGIN precisa de https://?**
R: SIM! Se usar http://, não funcionará em produção

**P: Posso deixar as variáveis futuras em branco?**
R: SIM! Configure quando precisar (WhatsApp, OpenAI, etc)

**P: Preciso criar .env.production locally?**
R: NÃO! EasyPanel cuida disso. Não faça commit de .env!

---

**Próximo Passo:** Leia [EASYPANEL_STEP_BY_STEP.md](./EASYPANEL_STEP_BY_STEP.md) para ver o passo a passo completo com screenshots.
