"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ValidationReglement } from "@/schemas/validationReglementSchema";
import { Loader2 } from "lucide-react";

interface Props {
  reference: string;
  open: boolean;
  onClose: () => void;
}

export default function ViewValidationReglementDialog({ reference, open, onClose }: Props) {
  const [data, setData] = useState<ValidationReglement | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/v1/validation_reglements/get", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Reference: reference }),
      });

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && reference) {
      fetchData();
    }
  }, [open, reference]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails validation règlement</DialogTitle>
        </DialogHeader>

        {loading || !data ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="Reference">Référence</label>
              <Input value={data.Reference} disabled />
            </div>
            <div>
              <label htmlFor="Libelle">Libellé</label>
              <Input value={data.Libelle} disabled />
            </div>
            <div>
              <label htmlFor="Valide">Valide</label>
              <Input value={data.Valide === 1 ? "Oui" : "Non"} disabled />
            </div>
            <div>
              <label htmlFor="Utilisateur">Utilisateur</label>
              <Input value={data.Utilisateur || ""} disabled />
            </div>
            <div>
              <label htmlFor="Heure">Heure</label>
              <Input value={data.Heure || ""} disabled />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
