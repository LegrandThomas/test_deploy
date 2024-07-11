# Étape de build
FROM node:20-alpine AS build

# Création du répertoire de travail
WORKDIR /usr/src/app

# Copie des fichiers de dépendances uniquement
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie des fichiers de configuration et des fichiers source
COPY next.config.mjs ./
COPY pages ./pages

# Construction de l'API
RUN npm run build

# Étape finale
FROM node:20-alpine

# Création du répertoire de travail
WORKDIR /usr/src/app

# Copier uniquement les artefacts nécessaires depuis l'étape de build
COPY --from=build /usr/src/app ./

# Exposition du port nécessaire pour l'API
EXPOSE 3001

# Commande pour démarrer l'API
CMD ["npm", "run", "start"]
