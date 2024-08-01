# Étape de build
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances et installer les dépendances de production uniquement
COPY package*.json ./
RUN npm install --production

# Copier les fichiers de configuration et les fichiers source
COPY . .

# Construire l'application
RUN npm run build

# Étape finale
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier uniquement les artefacts nécessaires depuis l'étape de build
COPY --from=build /usr/src/app ./

# Exposer le port nécessaire pour l'API
EXPOSE 3001

# Ajouter le script de migration au démarrage
CMD ["sh", "-c", "npx ts-node ./run-migrations.ts && npm start"]