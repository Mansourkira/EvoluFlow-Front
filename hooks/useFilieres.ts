import { useState, useCallback } from 'react';
import { Filiere } from '@/schemas/filiereSchema';

export const useFilieres = () => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all filieres
  const fetchFilieres = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/filiere', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFilieres(data);
      } else {
        throw new Error('Erreur lors de la récupération des filières');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add filiere
  const addFiliere = useCallback(async (filiereData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/filiere/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filiereData),
      });

      if (response.ok) {
        await fetchFilieres(); // Refresh list
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
  }, [fetchFilieres]);

  // Update filiere
  const updateFiliere = useCallback(async (filiereData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/filiere/update', {
        method: 'PUT',    
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filiereData),
      });

      if (response.ok) {
        await fetchFilieres(); // Refresh list
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
  }, [fetchFilieres]);

  // Delete filiere
  const deleteFiliere = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/filiere/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        await fetchFilieres(); // Refresh list
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
  }, [fetchFilieres]);

  // Get filiere by reference
  const getFiliereByReference = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/filiere/reference', {
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
        throw new Error('Filière non trouvée');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    filieres,
    isLoading,
    error,
    fetchFilieres,
    addFiliere,
    updateFiliere,
    deleteFiliere,
    getFiliereByReference,
    refetch: fetchFilieres,
  };
}; 