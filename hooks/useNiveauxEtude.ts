import { useState, useCallback } from "react";
import {
  AddNiveauEtudeFormData,
  NiveauEtude,
} from "@/schemas/niveauEtudeSchema";

export const useNiveauxEtude = () => {
  const [niveaux, setNiveaux] = useState<NiveauEtude[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000/api/v1";

  // ✅ Lister tous les niveaux
  const fetchNiveaux = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/niveaux-etude/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data: NiveauEtude[] = await res.json();
      setNiveaux(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Ajouter un niveau
  const addNiveau = useCallback(
    async (data: AddNiveauEtudeFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/niveaux-etude/add`, {
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
    async (data: NiveauEtude) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/niveaux-etude/update`, {
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
        const res = await fetch(`${baseUrl}/niveaux-etude/delete`, {
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

  // ✅ Récupérer un niveau par référence
  const getNiveauByReference = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/niveaux-etude/get`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Reference: reference }),
        });
        if (!res.ok) throw new Error("Niveau non trouvé");
        return (await res.json()) as NiveauEtude;
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
    getNiveauByReference,
    refetch: fetchNiveaux,
  };
};
