import Cors from 'nextjs-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/database';
import { User } from '../../entity/user'; // Assurez-vous que le chemin est correct
import { Roles } from '../../entity/role'; // Assurez-vous que le chemin est correct

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await Cors(req, res, {
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    origin: 'http://localhost:3000',
    crossOrigin: 'anonymous'
  });

  const dataSource = await connectToDatabase();
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Roles);

  if (req.method === 'POST') {
    const { username, email, password, is_active, role_uuid } = req.body;

    if (!username || !email || !password || !role_uuid) {
      return res.status(400).json({ error: 'Username, email, password, and role UUID are required' });
    }

    try {
      const role = await roleRepository.findOne({ where: { role_uuid } });

      if (!role) {
        return res.status(400).json({ error: 'Invalid role UUID' });
      }

      const existingUser = await userRepository.findOne({
        where: [
          { email },
          { username }
        ]
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
        if (existingUser.username === username) {
          return res.status(400).json({ error: 'Username is already in use' });
        }
      }

      const user = new User();
      user.username = username;
      user.email = email;
      user.password = password;
      user.is_active = is_active ?? true;
      user.role = role;

      const result = await userRepository.save(user);
      res.status(201).json(result);
    } catch (err) {
      console.error(err);

      // Vérifiez si err est une instance d'Error
      if (err instanceof Error) {
        // Ici vous pouvez gérer les erreurs spécifiques
        if (err.message.includes('unique constraint')) {
          return res.status(400).json({ error: 'Email or Username already in use' });
        }
        return res.status(500).json({ error: 'Internal Server Error', message: err.message });
      }

      // Cas de sécurité si err n'est pas une instance d'Error
      res.status(500).json({ error: 'Internal Server Error', message: 'An unknown error occurred' });
    }
  } else if (req.method === 'GET') {
    try {
      const users = await userRepository.find({ relations: ['role'] });
      res.status(200).json(users);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error', message: 'An unknown error occurred' });
      }
    }
  } else if (req.method === 'PUT') {
    const { user_uuid, username, email, password, is_active, role_uuid } = req.body;

    if (!user_uuid || !username || !email || !role_uuid) {
      return res.status(400).json({ error: 'User UUID, username, email, and role UUID are required' });
    }

    try {
      const role = await roleRepository.findOne({ where: { role_uuid } });

      if (!role) {
        return res.status(400).json({ error: 'Invalid role UUID' });
      }

      const user = await userRepository.findOne({ where: { user_uuid } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const existingUser = await userRepository.findOne({
        where: [
          { email },
          { username }
        ]
      });

      if (existingUser && existingUser.user_uuid !== user_uuid) {
        if (existingUser.email === email) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
        if (existingUser.username === username) {
          return res.status(400).json({ error: 'Username is already in use' });
        }
      }

      user.username = username;
      user.email = email;
      user.password = password;
      user.is_active = is_active ?? true;
      user.role = role;

      const result = await userRepository.save(user);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        if (err.message.includes('unique constraint')) {
          return res.status(400).json({ error: 'Email or Username already in use' });
        }
        return res.status(500).json({ error: 'Internal Server Error', message: err.message });
      }

      res.status(500).json({ error: 'Internal Server Error', message: 'An unknown error occurred' });
    }
  } else if (req.method === 'PATCH') {
    const { user_uuid, username, email, password, is_active, role_uuid } = req.body;

    if (!user_uuid) {
      return res.status(400).json({ error: 'User UUID is required' });
    }

    try {
      const user = await userRepository.findOne({ where: { user_uuid } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (role_uuid) {
        const role = await roleRepository.findOne({ where: { role_uuid } });

        if (!role) {
          return res.status(400).json({ error: 'Invalid role UUID' });
        }

        user.role = role;
      }

      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = password;
      if (is_active !== undefined) user.is_active = is_active;

      const existingUser = await userRepository.findOne({
        where: [
          { email },
          { username }
        ]
      });

      if (existingUser && existingUser.user_uuid !== user_uuid) {
        if (existingUser.email === email) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
        if (existingUser.username === username) {
          return res.status(400).json({ error: 'Username is already in use' });
        }
      }

      const result = await userRepository.save(user);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        if (err.message.includes('unique constraint')) {
          return res.status(400).json({ error: 'Email or Username already in use' });
        }
        return res.status(500).json({ error: 'Internal Server Error', message: err.message });
      }

      res.status(500).json({ error: 'Internal Server Error', message: 'An unknown error occurred' });
    }
  } else if (req.method === 'DELETE') {
    const { user_uuid } = req.body;

    if (!user_uuid) {
      return res.status(400).json({ error: 'User UUID is required' });
    }

    try {
      const result = await userRepository.delete(user_uuid);

      if (result.affected === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error', message: 'An unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
