# Utilisation de l'image Node.js LTS comme base
FROM node:20-alpine

# Création du répertoire de travail
WORKDIR /usr/src/app

# Copie des fichiers nécessaires
COPY package*.json ./
COPY next.config.mjs ./
COPY __tests__ ./__tests__
COPY pages ./pages

# Copier le script de démarrage personnalisé
COPY start-and-test.sh ./

# Rendre le script exécutable
RUN chmod +x start-and-test.sh

# Installation des dépendances
RUN npm install --production

# Construction de l'api
RUN npm run build

# Exposition du port nécessaire pour l'API
EXPOSE 3001

# Commande pour démarrer l'API et exécuter les tests
CMD ["./start-and-test.sh"]
