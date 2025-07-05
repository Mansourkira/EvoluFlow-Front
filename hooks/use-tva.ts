import { useState, useCallback } from 'react';

import { type Tva } from '@/schemas/tvaSchema';


export const useTvas = () => {
  const [tvas, setTvas] = useState<Tva[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'http://localhost:3000/api/v1';

  const fetchTvas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/tva/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTvas(data);
      } else {
        throw new Error('Erreur lors de la récupération des TVA');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTva = useCallback(async (tvaData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/tva/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tvaData),
      });

      if (response.ok) {
        await fetchTvas();
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTvas]);

  const updateTva = useCallback(async (tvaData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/tva/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tvaData),
      });

      if (response.ok) {
        await fetchTvas();
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la modification");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTvas]);

  const deleteTva = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/tva/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        await fetchTvas();
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTvas]);

  const getTvaByReference = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/tva/get`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("TVA non trouvée");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tvas,
    isLoading,
    error,
    fetchTvas,
    addTva,
    updateTva,
    deleteTva,
    getTvaByReference,
    refetch: fetchTvas,
  };
};
