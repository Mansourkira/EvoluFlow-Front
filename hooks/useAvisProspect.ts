"use client";

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { type AvisProspect } from '@/schemas/avisProspectSchema';
import { type UpdateAvisProspectFormData } from '@/schemas/avisProspectSchema';

export const useAvisProspect = () => {
  const [avisProspects, setAvisProspects] = useState<AvisProspect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = 'http://localhost:3000/api/v1';

  const fetchAvisProspects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/avis-prospect/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvisProspects(data);
      } else {
        throw new Error('Erreur lors de la récupération des avis prospects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAvisProspect = useCallback(async (avisProspectData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/avis-prospect/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(avisProspectData),
      });

      if (response.ok) {
          await fetchAvisProspects();
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
  }, [fetchAvisProspects]);

  const updateAvisProspect = useCallback(async (avisProspectData: UpdateAvisProspectFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/avis-prospect/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(avisProspectData),
      });

      if (response.ok) {
        await fetchAvisProspects();
        toast.success(`Le Avis Prospect "${avisProspectData.Libelle}" a été modifié avec succès.`);
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
  }, [fetchAvisProspects]);

  const deleteAvisProspect = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/avis-prospect/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        await fetchAvisProspects();
        toast.success(`Le Avis Prospect "${reference}" a été supprimé avec succès.`);
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
    }, [fetchAvisProspects]);

  const getAvisProspectByReference = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
        const response = await fetch(`${baseUrl}/avis-prospect/by-reference`, {
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
        throw new Error("Avis Prospect non trouvé");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast.error(err instanceof Error ? err.message : "Erreur lors de la récupération du Avis Prospect");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    avisProspects,
    isLoading,
    error,
    fetchAvisProspects,
    addAvisProspect,
    updateAvisProspect,
    deleteAvisProspect,
    getAvisProspectByReference,
    refetch: fetchAvisProspects,
  };
}; 