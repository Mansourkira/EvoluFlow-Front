import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Site {
  Raison_Sociale: string;
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
        const sitesData = await response.json();
        console.log("sitesData", sitesData);
        // Ensure we have an array of Site objects
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