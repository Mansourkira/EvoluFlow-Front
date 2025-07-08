// components/sexes/ViewSexeDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Sexe } from "@/schemas/sexeSchema";
import { useSexes } from "@/hooks/useSexes";

interface ViewSexeDialogProps {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export default function ViewSexeDialog({
  open,
  onClose,
  reference,
}: ViewSexeDialogProps) {
  const { getSexeByReference } = useSexes();
  const [item, setItem]    = useState<Sexe | null>(null);
  const [loading, setLoad] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoad(true);
    getSexeByReference(reference)
      .then((d) => setItem(d))
      .finally(() => setLoad(false));
  }, [open, reference, getSexeByReference]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du sexe</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-4 flex justify-center">
            <Loader2 className="animate-spin h-5 w-5" /> Chargement…
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
