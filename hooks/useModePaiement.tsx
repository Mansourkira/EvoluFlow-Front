// ✅ Hook React : useModePaiement.tsx
import { useState, useCallback } from "react";
import { ModePaiement } from "@/schemas/modePaiementSchema";

export const useModePaiement = () => {
  const [modes, setModes] = useState<ModePaiement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000/api/v1";

  const fetchModes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/mode-paiement/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des modes");
      const data = await res.json();
      setModes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMode = useCallback(async (data: ModePaiement) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/mode-paiement/add`, {
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
      await fetchModes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur ajout");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchModes]);

  const updateMode = useCallback(async (data: ModePaiement) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/mode-paiement/update`, {
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
      await fetchModes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur modification");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchModes]);

  const deleteMode = useCallback(async (Reference: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/mode-paiement/delete`, {
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
      await fetchModes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur suppression");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchModes]);

  const getByReference = useCallback(async (Reference: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/mode-paiement/get`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Reference }),
      });
      if (!res.ok) throw new Error("Non trouvé");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur getByReference");
      return null;
    }
  }, []);

  return {
    modes,
    isLoading,
    error,
    fetchModes,
    addMode,
    updateMode,
    deleteMode,
    getByReference,
    refetch: fetchModes,
  };
};
