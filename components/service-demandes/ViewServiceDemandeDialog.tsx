// components/service-demandes/ViewServiceDemandeDialog.tsx
'use client';

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ServiceDemande } from "@/schemas/serviceDemandeSchema";
import { useServiceDemandes } from "@/hooks/useServiceDemandes";

interface ViewServiceDemandeDialogProps {
  open: boolean;
  onClose: () => void;
  /** Référence de la demande à afficher */
  reference: string;
}

export default function ViewServiceDemandeDialog({
  open,
  onClose,
  reference,
}: ViewServiceDemandeDialogProps) {
  const { getServiceDemandeByReference } = useServiceDemandes();
  const [item, setItem] = useState<ServiceDemande | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getServiceDemandeByReference(reference)
      .then((d) => setItem(d))
      .finally(() => setLoading(false));
  }, [open, reference, getServiceDemandeByReference]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la demande de service</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin h-5 w-5 mr-2" /> Chargement...
          </div>
        ) : item ? (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium">Référence</label>
              <Input value={item.Reference} disabled />
            </div>
            <div>
              <label className="block mb-1 font-medium">Libellé</label>
              <Input value={item.Libelle} disabled />
            </div>
            <div>
              <label className="block mb-1 font-medium">Utilisateur</label>
              <Input value={item.Utilisateur ?? "-"} disabled />
            </div>
            <div>
              <label className="block mb-1 font-medium">Date de création</label>
              <Input
                value={
                  item.Heure
                    ? new Date(item.Heure).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"
                }
                disabled
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Demande introuvable.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
