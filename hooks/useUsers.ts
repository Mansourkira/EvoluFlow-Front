import { useEffect, useState } from 'react';

export interface User {
  Reference: string;
  Nom_Prenom: string;
  Adresse?: string;
  Telephone?: string;
  E_mail?: string;
    Type_Utilisateur?: string;
  Heure?: string;
  // ajoute ici d'autres champs si nécessaire
}

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3000/api/v1/UsersList', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Réponse brute de l\'API users :', data);

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Expected array but received:', data);
        setUsers([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
  };
};
