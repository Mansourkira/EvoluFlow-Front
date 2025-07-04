"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ObjetReglement } from "@/schemas/reglementShema";
import { Label } from "@/components/ui/label";

interface ViewObjetReglementDialogProps {
  objet: ObjetReglement;
  open: boolean;
  onClose: () => void;
}

export default function ViewObjetReglementDialog({ objet, open, onClose }: ViewObjetReglementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de l'objet de règlement</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Référence :</Label>
            <div className="border p-2 rounded bg-gray-100">{objet.Reference}</div>
          </div>

            <div>
                <Label>Libellé :</Label>
                <div className="border p-2 rounded bg-gray-100">{objet.Libelle}</div>
            </div>

          <div>
            <Label>Utilisateur :</Label>
            <div className="border p-2 rounded bg-gray-100">{objet.Utilisateur}</div>
          </div>

          <div>
            <Label>Date de création :</Label>
            <div className="border p-2 rounded bg-gray-100">
              {objet.Heure ? new Date(objet.Heure).toLocaleString("fr-FR") : "-"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
