"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { type EtatCivil, formatCreationDate } from "@/schemas/etatCivilSchema";

interface ViewEtatCivilDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  etatCivil: EtatCivil;
}

export function ViewEtatCivilDialog({ 
  open, 
  onOpenChange, 
  etatCivil 
}: ViewEtatCivilDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Détails de l'état civil</DialogTitle>
          <DialogDescription>
            Informations détaillées sur l'état civil.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Référence</div>
            <div className="col-span-3">{etatCivil.Reference}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Libellé</div>
            <div className="col-span-3">{etatCivil.Libelle}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Date de création</div>
            <div className="col-span-3">{formatCreationDate(etatCivil.Heure)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Utilisateur</div>
            <div className="col-span-3">{etatCivil.Utilisateur || "Non défini"}</div> 
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 