#!/bin/sh

# Démarrer l'API
npm run start &

# Attendre que l'API soit démarrée
sleep 10

# Exécuter les tests
npm run test
