import { useEffect, useState } from 'react';

interface Dog {
  id: number;
  name: string;
  breed: string;
}

const Home = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dogs');
      if (!response.ok) {
        throw new Error('Failed to fetch dogs');
      }
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  return (
    <div>
      <h1>List of Dogs</h1>
      <ul>
        {dogs.map((dog) => (
          <li key={dog.id}>{dog.name} - {dog.breed}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
