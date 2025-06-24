import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Site {
  Reference: string;
  Raison_Sociale: string;
  Adresse?: string;
  Complement_adresse?: string;
  Code_Postal?: string;
  Ville?: string;
  Gouvernorat?: string;
  Pays?: string;
  Telephone?: string;
  Fax?: string;
  E_Mail_Commercial?: string;
  E_Mail_Marketing?: string;
  E_Mail_Administration?: string;
  E_Mail_Financier?: string;
  Site_Web?: string;
  Activite?: string;
  Matricule_Fiscal?: string;
  Capital?: string;
  Sigle?: string;
  Nombre_Max_Relance_Entretien?: number;
  Nombre_Max_Relance_Inscription?: number;
  Nombre_Max_Relance_Preparation?: number;
  Nombre_Max_Relance_Propect?: number;
  Utilisateur?: string;
  Heure?: string;
}

interface UseSitesReturn {
  sites: Site[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSites(): UseSitesReturn {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/sites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log("sitesData", result);
        // The backend returns { sites: [...] }
        const sitesData = result.sites || result;
        setSites(Array.isArray(sitesData) ? sitesData : []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch sites');
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch sites');
      toast({
        title: "❌ Erreur de chargement",
        description: "Impossible de charger la liste des sites.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []); // Fetch on mount

  return {
    sites,
    isLoading,
    error,
    refetch: fetchSites
  };
} 