"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { NiveauEtude } from "@/schemas/niveauEtudeSchema";
import { Loader2 } from "lucide-react";
import { useNiveauxEtude } from "@/hooks/useNiveauxEtude";

interface ViewNiveauEtudeDialogProps {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export function ViewNiveauEtudeDialog({ open, onClose, reference }: ViewNiveauEtudeDialogProps) {
  const [niveau, setNiveau] = useState<NiveauEtude | null>(null);
  const [loading, setLoading] = useState(false);
  const { getNiveauByReference } = useNiveauxEtude();

  useEffect(() => {
    if (!open || !reference) return;
    setLoading(true);
    getNiveauByReference(reference)
      .then(data => setNiveau(data))
      .finally(() => setLoading(false));
  }, [open, reference]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du niveau d’étude</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin h-5 w-5 mr-2" /> Chargement...
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
          </div>
        ) : (
          <p className="text-center text-red-500">Niveau non trouvé.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default ViewNiveauEtudeDialog;
