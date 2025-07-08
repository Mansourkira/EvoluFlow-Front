// src/hooks/useUrgenceTaches.ts
import { useState, useCallback } from 'react';
import {
  AddUrgenceTacheFormData,
  UrgenceTache,
} from '@/schemas/urgenceTacheSchema';

export const useUrgenceTaches = () => {
  const [urgences, setUrgences] = useState<UrgenceTache[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'http://localhost:3000/api/v1';

  const fetchUrgences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/urgence-tache/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Erreur lors du chargement');
      setUrgences(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  const addUrgence = useCallback(async (data: AddUrgenceTacheFormData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/urgence-tache/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Erreur lors de l\'ajout');
      }
      await fetchUrgences();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUrgences]);

  const updateUrgence = useCallback(async (data: UrgenceTache) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/urgence-tache/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Erreur lors de la modification');
      }
      await fetchUrgences();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUrgences]);

  const deleteUrgence = useCallback(async (ref: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/urgence-tache/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Reference: ref })
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Erreur lors de la suppression');
      }
      await fetchUrgences();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUrgences]);

  const getUrgenceByReference = useCallback(async (ref: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/urgence-tache/get`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Reference: ref })
      });
      if (!res.ok) throw new Error('Introuvable');
      return (await res.json()) as UrgenceTache;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    urgences,
    isLoading,
    error,
    fetchUrgences,
    addUrgence,
    updateUrgence,
    deleteUrgence,
    getUrgenceByReference,
    refetch: fetchUrgences,
  };
};
