// hooks/useNiveauxCour.tsx
import { useState, useCallback } from "react";
import {
  AddNiveauCourFormData,
  NiveauCour,
} from "@/schemas/niveauCourSchema";

export const useNiveauxCour = () => {
  const [niveaux, setNiveaux] = useState<NiveauCour[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000/api/v1/niveaux-cours";

  // ✅ Lister tous les niveaux
  const fetchNiveaux = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des niveaux");
      setNiveaux(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Ajouter un niveau
  const addNiveau = useCallback(
    async (data: AddNiveauCourFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur lors de l'ajout");
        }
        await fetchNiveaux();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchNiveaux]
  );

  // ✅ Mettre à jour un niveau
  const updateNiveau = useCallback(
    async (data: NiveauCour) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/update`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur lors de la modification");
        }
        await fetchNiveaux();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchNiveaux]
  );

  // ✅ Supprimer un niveau
  const deleteNiveau = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/delete`, {
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
        await fetchNiveaux();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchNiveaux]
  );

  // ✅ Obtenir un niveau par référence
  const getByReference = useCallback(
    async (reference: string): Promise<NiveauCour | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/get`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Reference: reference }),
        });
        if (!res.ok) {
          throw new Error("Niveau non trouvé");
        }
        return await res.json();
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
    niveaux,
    isLoading,
    error,
    fetchNiveaux,
    addNiveau,
    updateNiveau,
    deleteNiveau,
    getByReference,
    refetch: fetchNiveaux,
  };
};
