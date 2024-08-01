import Cors from 'nextjs-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { Client, QueryResult } from 'pg';

// Initialise la connexion à la base de données
const client = new Client({
  host: 'postgres',
  database: 'base_test',
  user: 'postgres',
  password: 'password',
});

client.connect().catch(error => console.error('Failed to connect to the database:', error));

// Fonction utilitaire pour vérifier le résultat de la requête
const getRowCount = (result: QueryResult<any>) => {
  return result?.rowCount ?? 0;
};

// Fonction utilitaire pour vérifier si des résultats existent
const hasRows = (result: QueryResult<any>) => {
  return getRowCount(result) > 0;
};

// Fonction principale pour traiter les requêtes API
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await Cors(req, res, {
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    origin: 'http://localhost:3000',
    crossOrigin: 'anonymous'
  });

  try {
    if (req.method === 'POST') {
      const { username, email, password, is_active, role_uuid } = req.body;

      if (!username || !email || !password || !role_uuid) {
        return res.status(400).json({ error: 'Username, email, password, and role UUID are required' });
      }

      // Vérifie si le role_uuid existe dans la table des rôles
      const roleResult = await client.query('SELECT * FROM roles WHERE role_uuid = $1', [role_uuid]);
      if (!hasRows(roleResult)) {
        return res.status(400).json({ error: 'Invalid role UUID' });
      }

      // Vérifie si le nom d'utilisateur ou l'email existe déjà
      const existingUser = await client.query(
        'SELECT * FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );

      if (hasRows(existingUser)) {
        const user = existingUser.rows[0];
        if (user.username === username) {
          return res.status(400).json({ error: 'Username is already in use' });
        }
        if (user.email === email) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
      }

      // Insère le nouvel utilisateur
      const result = await client.query(
        'INSERT INTO users (username, email, password, is_active, role_uuid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, email, password, is_active ?? true, role_uuid]
      );

      res.status(201).json(result.rows[0]);

    } else if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM users');
      res.status(200).json(result.rows);

    } else if (req.method === 'PUT') {
      const { user_uuid, username, email, password, is_active, role_uuid } = req.body;

      if (!user_uuid || !username || !email || !role_uuid) {
        return res.status(400).json({ error: 'User UUID, username, email, and role UUID are required' });
      }

      // Vérifie si le role_uuid existe dans la table des rôles
      const roleResult = await client.query('SELECT * FROM roles WHERE role_uuid = $1', [role_uuid]);
      if (!hasRows(roleResult)) {
        return res.status(400).json({ error: 'Invalid role UUID' });
      }

      // Vérifie si l'utilisateur existe
      const userResult = await client.query('SELECT * FROM users WHERE user_uuid = $1', [user_uuid]);
      if (!hasRows(userResult)) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Vérifie si le nom d'utilisateur ou l'email existe déjà (en excluant l'utilisateur actuel)
      const existingUser = await client.query(
        'SELECT * FROM users WHERE (username = $1 OR email = $2) AND user_uuid != $3',
        [username, email, user_uuid]
      );

      if (hasRows(existingUser)) {
        const user = existingUser.rows[0];
        if (user.username === username) {
          return res.status(400).json({ error: 'Username is already in use' });
        }
        if (user.email === email) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
      }

      // Met à jour l'utilisateur
      const result = await client.query(
        'UPDATE users SET username = $1, email = $2, password = $3, is_active = $4, role_uuid = $5 WHERE user_uuid = $6 RETURNING *',
        [username, email, password, is_active ?? true, role_uuid, user_uuid]
      );

      if (!hasRows(result)) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(result.rows[0]);

    } else if (req.method === 'PATCH') {
      const { user_uuid, username, email, password, is_active, role_uuid } = req.body;

      if (!user_uuid) {
        return res.status(400).json({ error: 'User UUID is required' });
      }

      const fields = [];
      const values = [];
      let index = 1;

      if (username) {
        fields.push(`username = $${index++}`);
        values.push(username);
      }
      if (email) {
        fields.push(`email = $${index++}`);
        values.push(email);
      }
      if (password) {
        fields.push(`password = $${index++}`);
        values.push(password);
      }
      if (is_active !== undefined) {
        fields.push(`is_active = $${index++}`);
        values.push(is_active);
      }
      if (role_uuid) {
        // Vérifie si le role_uuid existe dans la table des rôles
        const roleResult = await client.query('SELECT * FROM roles WHERE role_uuid = $1', [role_uuid]);
        if (!hasRows(roleResult)) {
          return res.status(400).json({ error: 'Invalid role UUID' });
        }

        fields.push(`role_uuid = $${index++}`);
        values.push(role_uuid);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(user_uuid);

      // Vérifie si l'utilisateur existe
      const userResult = await client.query('SELECT * FROM users WHERE user_uuid = $1', [user_uuid]);
      if (!hasRows(userResult)) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Vérifie si le nom d'utilisateur ou l'email existe déjà (en excluant l'utilisateur actuel)
      const existingUser = await client.query(
        'SELECT * FROM users WHERE (username = $1 OR email = $2) AND user_uuid != $3',
        [username, email, user_uuid]
      );

      if (hasRows(existingUser)) {
        const user = existingUser.rows[0];
        if (user.username === username) {
          return res.status(400).json({ error: 'Username is already in use' });
        }
        if (user.email === email) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
      }

      const result = await client.query(
        `UPDATE users SET ${fields.join(', ')} WHERE user_uuid = $${index} RETURNING *`,
        values
      );

      if (!hasRows(result)) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(result.rows[0]);

    } else if (req.method === 'DELETE') {
      const { user_uuid } = req.body;

      if (!user_uuid) {
        return res.status(400).json({ error: 'User UUID is required' });
      }

      const result = await client.query(
        'DELETE FROM users WHERE user_uuid = $1 RETURNING *',
        [user_uuid]
      );

      if (!hasRows(result)) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
