import { useEffect, useState } from 'react';
import { SuiviProspect } from '@/schemas/suiviProspectSchema';

interface UseSuiviProspectsReturn {
  suiviProspects: SuiviProspect[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSuiviProspects = (): UseSuiviProspectsReturn => {
  const [suiviProspects, setSuiviProspects] = useState<SuiviProspect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuiviProspects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch('/api/suivi-prospects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des suivis prospects');
      }

      const data = await response.json();
      
      // Transform the data to match our interface
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

  useEffect(() => {
    fetchSuiviProspects();
  }, []);

  return {
    suiviProspects,
    isLoading,
    error,
    refetch: fetchSuiviProspects,
  };
}; 