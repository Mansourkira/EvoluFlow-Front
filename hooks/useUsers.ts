import { useState } from 'react';

export interface CreateUserData {
  reference: string;
  nom: string;
  prenom: string;
  adresse: string;
  complement_adresse?: string;
  code_postal: string;
  ville: string;
  gouvernorat: string;
  pays: string;
  telephone: string;
  type_utilisateur: string;
  e_mail: string;
  mot_de_passe: string;
  site_defaut: string;
  profil: string;
  image?: File | null;
}

export interface User extends CreateUserData {
  id: string;
  utilisateur: string;
  heure: string;
}

interface UseUsersReturn {
  addUser: (userData: CreateUserData) => Promise<User>;
  isLoading: boolean;
  error: string | null;
}

export const useUsers = (): UseUsersReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUser = async (userData: CreateUserData): Promise<User> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create FormData for file upload if image exists
      const formData = new FormData();
      
      // Append all user data to FormData
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'image' && value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'string') {
            formData.append(key, value);
          }
        }
      });

      // Make API call to your backend
      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it for FormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create user' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newUser = await response.json();
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addUser,
    isLoading,
    error,
  };
}; 