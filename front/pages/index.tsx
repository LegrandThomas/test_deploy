import { useEffect, useState } from 'react';

interface User {
  user_uuid: string;
  username: string;
  email: string;
  created_at:string;
  updated_at:string;
  role_uuid:string;
  is_active:string

}

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/dog');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {users.map((user) => (
          <li key={user.user_uuid}>{user.username} - {user.email} - {user.is_active} - {user.role_uuid} - {user.created_at} - {user.updated_at}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
