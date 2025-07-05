import { useState, useCallback } from 'react';
import { Magasin } from '@/schemas/magasinSchema';

export const useMagasins = () => {
  const [magasins, setMagasins] = useState<Magasin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'http://localhost:3000/api/v1';

  const fetchMagasins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/magasins/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setMagasins(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMagasin = useCallback(
    async (data: Magasin) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const payload = {
          ...data,
          Stock_Negatif: Number(data.Stock_Negatif), // ⚠️ assure qu’on envoie un number
        };

        const response = await fetch(`${baseUrl}/magasins/add`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Erreur lors de l\'ajout');
        await fetchMagasins();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMagasins]
  );

  const updateMagasin = useCallback(
    async (data: Magasin) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const payload = {
          ...data,
          Stock_Negatif: Number(data.Stock_Negatif), // ⚠️ conversion sécurisée
        };

        const response = await fetch(`${baseUrl}/magasins/update`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Erreur lors de la modification');
        await fetchMagasins();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMagasins]
  );

  const deleteMagasin = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseUrl}/magasins/delete`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Reference: reference }),
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression');
        await fetchMagasins();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMagasins]
  );

  const getMagasinByReference = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseUrl}/magasins/get`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Reference: reference }),
        });

        if (!response.ok) throw new Error('Magasin non trouvé');
        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    magasins,
    isLoading,
    error,
    fetchMagasins,
    addMagasin,
    updateMagasin,
    deleteMagasin,
    getMagasinByReference,
  };
};
