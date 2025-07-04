import { useEffect, useState } from 'react';
import { SuiviProspect } from '@/schemas/suiviProspectSchema';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { JSX } from 'react';

const successToastConfig = {
  duration: 3000,
  position: 'bottom-right' as const,
  className: 'bg-green-500 text-white',
  style: {
    backgroundColor: '#48bb78',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }
};

interface UseSuiviProspectsReturn {
  suiviProspects: SuiviProspect[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getProspectByReference: (reference: string) => Promise<SuiviProspect | null>;
  addProspect: (prospect: Partial<SuiviProspect>) => Promise<boolean>;
  updateProspect: (prospect: Partial<SuiviProspect>) => Promise<boolean>;
  deleteProspect: (reference: string) => Promise<void>;
  bulkDeleteProspects: (references: string[]) => Promise<void>;
}

export const useSuiviProspects = (): UseSuiviProspectsReturn => {
  const [suiviProspects, setSuiviProspects] = useState<SuiviProspect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchSuiviProspects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/suivi-prospects`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des suivis prospects');
      }

      const data = await response.json();
      
      const transformedSuiviProspects = data.map((suiviProspect: any) => ({
        Reference: suiviProspect.Reference,
        Libelle: suiviProspect.Libelle,
        Relance: suiviProspect.Relance,
        Utilisateur: suiviProspect.Utilisateur,
        Heure: suiviProspect.Heure ? new Date(suiviProspect.Heure).toLocaleString('fr-FR') : '',
      }));

      setSuiviProspects(transformedSuiviProspects);
    } catch (error) {
      console.error('Error fetching suivi prospects:', error);
      setError(error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite');
      setSuiviProspects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProspectByReference = async (reference: string): Promise<SuiviProspect | null> => {
    try {
      const response = await fetch(`/api/suivi-prospects/${reference}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération du prospect');
      }

      const data = await response.json();
      return {
        ...data,
        Heure: data.Heure ? new Date(data.Heure).toLocaleString('fr-FR') : '',
      };
    } catch (error) {
      console.error('Error fetching prospect:', error);
      return null;
    }
  };

  const addProspect = async (prospect: Partial<SuiviProspect>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/suivi-prospects/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(prospect),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout du prospect');
      }

      await fetchSuiviProspects();
      toast.success('✅ Prospect ajouté avec succès', successToastConfig);
      return true;
    } catch (error) {
      console.error('Error adding prospect:', error);
      toast.error(`❌ Erreur - ${error instanceof Error ? error.message : 'Impossible d\'ajouter le prospect'}`);
      return false;
    }
  };

  const updateProspect = async (prospect: Partial<SuiviProspect>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/suivi-prospects/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(prospect),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du prospect');
      }

      await fetchSuiviProspects();
      toast.success(`✅ Prospect mis à jour avec succès`, successToastConfig);
      return true;
    } catch (error) {
      console.error('Error updating prospect:', error);
      toast.error(`❌ Erreur - ${error instanceof Error ? error.message : 'Impossible de mettre à jour le prospect'}`);
      return false;
    }
  };

  const deleteProspect = async (reference: string): Promise<void> => {
    try {
      const response = await fetch(`/api/suivi-prospects/delete`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ Reference: reference }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du prospect');
      }

      const deletedProspect = suiviProspects.find(prospect => prospect.Reference === reference);
      await fetchSuiviProspects();
      
      toast.success(`✅ Prospect supprimé - ${deletedProspect?.Libelle || reference} a été supprimé avec succès`, successToastConfig);
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast.error(`❌ Erreur - ${error instanceof Error ? error.message : 'Impossible de supprimer le prospect'}`);
      throw error;
    }
  };

  const bulkDeleteProspects = async (references: string[]): Promise<void> => {
    try {
      const deletePromises = references.map(ref => 
          fetch(`/api/suivi-prospects/delete`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          body: JSON.stringify({ Reference: ref }),
        })
      );

      const responses = await Promise.all(deletePromises);
      const failedDeletes = responses.filter(response => !response.ok);

      await fetchSuiviProspects();

      if (failedDeletes.length === 0) {
        toast.success(`✅ Suppression en masse - ${references.length} prospects ont été supprimés avec succès`, successToastConfig);
      } else {
        toast.error(`⚠️ Suppression partielle - ${responses.length - failedDeletes.length}/${responses.length} prospects supprimés`);
        throw new Error('Certaines suppressions ont échoué');
      }
    } catch (error) {
      console.error('Error bulk deleting prospects:', error);
      toast.error('❌ Erreur de suppression en masse - Impossible de supprimer les prospects sélectionnés');
      throw error;
    }
  };

  useEffect(() => {
    fetchSuiviProspects();
  }, []);

  return {
    suiviProspects,
    isLoading,
    error,
    refetch: fetchSuiviProspects,
    getProspectByReference,
    addProspect,
    updateProspect,
    deleteProspect,
    bulkDeleteProspects,
  };
}; 