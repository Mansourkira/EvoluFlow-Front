/*
hooks/useSalles.tsx
*/
import { useState, useCallback } from 'react';
import { AddSalleFormData, Salle } from '@/schemas/salleSchema';

export const useSalles = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = 'http://localhost:3000/api/v1';

  const fetchSalles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/salles/list`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Erreur chargement salles');
      setSalles(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally { setIsLoading(false); }
  }, []);

  const addSalle = useCallback(async (data: AddSalleFormData) => {
    setIsLoading(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/salles/add`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur ajout salle');
      await fetchSalles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      return false;
    } finally { setIsLoading(false); }
  }, [fetchSalles]);

  const updateSalle = useCallback(async (data: Salle) => {
    setIsLoading(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/salles/update`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur modif salle');
      await fetchSalles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      return false;
    } finally { setIsLoading(false); }
  }, [fetchSalles]);

  const deleteSalle = useCallback(async (ref: string) => {
    setIsLoading(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/salles/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ Reference: ref }),
      });
      if (!res.ok) throw new Error('Erreur suppression');
      await fetchSalles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      return false;
    } finally { setIsLoading(false); }
  }, [fetchSalles]);

  const getSalleByReference = useCallback(async (ref: string) => {
    setIsLoading(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/salles/get`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ Reference: ref }),
      });
      if (!res.ok) throw new Error('Non trouvé');
      return await res.json() as Salle;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      return null;
    } finally { setIsLoading(false); }
  }, []);

  return {
    salles,
    isLoading,
    error,
    fetchSalles,
    addSalle,
    updateSalle,
    deleteSalle,
    getSalleByReference,
    refetch: fetchSalles,
  };
};
