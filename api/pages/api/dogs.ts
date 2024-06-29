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
    crossOrigin:'anonymous'
  });

  if (req.method === 'POST') {
    const { name, breed } = req.body;

    if (!name || !breed  === undefined) {
      return res.status(400).json({ error: 'Name, breed are required' });
    }

    try {
      const result = await client.query(
        'INSERT INTO dogs (name, breed) VALUES ($1, $2) RETURNING *',
        [name, breed]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await client.query('SELECT * FROM dogs');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const { id, name, breed} = req.body;

    if (!id || !name || !breed  === undefined) {
      return res.status(400).json({ error: 'ID, name, breed are required' });
    }

    try {
      const result = await client.query(
        'UPDATE dogs SET name = $1, breed = $2 WHERE id = $3 RETURNING *',
        [name, breed, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Dog not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PATCH') {
    const { id, name, breed } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }
    if (breed) {
      fields.push(`breed = $${index++}`);
      values.push(breed);
    }
    

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    try {
      const result = await client.query(
        `UPDATE dogs SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
        values
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Dog not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    try {
      const result = await client.query(
        'DELETE FROM dogs WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Dog not found' });
      }

      res.status(200).json({ message: 'Dog deleted successfully' });
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
