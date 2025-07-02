import { useState, useCallback } from 'react';
import { RegimeTva } from '@/schemas/regimeTvaSchema';

export const useRegimeTva = () => {
  const [regimesTva, setRegimesTva] = useState<RegimeTva[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all regimes TVA
  const fetchRegimesTva = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/regime_tva', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRegimesTva(data);
      } else {
        throw new Error('Erreur lors de la récupération des régimes de TVA');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add regime TVA
  const addRegimeTva = useCallback(async (regimeTvaData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/regime_tva/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(regimeTvaData),
      });

      if (response.ok) {
        await fetchRegimesTva(); // Refresh list
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
  }, [fetchRegimesTva]);

  // Update regime TVA
  const updateRegimeTva = useCallback(async (regimeTvaData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/regime_tva/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(regimeTvaData),
      });

      if (response.ok) {
        await fetchRegimesTva(); // Refresh list
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
  }, [fetchRegimesTva]);

  // Delete regime TVA
  const deleteRegimeTva = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/regime_tva/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        await fetchRegimesTva(); // Refresh list
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
  }, [fetchRegimesTva]);

  // Get regime TVA by reference
  const getRegimeTvaByReference = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/regime_tva/reference', {
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
        throw new Error('Régime de TVA non trouvé');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    regimesTva,
    isLoading,
    error,
    fetchRegimesTva,
    addRegimeTva,
    updateRegimeTva,
    deleteRegimeTva,
    getRegimeTvaByReference,
    refetch: fetchRegimesTva,
  };
}; 