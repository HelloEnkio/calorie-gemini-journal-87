# Étape 1 : builder l'application dans /app
FROM node:18-alpine AS builder
WORKDIR /app

# Instructions pour copier les fichiers backend.
# Cela suppose que votre contexte de build Docker est la racine de votre projet (monorepo)
# et que les fichiers spécifiques au backend se trouvent dans un sous-dossier "backend/".
# Le "./" dans les commandes COPY ci-dessous fait référence à /app (le WORKDIR).

# 1. Copier package.json et package-lock.json, puis installer toutes les dépendances (dev incluses)
# Ceci met en cache la couche des dépendances si package*.json ne changent pas.
COPY backend/package*.json ./
RUN npm ci

# 2. Copier le schéma Prisma et les migrations, puis générer le client Prisma
# Le client Prisma est généré ici et sera copié dans l'image finale.
COPY backend/prisma ./prisma
RUN npx prisma generate

# 3. Copier le reste du code source (tsconfig.json, src/) et compiler l'application TypeScript
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build
# La compilation devrait produire un dossier 'dist' (ou similaire) dans /app

# Étape 2 : image de production allégée et optimisée
FROM node:18-alpine as runner
WORKDIR /app

# Définir l'environnement de production
ENV NODE_ENV=production

# 1. Copier package*.json DEPUIS L'ÉTAPE 'builder'
# MODIFICATION : Ceci garantit que vous utilisez exactement les mêmes versions de dépendances
# que celles résolues dans l'étape 'builder' et évite d'accéder au contexte de build original.
COPY --from=builder /app/package*.json ./

# Installer UNIQUEMENT les dépendances de production.
# CONSEIL : Si 'prisma' (le CLI) est utilisé dans l'ENTRYPOINT (comme c'est le cas ici),
# assurez-vous qu'il est listé dans les 'dependencies' de votre package.json (pas seulement devDependencies).
# Sinon, 'npx' le téléchargera à chaque démarrage du conteneur, ce qui est moins efficace.
RUN npm ci --production

# 2. Copier le client Prisma généré et les binaires du moteur depuis l'étape 'builder'.
# Ces chemins doivent correspondre à l'emplacement où 'prisma generate' place les fichiers.
# Cela assure que le client spécifique à votre schéma est utilisé.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# 3. Copier l'application compilée (ex: le dossier 'dist') depuis l'étape 'builder'
COPY --from=builder /app/dist ./dist

# 4. Copier le dossier 'prisma' (contenant schema.prisma et les migrations) depuis l'étape 'builder'
# Nécessaire pour que 'prisma migrate deploy' puisse trouver le schéma et les fichiers de migration.
COPY --from=builder /app/prisma ./prisma

# Exposer le port sur lequel votre application Node.js écoute
# (Assurez-vous que votre application utilise bien le port 4000)
EXPOSE 4000

# Point d'entrée (ENTRYPOINT) pour exécuter les migrations Prisma puis démarrer l'application.
# L'option '--schema=./prisma/schema.prisma' est relative au WORKDIR (/app).
# L'utilisation de 'sh -c' est commune mais pour des scripts plus complexes, un fichier .sh dédié est préférable.
ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/index.js"]

# Alternative pour l'ENTRYPOINT avec un script externe (plus propre et gère mieux les signaux) :
# COPY backend/entrypoint.sh /app/entrypoint.sh # Assurez-vous que ce script existe et est dans le contexte de build
# RUN chmod +x /app/entrypoint.sh
# ENTRYPOINT ["/app/entrypoint.sh"]
# Contenu de entrypoint.sh (exemple) :
#   #!/bin/sh
#   set -e # Quitte immédiatement si une commande échoue
#   echo "Exécution des migrations Prisma..."
#   npx prisma migrate deploy --schema=./prisma/schema.prisma
#   echo "Démarrage de l'application..."
#   exec node dist/index.js # 'exec' remplace le processus shell par le processus Node