"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Check, X, Calendar, User } from "lucide-react";
import { TypeFacturation, getSousTraitanceLabel, getSousTraitanceColor, formatCreationDate } from "@/schemas/typeFacturationSchema";

interface ViewTypeFacturationDialogProps {
  typeFacturation: TypeFacturation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewTypeFacturationDialog({ 
  typeFacturation, 
  open, 
  onOpenChange 
}: ViewTypeFacturationDialogProps) {
  if (!typeFacturation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Détails du type de facturation
          </DialogTitle>
          <DialogDescription>
            Informations détaillées du type de facturation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Référence</label>
              <p className="mt-1 text-sm font-semibold">{typeFacturation.Reference}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Libellé</label>
              <p className="mt-1 text-sm">{typeFacturation.Libelle || "Non défini"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Sous-traitance</label>
              <div className="mt-1">
                <Badge 
                  variant="secondary" 
                  className={getSousTraitanceColor(typeFacturation.Sous_Traitance)}
                >
                  <div className="flex items-center gap-1">
                    {typeFacturation.Sous_Traitance ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {getSousTraitanceLabel(typeFacturation.Sous_Traitance)}
                  </div>
                </Badge>
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Informations système</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Créé par</label>
                <div className="mt-1 flex items-center gap-1">
                  <User className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">{typeFacturation.Utilisateur || "Non défini"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date de création</label>
                <div className="mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">{formatCreationDate(typeFacturation.Heure)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 