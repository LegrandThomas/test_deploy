import { MigrationInterface, QueryRunner } from "typeorm";
import seedRoles from '../seeder/role-seeder';
import seedUsers from '../seeder/user-seeder';

export class InitialSchema1641211240000 implements MigrationInterface {
    name = 'InitialSchema1641211240000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crée l'extension UUID
      //   await this.createUUIDExtension(queryRunner);
      //   console.log('création de l\'extension UUID ok');
      //   // Crée les tables
      //   await this.createTables(queryRunner);
      //   console.log('création des tables terminée');
        // Ensuite, exécutez les seeders
        await this.seedDatabase();
        console.log('seeding tables roles et users effectué');
    }

    private async createUUIDExtension(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
            console.log('UUID extension created or already exists.');
        } catch (error) {
            console.error('Error creating UUID extension:', error);
            throw error;
        }
    }

    private async createTables(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`
                CREATE TABLE IF NOT EXISTS tags (
                   tag_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
                   tag_title VARCHAR(100) NOT NULL,
                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   PRIMARY KEY(tag_uuid),
                   UNIQUE(tag_title)
                );
                
                CREATE TABLE IF NOT EXISTS roles (
                   role_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
                   role_name VARCHAR(100) NOT NULL,
                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   PRIMARY KEY(role_uuid),
                   UNIQUE(role_name)
                );

                CREATE TABLE IF NOT EXISTS ressources_types (
                   ressource_type_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
                   type_name VARCHAR(50) NOT NULL,
                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   PRIMARY KEY(ressource_type_uuid),
                   UNIQUE(type_name)
                );

                CREATE TABLE IF NOT EXISTS ressources_status (
                   ressource_status_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
                   name VARCHAR(100) NOT NULL,
                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   PRIMARY KEY(ressource_status_uuid),
                   UNIQUE(name)
                );

                CREATE TABLE IF NOT EXISTS users (
                   user_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
                   username VARCHAR(100) NOT NULL,
                   email VARCHAR(100) NOT NULL,
                   password VARCHAR(255) NOT NULL,
                   is_active BOOLEAN NOT NULL DEFAULT TRUE,
                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   role_uuid UUID NOT NULL,
                   PRIMARY KEY(user_uuid),
                   UNIQUE(username),
                   UNIQUE(email)
                );

                CREATE TABLE IF NOT EXISTS ressources (
                   ressource_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
                   title VARCHAR(50) NOT NULL,
                   content TEXT,
                   summary VARCHAR(255),
                   is_reported BOOLEAN NOT NULL,
                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   user_uuid UUID NOT NULL,
                   ressource_type_uuid UUID NOT NULL,
                   ressource_status_uuid UUID NOT NULL,
                   user_uuid_1 UUID NOT NULL,
                   PRIMARY KEY(ressource_uuid),
                   UNIQUE(title)
                );

                CREATE TABLE IF NOT EXISTS sharing_sessions (
                   sharing_session_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
                   title VARCHAR(255) NOT NULL,
                   description TEXT,
                   event_start_datetime TIMESTAMPTZ NOT NULL,
                   event_end_datetime TIMESTAMPTZ NOT NULL,
                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   user_uuid UUID NOT NULL,
                   PRIMARY KEY(sharing_session_uuid),
                   UNIQUE(title)
                );

                CREATE TABLE IF NOT EXISTS comments (
                   comment_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
                   content VARCHAR(255),
                   is_reported BOOLEAN,
                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   comment_uuid_1 UUID,
                   user_uuid UUID NOT NULL,
                   ressource_uuid UUID NOT NULL,
                   PRIMARY KEY(comment_uuid),
                   UNIQUE(comment_uuid_1)
                );

                CREATE TABLE IF NOT EXISTS ressources_status_history (
                   ressource_status_history_uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
                   status_changed_at TIMESTAMPTZ NOT NULL,
                   preview_state VARCHAR(50),
                   new_state VARCHAR(50),
                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   ressource_uuid UUID NOT NULL,
                   PRIMARY KEY(ressource_status_history_uuid)
                );

                CREATE TABLE IF NOT EXISTS have (
                   tag_uuid UUID NOT NULL,
                   ressource_uuid UUID NOT NULL,
                   PRIMARY KEY(tag_uuid, ressource_uuid)
                );

                CREATE TABLE IF NOT EXISTS reference (
                   ressource_uuid UUID NOT NULL,
                   sharing_session_uuid UUID NOT NULL,
                   PRIMARY KEY(ressource_uuid, sharing_session_uuid)
                );

                CREATE TABLE IF NOT EXISTS refer (
                   tag_uuid UUID NOT NULL,
                   sharing_session_uuid UUID NOT NULL,
                   PRIMARY KEY(tag_uuid, sharing_session_uuid)
                );

                CREATE TABLE IF NOT EXISTS follow (
                   user_uuid UUID NOT NULL,
                   user_uuid_1 UUID NOT NULL,
                   PRIMARY KEY(user_uuid, user_uuid_1)
                );
                
                -- Ajoute les contraintes de clés étrangères après la création des tables

                ALTER TABLE users
                   ADD CONSTRAINT fk_role
                   FOREIGN KEY(role_uuid) REFERENCES roles(role_uuid);

                ALTER TABLE ressources
                   ADD CONSTRAINT fk_user
                   FOREIGN KEY(user_uuid) REFERENCES users(user_uuid);

                ALTER TABLE ressources
                   ADD CONSTRAINT fk_ressource_type
                   FOREIGN KEY(ressource_type_uuid) REFERENCES ressources_types(ressource_type_uuid);

                ALTER TABLE ressources
                   ADD CONSTRAINT fk_ressource_status
                   FOREIGN KEY(ressource_status_uuid) REFERENCES ressources_status(ressource_status_uuid);

                ALTER TABLE ressources
                   ADD CONSTRAINT fk_user_1
                   FOREIGN KEY(user_uuid_1) REFERENCES users(user_uuid);

                ALTER TABLE sharing_sessions
                   ADD CONSTRAINT fk_user
                   FOREIGN KEY(user_uuid) REFERENCES users(user_uuid);

                ALTER TABLE comments
                   ADD CONSTRAINT fk_comment_1
                   FOREIGN KEY(comment_uuid_1) REFERENCES comments(comment_uuid);

                ALTER TABLE comments
                   ADD CONSTRAINT fk_user
                   FOREIGN KEY(user_uuid) REFERENCES users(user_uuid);

                ALTER TABLE comments
                   ADD CONSTRAINT fk_ressource
                   FOREIGN KEY(ressource_uuid) REFERENCES ressources(ressource_uuid);

                ALTER TABLE ressources_status_history
                   ADD CONSTRAINT fk_ressource
                   FOREIGN KEY(ressource_uuid) REFERENCES ressources(ressource_uuid);

                ALTER TABLE have
                   ADD CONSTRAINT fk_tag
                   FOREIGN KEY(tag_uuid) REFERENCES tags(tag_uuid);

                ALTER TABLE have
                   ADD CONSTRAINT fk_ressource
                   FOREIGN KEY(ressource_uuid) REFERENCES ressources(ressource_uuid);

                ALTER TABLE reference
                   ADD CONSTRAINT fk_ressource
                   FOREIGN KEY(ressource_uuid) REFERENCES ressources(ressource_uuid);

                ALTER TABLE reference
                   ADD CONSTRAINT fk_sharing_session
                   FOREIGN KEY(sharing_session_uuid) REFERENCES sharing_sessions(sharing_session_uuid);

                ALTER TABLE refer
                   ADD CONSTRAINT fk_tag
                   FOREIGN KEY(tag_uuid) REFERENCES tags(tag_uuid);

                ALTER TABLE refer
                   ADD CONSTRAINT fk_sharing_session
                   FOREIGN KEY(sharing_session_uuid) REFERENCES sharing_sessions(sharing_session_uuid);

                ALTER TABLE follow
                   ADD CONSTRAINT fk_user
                   FOREIGN KEY(user_uuid) REFERENCES users(user_uuid);

                ALTER TABLE follow
                   ADD CONSTRAINT fk_user_1
                   FOREIGN KEY(user_uuid_1) REFERENCES users(user_uuid);
            `);
            console.log('Tables and foreign keys created.');
        } catch (error) {
            console.error('Error creating tables:', error);
            throw error;
        }
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
