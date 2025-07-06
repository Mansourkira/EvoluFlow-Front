import { useState, useCallback } from 'react';
import { ObjetReglement} from '@/schemas/reglementShema';

export const useObjetsReglement = () => {
  const [objetsReglement, setObjetsReglement] = useState<ObjetReglement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'http://localhost:3000/api/v1';

  // ✅ Lister
  const fetchObjetsReglement = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/reglements/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setObjetsReglement(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Ajouter
  const addObjetReglement = useCallback(async (data: ObjetReglement) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/reglements/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout');
      await fetchObjetsReglement();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchObjetsReglement]);

  // ✅ Modifier
  const updateObjetReglement = useCallback(async (data: ObjetReglement) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/reglements/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erreur lors de la modification');
      await fetchObjetsReglement();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchObjetsReglement]);

  // ✅ Supprimer
  const deleteObjetReglement = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/reglements/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      await fetchObjetsReglement();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchObjetsReglement]);

  // ✅ Récupérer un par référence
  const getObjetReglementByReference = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/reglements/get`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (!response.ok) throw new Error('Objet non trouvé');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    objetsReglement,
    isLoading,
    error,
    fetchObjetsReglement,
    addObjetReglement,
    updateObjetReglement,
    deleteObjetReglement,
    getObjetReglementByReference,
    refetch: fetchObjetsReglement,
  };
};
