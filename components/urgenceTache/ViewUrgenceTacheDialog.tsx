// src/components/urgenceTache/ViewUrgenceTacheDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { UrgenceTache } from "@/schemas/urgenceTacheSchema";
import { useUrgenceTaches } from "@/hooks/useUrgenceTaches";

interface Props {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export default function ViewUrgenceTacheDialog({ open, onClose, reference }: Props) {
  const { getUrgenceByReference } = useUrgenceTaches();
  const [item, setItem]     = useState<UrgenceTache|null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getUrgenceByReference(reference)
      .then(setItem)
      .finally(() => setLoading(false));
  }, [open, reference]);

  return (
    <Dialog open={open} onOpenChange={(o)=>!o&&onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails Urgence de Tâche</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="p-4 text-center"><Loader2 className="animate-spin"/> Chargement…</div>
        ) : item ? (
          <div className="space-y-4">
            <div>
              <label>Référence</label>
              <Input value={item.Reference} disabled/>
            </div>
            <div>
              <label>Libellé</label>
              <Input value={item.Libelle} disabled/>
            </div>
            <div>
              <label>Utilisateur</label>
              <Input value={item.Utilisateur||'-'} disabled/>
            </div>
            <div>
              <label>Heure</label>
              <Input value={item.Heure?new Date(item.Heure).toLocaleString('fr-FR'):'-'} disabled/>
            </div>
          </div>
        ) : (
          <p className="text-red-600 text-center">Introuvable.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
