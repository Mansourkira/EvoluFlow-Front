import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type TypeDocumentIdentite } from "@/schemas/typeDocumentIdentiteSchema";
import { formatCreationDate } from "@/schemas/typeDocumentIdentiteSchema";

interface ViewTypeDocumentIdentiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  typeDocumentIdentite: TypeDocumentIdentite | null;
  onTypeDocumentIdentiteUpdated: () => void;
  onTypeDocumentIdentiteDeleted: () => void;
}

export function ViewTypeDocumentIdentiteDialog({
  open,
  onOpenChange,
  typeDocumentIdentite,
  onTypeDocumentIdentiteUpdated,
  onTypeDocumentIdentiteDeleted,
}: ViewTypeDocumentIdentiteDialogProps) {
  if (!typeDocumentIdentite) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails du type de document d'identité</DialogTitle>
          <DialogDescription>
            Informations détaillées sur le type de document d'identité.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Référence:</span>
            <span className="col-span-3">{typeDocumentIdentite.Reference}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Libellé:</span>
            <span className="col-span-3">{typeDocumentIdentite.Libelle}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Créé par:</span>
            <span className="col-span-3">{typeDocumentIdentite.Utilisateur || "Non défini"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Date de création:</span>
            <span className="col-span-3">
              {formatCreationDate(typeDocumentIdentite.Heure)}
            </span>
          </div>
        </div>
        <DialogFooter>
            <Button type="button" onClick={() => {
            onOpenChange(false);
            onTypeDocumentIdentiteDeleted();
          }}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 