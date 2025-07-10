// hooks/useFilieres.ts
import { useState, useCallback } from "react";
import {
  Filiere,
  AddFiliereFormData,
  UpdateFiliereFormData,
} from "@/schemas/filiereSchema";

export const useFilieres = () => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL de ton serveur Express (doit tourner sur le port 3000)
  const baseUrl = "http://localhost:3000/api/v1/filiere";

  // 📄 Liste
  const fetchFilieres = useCallback(async () => {
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
      if (!res.ok) throw new Error("Erreur lors de la récupération des filières");
      setFilieres(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ➕ Ajouter
  const addFiliere = useCallback(
    async (payload: AddFiliereFormData) => {
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
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur lors de l'ajout");
        }
        await fetchFilieres();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFilieres]
  );

  // 🛠 Modifier
  const updateFiliere = useCallback(
    async (payload: UpdateFiliereFormData) => {
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
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur lors de la modification");
        }
        await fetchFilieres();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFilieres]
  );

  // ❌ Supprimer
  const deleteFiliere = useCallback(
    async (Reference: string) => {
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
          body: JSON.stringify({ Reference }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur lors de la suppression");
        }
        await fetchFilieres();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFilieres]
  );

  // 🔍 Récupérer une filière par Reference
  const getFiliereByReference = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("→ getFiliereByReference envoie Reference =", reference);
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/reference`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // ** clé exactement "Reference" **
          body: JSON.stringify({ Reference: reference }),
        });
        if (!res.ok) {
          const msg = await res.text();
          console.error("status", res.status, "body:", msg);
          throw new Error("Filière non trouvée");
        }
        return (await res.json()) as Filiere;
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
    filieres,
    isLoading,
    error,
    fetchFilieres,
    addFiliere,
    updateFiliere,
    deleteFiliere,
    getFiliereByReference,
    refetch: fetchFilieres,
  };
};
