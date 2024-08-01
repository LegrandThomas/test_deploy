import Cors from 'nextjs-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

const client = new Client({
  host: 'postgres',
  database: 'base_test',
  user: 'postgres',
  password: 'password',
});

client.connect().catch(error => console.log(error));

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await Cors(req, res, {
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    origin: 'http://localhost:3000',
    crossOrigin: 'anonymous'
  });
  
  if (req.method === 'POST') {
    const { username, email, password, is_active, role_uuid } = req.body;

    if (!username || !email || !password || !role_uuid) {
      return res.status(400).json({ error: 'Username, email, password, and role UUID are required' });
    }

    try {
      // Check if the role_uuid exists in the roles table
      const roleResult = await client.query('SELECT * FROM roles WHERE role_uuid = $1', [role_uuid]);
      if (roleResult.rowCount === 0) {
        return res.status(400).json({ error: 'Invalid role UUID' });
      }

      // Insert the new user
      const result = await client.query(
        'INSERT INTO users (username, email, password, is_active, role_uuid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, email, password, is_active ?? true, role_uuid]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await client.query('SELECT * FROM users');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const { user_uuid, username, email, password, is_active, role_uuid } = req.body;

    if (!user_uuid || !username || !email || !role_uuid) {
      return res.status(400).json({ error: 'User UUID, username, email, and role UUID are required' });
    }

    try {
      // Check if the role_uuid exists in the roles table
      const roleResult = await client.query('SELECT * FROM roles WHERE role_uuid = $1', [role_uuid]);
      if (roleResult.rowCount === 0) {
        return res.status(400).json({ error: 'Invalid role UUID' });
      }

      // Update the user
      const result = await client.query(
        'UPDATE users SET username = $1, email = $2, password = $3, is_active = $4, role_uuid = $5 WHERE user_uuid = $6 RETURNING *',
        [username, email, password, is_active ?? true, role_uuid, user_uuid]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
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
      // Check if the role_uuid exists in the roles table
      const roleResult = await client.query('SELECT * FROM roles WHERE role_uuid = $1', [role_uuid]);
      if (roleResult.rowCount === 0) {
        return res.status(400).json({ error: 'Invalid role UUID' });
      }

      fields.push(`role_uuid = $${index++}`);
      values.push(role_uuid);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(user_uuid);

    try {
      const result = await client.query(
        `UPDATE users SET ${fields.join(', ')} WHERE user_uuid = $${index} RETURNING *`,
        values
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    const { user_uuid } = req.body;

    if (!user_uuid) {
      return res.status(400).json({ error: 'User UUID is required' });
    }

    try {
      const result = await client.query(
        'DELETE FROM users WHERE user_uuid = $1 RETURNING *',
        [user_uuid]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
