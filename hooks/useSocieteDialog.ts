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

  return {
    isOpen,
    societe,
    isLoading,
    error,
    openDialog,
    closeDialog,
  };
}; 