import { useState, useCallback } from "react";
import {
  AddServiceDemandeFormData,
  ServiceDemande,
} from "@/schemas/serviceDemandeSchema";

export const useServiceDemandes = () => {
  const [serviceDemandes, setServiceDemandes] = useState<ServiceDemande[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000/api/v1";

  // ✅ Lister
  const fetchServiceDemandes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/service-demandes/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data: ServiceDemande[] = await res.json();
      setServiceDemandes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Ajouter
  const addServiceDemande = useCallback(
    async (payload: AddServiceDemandeFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/service-demandes/add`, {
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
        await fetchServiceDemandes();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchServiceDemandes]
  );

  // ✅ Modifier
  const updateServiceDemande = useCallback(
    async (payload: ServiceDemande) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/service-demandes/update`, {
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
        await fetchServiceDemandes();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchServiceDemandes]
  );

  // ✅ Supprimer
  const deleteServiceDemande = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/service-demandes/delete`, {
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
        await fetchServiceDemandes();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchServiceDemandes]
  );

  // ✅ Récupérer un par référence
  const getServiceDemandeByReference = useCallback(
    async (reference: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/service-demandes/get`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Reference: reference }),
        });
        if (!res.ok) throw new Error("Non trouvé");
        return (await res.json()) as ServiceDemande;
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
  serviceDemandes,
  isLoading,
  error,
  fetchServiceDemandes,
  addServiceDemande,
  updateServiceDemande,
  deleteServiceDemande,
  getServiceDemandeByReference,
  refetch: fetchServiceDemandes,
};

};
