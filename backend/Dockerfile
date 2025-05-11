# Étape 1 : builder l'app dans /app
FROM node:18-alpine AS builder
WORKDIR /app

# 1. Installer les dépendances
COPY backend/package*.json ./
RUN npm ci

# 2. Copier le schéma Prisma et générer le client
COPY backend/prisma ./prisma
RUN npx prisma generate

# 3. Copier le code source, compiler en JS
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build

# Étape 2 : image de production allégée
FROM node:18-alpine AS runner
WORKDIR /app

# 1. Installer les dépendances de prod seulement
COPY backend/package*.json ./
RUN npm ci --production

# 2. Copier le client Prisma généré
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# 3. Copier le build compilé et le dossier Prisma (migrations/schéma)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Environnement
ENV NODE_ENV=production
EXPOSE 4000

# Lancement de l'application
CMD ["node", "dist/index.js"]
