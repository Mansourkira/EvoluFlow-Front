import { useState } from 'react';

interface Societe {
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
  Utilisateur?: string;
  Heure?: string;
}

export const useSocieteDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [societe, setSociete] = useState<Societe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const openDialog = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }
      
      const response = await fetch('http://localhost:3000/api/v1/societes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.societes && data.societes.length > 0) {
          setSociete(data.societes[0]);
          setIsOpen(true);
        } else {
          setError('Aucune société trouvée');
        }
      } else {
        setError('Erreur lors de la récupération de la société');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Error fetching société:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSociete(null);
    setError(null);
  };

  const updateSociete = async (updatedSociete: Partial<Societe>) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token d\'authentification manquant');
        return false;
      }
      
      // Validate Sigle if it's being updated
      if (updatedSociete.Sigle !== undefined) {
        if (typeof updatedSociete.Sigle !== 'string' || updatedSociete.Sigle === '[object Object]') {
          setError('Format de logo invalide');
          return false;
        }
      }

      const response = await fetch('http://localhost:3000/api/v1/societes/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSociete),
      });
      
      if (response.ok) {
        // Immediately update local state
        setSociete(prev => prev ? { ...prev, ...updatedSociete } : null);
        
        // Force refresh from server after a short delay
        setTimeout(async () => {
          try {
            const refreshResponse = await fetch('http://localhost:3000/api/v1/societes', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.societes && refreshData.societes.length > 0) {
                const freshData = refreshData.societes[0];
                // Only update if we got valid data
                if (freshData && typeof freshData.Sigle === 'string') {
                  setSociete(freshData);
                }
              }
            }
          } catch (refreshError) {
            console.error('Error refreshing société data:', refreshError);
          }
        }, 500); // Wait 500ms before refreshing to allow server processing
        
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Erreur lors de la mise à jour de la société');
        return false;
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Error updating société:', err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isOpen,
    societe,
    isLoading,
    error,
    isUpdating,
    openDialog,
    closeDialog,
    updateSociete,
  };
}; 