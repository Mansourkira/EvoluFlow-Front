"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, User, Calendar } from "lucide-react";
import { SuiviProspect } from "@/schemas/suiviProspectSchema";

interface ViewSuiviProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suiviProspect: SuiviProspect;
}

export function ViewSuiviProspectDialog({ 
  open,
  onOpenChange,
  suiviProspect 
}: ViewSuiviProspectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Détails du suivi prospect
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur le suivi prospect.
          </DialogDescription>
        </DialogHeader>
        
        {/* Main Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Référence</h4>
              <p className="mt-1 text-sm font-semibold">{suiviProspect.Reference}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Libellé</h4>
              <p className="mt-1 text-sm font-semibold">{suiviProspect.Libelle}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Relance</h4>
              <p className="mt-1 text-sm font-semibold">{suiviProspect.Relance ? "Oui" : "Non"}</p>
            </div>
          </div>
          
     

          {/* System Information */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Informations système</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Utilisateur</h4>
                <div className="mt-1 flex items-center gap-1">
                  <User className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">{suiviProspect.Utilisateur || "Non défini"}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date de création</h4>
                <div className="mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">{suiviProspect.Heure || "Non défini"}</p>
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