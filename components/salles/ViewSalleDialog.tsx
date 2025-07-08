"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Salle } from "@/schemas/salleSchema";
import { useSalles } from "@/hooks/useSalles";

interface ViewSalleDialogProps {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export default function ViewSalleDialog({
  open,
  onClose,
  reference,
}: ViewSalleDialogProps) {
  const { getSalleByReference } = useSalles();
  const [item, setItem] = useState<Salle | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getSalleByReference(reference)
      .then((s) => setItem(s))
      .finally(() => setLoading(false));
  }, [open, reference, getSalleByReference]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails de la salle</DialogTitle>
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
              <label>Réf. Site</label>
              <Input value={item.Reference_Site} disabled />
            </div>
            <div>
              <label>Capacité max</label>
              <Input value={item.Nombre_Candidat_Max.toString()} disabled />
            </div>
            <div>
              <label>Utilisateur</label>
              <Input value={item.Utilisateur || "-"} disabled />
            </div>
            <div>
              <label>Créé le</label>
              <Input
                value={item.Heure ? new Date(item.Heure).toLocaleString("fr-FR") : "-"}
                disabled
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Introuvable.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
