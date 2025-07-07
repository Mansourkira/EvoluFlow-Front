"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type ObjetReclamation, formatCreationDate } from "@/schemas/objetReclamationSchema";

interface ViewObjetReclamationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objetReclamation: ObjetReclamation;
}

export function ViewObjetReclamationDialog({ 
  open, 
  onOpenChange, 
  objetReclamation 
}: ViewObjetReclamationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Détails de l'objet de réclamation</DialogTitle>
          <DialogDescription>
            Informations détaillées sur l'objet de réclamation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Référence</div>
            <div className="col-span-3">{objetReclamation.Reference}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Libellé</div>
            <div className="col-span-3">{objetReclamation.Libelle}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Date de création</div>
            <div className="col-span-3">{formatCreationDate(objetReclamation.Heure)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Utilisateur</div>
            <div className="col-span-3">{objetReclamation.Utilisateur || "Non défini"}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 