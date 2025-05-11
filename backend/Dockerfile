# Étape 1 : builder l'app dans /app
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Installer les dépendances (depuis backend/)
COPY backend/package*.json ./
RUN npm ci

# 2. Copier le schema Prisma et générer le client
COPY backend/prisma ./prisma
RUN npx prisma generate

# 3. Copier le code source et compiler
COPY backend/src ./src
COPY backend/tsconfig.json ./
RUN npm run build

# Étape 2 : image de production allégée
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
