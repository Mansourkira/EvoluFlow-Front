import { useState, useCallback } from "react";
import { ValidationReglement, AddValidationReglementFormData } from "@/schemas/validationReglementSchema";

export const useValidationReglement = () => {
  const [validationReglements, setValidationReglements] = useState<ValidationReglement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000/api/v1";

  const fetchValidationReglements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/validation-reglement/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setValidationReglements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addValidationReglement = useCallback(
    async (data: AddValidationReglementFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseUrl}/validation-reglement/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Erreur lors de l'ajout");
        await fetchValidationReglements();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchValidationReglements]
  );

  const updateValidationReglement = useCallback(
    async (data: ValidationReglement) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseUrl}/validation-reglement/update`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Erreur lors de la mise à jour");
        await fetchValidationReglements();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchValidationReglements]
  );

  const deleteValidationReglement = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/validation-reglement/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");
      await fetchValidationReglements();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchValidationReglements]);

  const getValidationReglementByReference = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/validation-reglement/get`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (!response.ok) throw new Error("Donnée non trouvée");
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    validationReglements,
    isLoading,
    error,
    fetchValidationReglements,
    addValidationReglement,
    updateValidationReglement,
    deleteValidationReglement,
    getValidationReglementByReference,
    refetch: fetchValidationReglements,
  };
};
export default useValidationReglement;