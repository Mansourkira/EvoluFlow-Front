"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNiveauxCour } from "@/hooks/useNiveauxCour";
import type { NiveauCour } from "@/schemas/niveauCourSchema";

interface ViewNiveauCourDialogProps {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export default function ViewNiveauCourDialog({
  open,
  onClose,
  reference,
}: ViewNiveauCourDialogProps) {
  const [niveau, setNiveau] = useState<NiveauCour | null>(null);
  const [loading, setLoading] = useState(false);
  const { getByReference } = useNiveauxCour();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getByReference(reference)
      .then((data) => setNiveau(data))
      .catch(() => setNiveau(null))
      .finally(() => setLoading(false));
  }, [open, reference]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du Niveau de Cours</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Chargement...
          </div>
        ) : niveau ? (
          <div className="grid gap-4">
            <div>
              <label>Référence</label>
              <Input value={niveau.Reference} disabled />
            </div>
            <div>
              <label>Libellé</label>
              <Input value={niveau.Libelle} disabled />
            </div>
            <div>
              <label>Nombre d’heures</label>
              <Input value={String(niveau.Nombre_Heure)} disabled />
            </div>
            <div>
              <label>Utilisateur</label>
              <Input value={niveau.Utilisateur ?? "-"} disabled />
            </div>
            <div>
              <label>Heure</label>
              <Input
                value={
                  niveau.Heure
                    ? new Date(niveau.Heure).toLocaleString()
                    : "-"
                }
                disabled
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">
            Niveau de cours introuvable.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
