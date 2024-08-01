// src/seeder/user-seeder.ts
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { Roles } from '../entity/role';

const seedUsers = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Roles);

    // récupération des roles
    const adminRole = await roleRepository.findOneBy({ role_name: 'Admin' });
    const userRole = await roleRepository.findOneBy({ role_name: 'User' });
    const guestRole = await roleRepository.findOneBy({ role_name: 'Guest' });

    if (!adminRole || !userRole || !guestRole) {
      throw new Error('One or more roles not found.');
    }

    // seed d'utilisateur example
    const users = [
      { username: 'admin', email: 'admin@example.com', password: 'adminpass', role: adminRole },
      { username: 'user1', email: 'user1@example.com', password: 'user1pass', role: userRole },
      { username: 'guest1', email: 'guest1@example.com', password: 'guest1pass', role: guestRole },
    ];

    for (const user of users) {
      const newUser = userRepository.create(user);
      console.log(newUser);
      await userRepository.save(newUser);
    }

    console.log('Users seeded');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export default seedUsers;
