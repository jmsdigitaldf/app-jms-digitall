# Etapa 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de package para instalar dependências
COPY package.json package-lock.json ./

# Instala todas as dependências (incluindo devDependencies necessárias para o build)
RUN npm ci

# Copia todo o código fonte
COPY . .

# Executa o build do projeto
RUN npm run build

# Etapa 2: Servidor de produção (imagem leve)
FROM node:20-alpine

WORKDIR /app

# Instala o 'serve' para servir arquivos estáticos
RUN npm install -g serve@latest

# Copia apenas a pasta dist gerada na etapa de build
COPY --from=builder /app/dist ./dist

# Expõe a porta 3000
EXPOSE 3000

# Health check para verificar se o app está rodando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando para iniciar o servidor
CMD ["serve", "-s", "dist", "-l", "3000"]
