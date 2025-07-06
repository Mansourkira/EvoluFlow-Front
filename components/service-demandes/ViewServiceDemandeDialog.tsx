"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ServiceDemande } from "@/schemas/serviceDemandeSchema";
import { useServiceDemandes } from "@/hooks/useServiceDemandes";

interface ViewServiceDemandeDialogProps {
  open: boolean;
  onClose: () => void;
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
  }, [open, reference]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails Service Demande</DialogTitle>
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
          </div>
        ) : (
          <p className="text-center text-red-500">Introuvable.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
