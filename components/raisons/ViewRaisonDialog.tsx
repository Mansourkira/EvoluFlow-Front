"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Raison } from "@/schemas/raisonShema";

interface ViewRaisonDialogProps {
  open: boolean;
  onClose: () => void;
  raison: Raison;
}

export default function ViewRaisonDialog({
  open,
  onClose,
  raison,
}: ViewRaisonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails de la raison</DialogTitle>
          <DialogDescription>Visualisez les détails de cette raison</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="border p-3 rounded-md">
            <strong>Référence :</strong> {raison.Reference}
          </div>
          <div className="border p-3 rounded-md">
            <strong>Libellé :</strong> {raison.Libelle}
          </div>
          <div className="border p-3 rounded-md">
            <strong>Utilisateur :</strong> {raison.Utilisateur}
          </div>
          <div className="border p-3 rounded-md">
            <strong>Heure :</strong>{" "}
            {raison.Heure ? new Date(raison.Heure).toLocaleString() : "-"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
