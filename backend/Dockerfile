FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Build application
RUN npm run build

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
