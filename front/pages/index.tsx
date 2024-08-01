import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';

// Définition des styles
const StyledCard = styled(Card)({
  margin: '10px',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

interface User {
  user_uuid: string;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
  role: {
    name: string;
  };
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
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Liste des utilisateurs
      </Typography>
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.user_uuid}>
            <StyledCard>
              <CardContent>
                <Typography variant="h5">
                  {user.username}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {user.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Role:</strong> {user.role.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
