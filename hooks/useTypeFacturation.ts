import { useState, useCallback } from 'react';
import { TypeFacturation } from '@/schemas/typeFacturationSchema';

export const useTypeFacturation = () => {
  const [typeFacturations, setTypeFacturations] = useState<TypeFacturation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all type facturations
  const fetchTypeFacturations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_facturation', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTypeFacturations(data);
      } else {
        throw new Error('Erreur lors de la récupération des types de facturation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add type facturation
  const addTypeFacturation = useCallback(async (typeFacturationData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_facturation/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(typeFacturationData),
      });

      if (response.ok) {
        await fetchTypeFacturations(); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTypeFacturations]);

  // Update type facturation
  const updateTypeFacturation = useCallback(async (typeFacturationData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_facturation/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(typeFacturationData),
      });

      if (response.ok) {
        await fetchTypeFacturations(); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTypeFacturations]);

  // Delete type facturation
  const deleteTypeFacturation = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_facturation/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        await fetchTypeFacturations(); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchTypeFacturations]);

  // Get type facturation by reference
  const getTypeFacturationByReference = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_facturation/reference', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Type de facturation non trouvé');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    typeFacturations,
    isLoading,
    error,
    fetchTypeFacturations,
    addTypeFacturation,
    updateTypeFacturation,
    deleteTypeFacturation,
    getTypeFacturationByReference,
    refetch: fetchTypeFacturations,
  };
}; 