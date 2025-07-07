import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type AvisProspect } from "@/schemas/avisProspectSchema";
import { formatCreationDate } from "@/schemas/avisProspectSchema";
import { Calendar, User } from "lucide-react";

interface ViewAvisProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avisProspect: AvisProspect | null;
  onAvisProspectUpdated: () => void;
  onAvisProspectDeleted: () => void;
}

export function ViewAvisProspectDialog({
  open,
  onOpenChange,
  avisProspect,
  onAvisProspectUpdated,
  onAvisProspectDeleted,
}: ViewAvisProspectDialogProps) {
  if (!avisProspect) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails de l'avis prospect</DialogTitle>
          <DialogDescription>
            Informations complètes de l'avis prospect sélectionné
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Référence</label>
              <p className="mt-1 text-sm font-semibold">{avisProspect.Reference}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Libellé</label>
              <p className="mt-1 text-sm">{avisProspect.Libelle || "Non défini"}</p>
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
                  <p className="text-sm">{avisProspect.Utilisateur || "Non défini"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date de création</label>
                <div className="mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">{formatCreationDate(avisProspect.Heure)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            onAvisProspectDeleted();
          }}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 