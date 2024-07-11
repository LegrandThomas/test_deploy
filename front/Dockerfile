# Étape de build
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install 

# Copier les fichiers de source et de configuration
COPY next.config.mjs ./
COPY pages ./pages

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
