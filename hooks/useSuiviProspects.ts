"use client";

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { type SuiviProspect } from '@/schemas/suiviProspectSchema';
import { type UpdateSuiviProspectFormData } from '@/schemas/suiviProspectSchema';

export const useSuiviProspects = () => {
  const [suiviProspects, setSuiviProspects] = useState<SuiviProspect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

  const fetchSuiviProspects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/suivi-prospects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuiviProspects(data);
      } else {
        throw new Error('Erreur lors de la récupération des suivi prospects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSuiviProspect = useCallback(async (suiviProspectData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/suivi-prospects/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(suiviProspectData),
      });

      if (response.ok) {
        await fetchSuiviProspects();
        toast.success(`Le suivi prospect "${suiviProspectData.Libelle}" a été ajouté avec succès.`);
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue lors de l'ajout");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSuiviProspects]);

  const updateSuiviProspect = useCallback(async (suiviProspectData: UpdateSuiviProspectFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/suivi-prospects/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(suiviProspectData),
      });

      if (response.ok) {
        await fetchSuiviProspects();
        toast.success(`Le suivi prospect "${suiviProspectData.Libelle}" a été modifié avec succès.`);
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la modification");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue lors de la modification");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSuiviProspects]);

  const deleteSuiviProspect = useCallback(async (reference: string, libelle?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/suivi-prospects/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        await fetchSuiviProspects();
        toast.success(`Le suivi prospect "${libelle}" a été supprimé avec succès.`);
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue lors de la suppression");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSuiviProspects]);

  const getSuiviProspectByReference = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/suivi-prospects/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Suivi prospect non trouvé");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error(err instanceof Error ? err.message : "Erreur lors de la récupération du suivi prospect");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    suiviProspects,
    isLoading,
    error,
    fetchSuiviProspects,
    addSuiviProspect,
    updateSuiviProspect,
    deleteSuiviProspect,
    getSuiviProspectByReference,
  };
}; 