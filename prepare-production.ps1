# Script para fazer commit de preparação para produção (Windows PowerShell)

Write-Host "🚀 JMS Digitall CRM - Preparando para Produção" -ForegroundColor Green
Write-Host "=============================================="
Write-Host ""

# Verificar se está em um repositório git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Não é um repositório Git!" -ForegroundColor Red
    Write-Host "Execute: git init && git remote add origin SEU_URL"
    exit 1
}

Write-Host "📦 Adicionando arquivos..." -ForegroundColor Cyan
git add .

Write-Host ""
Write-Host "📝 Fazendo commit de preparação para produção..." -ForegroundColor Cyan

git commit -m @"
chore: prepare app for production

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
- .gitignore updated to exclude sensitive files
"@

Write-Host ""
Write-Host "🔍 Status do repositório:" -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "✅ Commit criado! Agora:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Enviar para GitHub:" -ForegroundColor Yellow
Write-Host "   git push origin main"
Write-Host ""
Write-Host "2. Revisar o arquivo PRODUCTION_SETUP.md para próximos passos" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Seguir instruções em DEPLOY.md para deploy no EasyPanel" -ForegroundColor Yellow
