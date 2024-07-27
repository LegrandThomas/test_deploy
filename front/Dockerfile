# Étape de build
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances et installer les dépendances
COPY package*.json ./
RUN npm install --production

# Copier les fichiers de source et de configuration
COPY . .

# Construire l'application
RUN npm run build

# Étape finale
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier uniquement les artefacts nécessaires depuis l'étape de build
COPY --from=build /usr/src/app ./

# Exposer le port nécessaire
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start"]
