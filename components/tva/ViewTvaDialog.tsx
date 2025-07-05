import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tva } from "@/schemas/tvaSchema";

interface Props {
  tva: Tva;
  open: boolean;
  onClose: () => void;
}

export default function ViewTvaDialog({ tva, open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails de la TVA</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Référence:</strong> {tva.Reference}</p>
          <p><strong>Libellé:</strong> {tva.Libelle}</p>
          <p><strong>Taux:</strong> {tva.Taux}</p>
          <p><strong>Actif:</strong> {tva.Actif === 1 ? "Oui" : "Non"}</p>
          <p><strong>Utilisateur:</strong> {tva.Utilisateur || "-"}</p>
          <p><strong>Date de création:</strong> {tva.Heure ? new Date(tva.Heure).toLocaleString("fr-FR") : "-"}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
