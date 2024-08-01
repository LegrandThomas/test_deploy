import { MigrationInterface, QueryRunner } from "typeorm";
import seedRoles from '../seeder/role-seeder';
import seedUsers from '../seeder/user-seeder';

export class InitialSchema1641211240000 implements MigrationInterface {
    name = 'InitialSchema1641211240000'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await this.seedDatabase();
        console.log('seeding tables roles et users effectué');
    }

    
    private async seedDatabase(): Promise<void> {
      try {
         console.log('Seeding roles...');
         await seedRoles();
         console.log('Roles seeding completed.');
     } catch (seedError) {
         console.error('Error seeding roles:', seedError);
         throw seedError;
     }

        try {
            await seedUsers();
            console.log('Users seeding completed.');
        } catch (seedError) {
            console.error('Error seeding users:', seedError);
            throw seedError;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                -- Supprimer les contraintes de clés étrangères d'abord

                ALTER TABLE follow DROP CONSTRAINT IF EXISTS fk_user_1;
                ALTER TABLE follow DROP CONSTRAINT IF EXISTS fk_user;
                ALTER TABLE refer DROP CONSTRAINT IF EXISTS fk_sharing_session;
                ALTER TABLE refer DROP CONSTRAINT IF EXISTS fk_tag;
                ALTER TABLE reference DROP CONSTRAINT IF EXISTS fk_sharing_session;
                ALTER TABLE reference DROP CONSTRAINT IF EXISTS fk_ressource;
                ALTER TABLE have DROP CONSTRAINT IF EXISTS fk_ressource;
                ALTER TABLE have DROP CONSTRAINT IF EXISTS fk_tag;
                ALTER TABLE ressources_status_history DROP CONSTRAINT IF EXISTS fk_ressource;
                ALTER TABLE comments DROP CONSTRAINT IF EXISTS fk_ressource;
                ALTER TABLE comments DROP CONSTRAINT IF EXISTS fk_user;
                ALTER TABLE comments DROP CONSTRAINT IF EXISTS fk_comment_1;
                ALTER TABLE sharing_sessions DROP CONSTRAINT IF EXISTS fk_user;
                ALTER TABLE ressources DROP CONSTRAINT IF EXISTS fk_user_1;
                ALTER TABLE ressources DROP CONSTRAINT IF EXISTS fk_ressource_status;
                ALTER TABLE ressources DROP CONSTRAINT IF EXISTS fk_ressource_type;
                ALTER TABLE ressources DROP CONSTRAINT IF EXISTS fk_user;
                ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_role;

                -- Supprimer les tables

                DROP TABLE IF EXISTS follow;
                DROP TABLE IF EXISTS refer;
                DROP TABLE IF EXISTS reference;
                DROP TABLE IF EXISTS have;
                DROP TABLE IF EXISTS ressources_status_history;
                DROP TABLE IF EXISTS comments;
                DROP TABLE IF EXISTS sharing_sessions;
                DROP TABLE IF EXISTS ressources;
                DROP TABLE IF EXISTS users;
                DROP TABLE IF EXISTS ressources_status;
                DROP TABLE IF EXISTS ressources_types;
                DROP TABLE IF EXISTS roles;
                DROP TABLE IF EXISTS tags;

                -- Supprimer l'extension UUID
                DROP EXTENSION IF EXISTS "uuid-ossp";
            `);
        } catch (error) {
            console.error('Error during rollback:', error);
            throw error;
        }
    }
}
