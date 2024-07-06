# Utilisation de l'image Node.js LTS comme base
FROM node:20-alpine

# Création du répertoire de travail
WORKDIR /usr/src/app

# Copie des fichiers nécessaires
COPY package*.json ./
COPY next.config.mjs ./
COPY pages ./pages

# Installation des dépendances
RUN npm install 

# Construction de l'api
RUN npm run build

# Exposition du port nécessaire pour l'API
EXPOSE 3001

# Commande pour démarrer l'API
CMD ["npm", "run", "start"]
