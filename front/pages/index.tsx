import { useEffect, useState } from 'react';

interface User {
  user_uuid: string;
  username: string;
  email: string;
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
          <li key={user.user_uuid}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
