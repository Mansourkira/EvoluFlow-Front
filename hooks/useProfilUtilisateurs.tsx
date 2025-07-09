import { useState, useCallback } from "react";
import {
  AddProfilUtilisateurFormData,
  ProfilUtilisateur,
} from "@/schemas/profilUtilisateurSchema";

export const useProfilUtilisateurs = () => {
  const [profils, setProfils] = useState<ProfilUtilisateur[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = "http://localhost:3000/api/v1";

  // ✅ Lister
  const fetchProfils = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/profil-utilisateurs/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data: ProfilUtilisateur[] = await res.json();
      setProfils(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Ajouter
  const addProfil = useCallback(
    async (payload: AddProfilUtilisateurFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/profil-utilisateurs/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur lors de l'ajout");
        }
        await fetchProfils();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfils]
  );

  // ✅ Modifier
  const updateProfil = useCallback(
    async (payload: ProfilUtilisateur) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/profil-utilisateurs/update`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur lors de la modification");
        }
        await fetchProfils();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfils]
  );

  // ✅ Supprimer
  const deleteProfil = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/profil-utilisateurs/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Reference: reference }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur lors de la suppression");
        }
        await fetchProfils();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProfils]
  );

  // ✅ Récupérer un par référence
  const getProfilByReference = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/profil-utilisateurs/get`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Reference: reference }),
        });
        if (!res.ok) throw new Error("Non trouvé");
        return (await res.json()) as ProfilUtilisateur;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    profils,
    isLoading,
    error,
    fetchProfils,
    addProfil,
    updateProfil,
    deleteProfil,
    getProfilByReference,
    refetch: fetchProfils,
  };
};
