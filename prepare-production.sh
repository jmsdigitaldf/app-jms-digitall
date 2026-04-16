#!/bin/bash

# Script para fazer commit de preparação para produção

echo "🚀 JMS Digitall CRM - Preparando para Produção"
echo "=============================================="
echo ""

# Verificar se está em um repositório git
if [ ! -d ".git" ]; then
    echo "❌ Não é um repositório Git!"
    echo "Execute: git init && git remote add origin SEU_URL"
    exit 1
fi

echo "📦 Adicionando arquivos..."
git add .

echo ""
echo "📝 Fazendo commit de preparação para produção..."
git commit -m "chore: prepare app for production

Infrastructure & Configuration:
- Add .env.example files for environment configuration
- Create Docker setup (docker-compose.yml, Dockerfiles)
- Add nginx configuration for SPA routing
- Add .nvmrc for Node version management (22.21.0)

Scripts & Build:
- Update package.json with build scripts (build:backend, build:frontend, build:all)
- Add production build commands
- Add database migration scripts

Documentation:
- Add DEPLOY.md with complete deployment guide
- Add PRODUCTION_SETUP.md with setup instructions
- Add deployment checklist

Security:
- Environment variables properly separated
- Production secrets example (.env.production.example)
- .gitignore updated to exclude sensitive files"

echo ""
echo "🔍 Status do repositório:"
git status

echo ""
echo "✅ Commit criado! Agora:"
echo ""
echo "1. Enviar para GitHub:"
echo "   git push origin main"
echo ""
echo "2. Revisar o arquivo PRODUCTION_SETUP.md para próximos passos"
echo ""
echo "3. Seguir instruções em DEPLOY.md para deploy no EasyPanel"
