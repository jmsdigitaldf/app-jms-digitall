#!/bin/bash

# ============================================================
# JMS Digitall - Single Service Deployment Script
# Para EasyPanel - Instala, compila e inicia em um único serviço
# ============================================================

set -e  # Exit on error

echo "🚀 JMS Digitall - Single Service Deployment"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir status
status() {
  echo -e "${GREEN}✅${NC} $1"
}

error() {
  echo -e "${RED}❌${NC} $1"
  exit 1
}

info() {
  echo -e "${YELLOW}ℹ️${NC} $1"
}

# 1. Verificar se Node.js está instalado
info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
  error "Node.js não está instalado"
fi
NODE_VERSION=$(node --version)
status "Node.js $NODE_VERSION encontrado"

# 2. Instalar dependências
info "Instalando dependências..."
npm ci || error "Falha ao instalar dependências root"
status "Dependências root instaladas"

cd backend
npm ci || error "Falha ao instalar dependências backend"
status "Dependências backend instaladas"
cd ..

# 3. Build backend
info "Compilando backend..."
cd backend
npm run build || error "Falha ao compilar backend"
status "Backend compilado com sucesso"
cd ..

# 4. Build frontend
info "Compilando frontend..."
npm run build || error "Falha ao compilar frontend"
status "Frontend compilado com sucesso"

# 5. Verificar se dist foi criado
if [ ! -d "frontend/dist" ]; then
  error "Frontend não foi compilado corretamente (dist não existe)"
fi
if [ ! -d "backend/dist" ]; then
  error "Backend não foi compilado corretamente (dist não existe)"
fi

status "Frontend dist: $(ls -1 frontend/dist | wc -l) arquivos"
status "Backend dist criado"

# 6. Informações finais
echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Compilação concluída com sucesso!${NC}"
echo "=========================================="
echo ""
info "Próximos passos:"
echo "  1. Fazer commit: git add . && git commit -m 'feat: single service build'"
echo "  2. Push: git push origin main"
echo "  3. EasyPanel vai detectar e fazer deploy automático"
echo ""
info "Ou inicie localmente com:"
echo "  cd backend && npm start"
echo ""
info "Esta aplicação está pronta para EasyPanel com:"
echo "  - Frontend: servido via Express (public/)"
echo "  - Backend: API em /api/*"
echo "  - Database: PostgreSQL"
echo ""
