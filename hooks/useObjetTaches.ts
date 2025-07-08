// src/hooks/useObjetTaches.ts
import { useState, useCallback } from 'react';
import {
  AddObjetTacheFormData,
  ObjetTache,
} from '@/schemas/objetTacheSchema';

export const useObjetTaches = () => {
  const [objets, setObjets]     = useState<ObjetTache[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const baseUrl = 'http://localhost:3000/api/v1';

  // ✅ Lister
  const fetchObjets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/objet-tache/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erreur lors du chargement');
      setObjets(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Ajouter
  const addObjet = useCallback(async (payload: AddObjetTacheFormData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/objet-tache/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de l\'ajout');
      }
      await fetchObjets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchObjets]);

  // ✅ Modifier
  const updateObjet = useCallback(async (payload: ObjetTache) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/objet-tache/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de la modification');
      }
      await fetchObjets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchObjets]);

  // ✅ Supprimer
  const deleteObjet = useCallback(async (reference: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/objet-tache/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Reference: reference })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de la suppression');
      }
      await fetchObjets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchObjets]);

  // ✅ Récupérer un par référence
  const getObjetByReference = useCallback(async (reference: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/objet-tache/get`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Reference: reference })
      });
      if (!res.ok) throw new Error('Objet non trouvé');
      return (await res.json()) as ObjetTache;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    objets,
    isLoading,
    error,
    fetchObjets,
    addObjet,
    updateObjet,
    deleteObjet,
    getObjetByReference,
    refetch: fetchObjets,
  };
};
