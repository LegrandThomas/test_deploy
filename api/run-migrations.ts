import { AppDataSource } from './data-source';
import { MigrationExecutor } from 'typeorm';
import { Logger } from 'winston';
import winston from 'winston';

// Configurer winston pour des logs avancés
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

const runMigrations = async () => {
  try {
    // Créer une connexion à la base de données
    await AppDataSource.initialize();
    logger.info('Database connection established.');

    // Créer un exécuteur de migrations
    const migrationExecutor = new MigrationExecutor(AppDataSource);
    
    // Charger toutes les migrations
    const migrations = await migrationExecutor.getAllMigrations();
    logger.info(`Found ${migrations.length} migrations.`);

    for (const migration of migrations) {
      logger.info(`Running migration: ${migration.name}`);
    }

    // Exécuter les migrations
    const result = await AppDataSource.runMigrations();
    logger.info('Migrations completed successfully!');

    result.forEach(migration => {
      logger.info(`Executed migration: ${migration.name}`);
    });
  } catch (error) {
    logger.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    // Fermer la connexion à la base de données
    await AppDataSource.destroy();
    logger.info('Database connection closed.');
  }
};

// Exécuter les migrations
runMigrations();
