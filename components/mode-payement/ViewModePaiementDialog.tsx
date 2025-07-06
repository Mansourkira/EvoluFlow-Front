"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModePaiement } from "@/schemas/modePaiementSchema";
import { CalendarDays, Hash, User2 } from "lucide-react";

interface ViewModePaiementDialogProps {
  open: boolean;
  onClose: () => void;
  mode: ModePaiement;
}

export default function ViewModePaiementDialog({ open, onClose, mode }: ViewModePaiementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <Hash className="h-5 w-5" /> Détails du Mode de Paiement
          </DialogTitle>
          <DialogDescription>Voici les informations du mode de paiement.</DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-md">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">Référence:</span> {mode.Reference}
            </div>
            <div className="flex items-center gap-2">
              <User2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">Libellé:</span> {mode.Libelle}
            </div>
            
            {mode.Utilisateur && (
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Utilisateur:</span> {mode.Utilisateur}
              </div>
            )}
            {mode.Heure && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Créé le:</span> {new Date(mode.Heure).toLocaleString("fr-FR")}
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
