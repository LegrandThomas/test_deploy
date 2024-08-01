import { AppDataSource } from '../data-source';
import { Roles} from '../entity/role';

const seedRoles = async () => {
    try{
  const roleRepository = AppDataSource.getRepository(Roles);
  const roles = [
    { role_name: 'Admin' },
    { role_name: 'User' },
    { role_name: 'Guest' },
  ];

  for (const role of roles) {
    const newRole = roleRepository.create(role);
    console.log(newRole);
    await roleRepository.save(newRole);
  }
  console.log('Roles seeded');
}catch (error) {
    console.error('Error seeding roles:', error);
}
};

export default seedRoles;
