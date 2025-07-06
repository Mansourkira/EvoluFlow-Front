"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { HoraireDemande } from "@/schemas/horaireDemandeSchema";
import { useHoraireDemandes } from "@/hooks/use-horaire-demande";

interface ViewHoraireDemandeDialogProps {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export default function ViewHoraireDemandeDialog({
  open,
  onClose,
  reference,
}: ViewHoraireDemandeDialogProps) {
  const { getHoraireByReference } = useHoraireDemandes();
  const [item, setItem] = useState<HoraireDemande | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getHoraireByReference(reference)
      .then((h) => setItem(h))
      .finally(() => setLoading(false));
  }, [open, reference]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du créneau horaire</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin h-5 w-5 mr-2" /> Chargement...
          </div>
        ) : item ? (
          <div className="grid gap-4">
            <div>
              <label>Référence</label>
              <Input value={item.Reference} disabled />
            </div>
            <div>
              <label>Libellé</label>
              <Input value={item.Libelle} disabled />
            </div>
            <div>
              <label>Utilisateur</label>
              <Input value={item.Utilisateur || ""} disabled />
            </div>
            <div>
              <label>Date de création</label>
              <Input value={item.Heure || ""} disabled />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Introuvable.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
