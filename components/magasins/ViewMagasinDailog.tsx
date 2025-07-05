"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Hash, Landmark, User2, XCircle } from "lucide-react";
import { Magasin } from "@/schemas/magasinShema";

interface ViewMagasinDialogProps {
  magasin: Magasin;
  open: boolean;
  onClose: () => void;
}

export default function ViewMagasinDialog({ magasin, open, onClose }: ViewMagasinDialogProps) {
  if (!magasin) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Détails du magasin
            </DialogTitle>
          </DialogHeader>
          <p>Magasin introuvable</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" /> Détails du magasin
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Hash className="h-4 w-4" /> Référence
            </label>
            <Input value={magasin.Reference} disabled />
          </div>

          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Landmark className="h-4 w-4" /> Libellé
            </label>
            <Input value={magasin.Libelle} disabled />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Stock Négatif</label>
            <Input
              value={magasin.Stock_Negatif === 1 ? "Autorisé" : "Non autorisé"}
              disabled
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <User2 className="h-4 w-4" /> Utilisateur
            </label>
            <Input value={magasin.Utilisateur || "N/A"} disabled />
          </div>

          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Date de Création
            </label>
            <Input
              value={
                magasin.Heure
                  ? new Date(magasin.Heure).toLocaleString("fr-FR")
                  : "N/A"
              }
              disabled
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
