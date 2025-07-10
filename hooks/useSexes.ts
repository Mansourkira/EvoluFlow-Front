// hooks/useSexes.ts
import { useState, useCallback } from "react";
import { addSexeSchema, updateSexeSchema, AddSexeFormData, Sexe } from "@/schemas/sexeSchema";

export const useSexes = () => {
  const [sexes, setSexes]       = useState<Sexe[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const baseUrl = "http://localhost:3000/api/v1";

  // Lister
  const fetchSexes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/sexe/list`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Erreur fetch sexes");
      setSexes(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter
  const addSexe = useCallback(async (data: AddSexeFormData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/sexe/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur ajout");
      }
      await fetchSexes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchSexes]);

  // Modifier
  const updateSexe = useCallback(async (data: Sexe) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/sexe/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur modification");
      }
      await fetchSexes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchSexes]);

  // Supprimer
  const deleteSexe = useCallback(async (ref: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/sexe/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ Reference: ref }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur suppression");
      }
      await fetchSexes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchSexes]);

  // Get by reference (pour la view)
  const getSexeByReference = useCallback(async (ref: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/sexe/get`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ Reference: ref }),
      });
      if (!res.ok) throw new Error("Non trouvé");
      return await res.json() as Sexe;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sexes,
    isLoading,
    error,
    fetchSexes,
    addSexe,
    updateSexe,
    deleteSexe,
    getSexeByReference,
    refetch: fetchSexes,
  };
};
