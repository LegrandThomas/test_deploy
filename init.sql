-- Création de la table dogs
CREATE TABLE IF NOT EXISTS dogs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    breed VARCHAR(255) NOT NULL
);

-- Insertion de données initiales
INSERT INTO dogs (name, breed) VALUES
    ('Fido', 'Labrador'),
    ('Peter', 'Pitbull'),
    ('Buddy', 'Golden Retriever');
