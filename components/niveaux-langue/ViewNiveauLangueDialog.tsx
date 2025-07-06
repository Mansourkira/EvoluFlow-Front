// components/niveaux-langue/ViewNiveauLangueDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { NiveauLangue } from "@/schemas/niveauLangueSchema";
import { useNiveauxLangue } from "@/hooks/useNiveauxLangue";

interface ViewNiveauLangueDialogProps {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export default function ViewNiveauLangueDialog({
  open,
  onClose,
  reference,
}: ViewNiveauLangueDialogProps) {
  const { getNiveauByReference } = useNiveauxLangue();
  const [item, setItem] = useState<NiveauLangue | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getNiveauByReference(reference)
      .then((d) => setItem(d))
      .finally(() => setLoading(false));
  }, [open, reference]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails niveau de langue</DialogTitle>
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
            <div>
              <label>Utilisateur</label>
              <Input value={item.Utilisateur || "-"} disabled />
            </div>
            <div>
              <label>Date de création</label>
              <Input value={item.Heure ? new Date(item.Heure).toLocaleString() : "-"} disabled />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Introuvable</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
