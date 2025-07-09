"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ProfilUtilisateur } from "@/schemas/profilUtilisateurSchema";
import { useProfilUtilisateurs } from "@/hooks/useProfilUtilisateurs";

interface ViewProfilUtilisateurDialogProps {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export default function ViewProfilUtilisateurDialog({
  open,
  onClose,
  reference,
}: ViewProfilUtilisateurDialogProps) {
  const { getProfilByReference } = useProfilUtilisateurs();
  const [item, setItem] = useState<ProfilUtilisateur | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getProfilByReference(reference)
      .then((d) => setItem(d))
      .finally(() => setLoading(false));
  }, [open, reference]);

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails Profil Utilisateur</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin h-5 w-5 mr-2" /> Chargement...
          </div>
        ) : item ? (
          <div className="grid gap-4">
            <div>
              <label>Référence</label>
              <Input value={item.Reference} disabled />
            </div>
            <div>
              <label>Libellé</label>
              <Input value={item.Libelle} disabled />
            </div>
            <div>
              <label>Couleur du badge</label>
              <Input value={item.Couleur_Badge} disabled />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Introuvable.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
