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

# Construction de l'application frontend
RUN npm run build

# Exposition du port nécessaire pour le frontend
EXPOSE 3000

# Commande pour démarrer le serveur frontend
CMD ["npm", "run", "start"]
