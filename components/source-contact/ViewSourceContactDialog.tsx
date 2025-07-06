"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useSourceContacts } from "@/hooks/useSourceContacts";
import { SourceContact } from "@/schemas/sourceContactSchema";

interface ViewSourceContactDialogProps {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export default function ViewSourceContactDialog({
  open,
  onClose,
  reference,
}: ViewSourceContactDialogProps) {
  const { getSourceByReference } = useSourceContacts();
  const [source, setSource] = useState<SourceContact | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!open) return;
      setLoading(true);
      const data = await getSourceByReference(reference);
      setSource(data);
      setLoading(false);
    };
    load();
  }, [open, reference, getSourceByReference]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails de la source de contact</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement...
          </div>
        ) : source ? (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Référence</label>
              <Input value={source.Reference} disabled />
            </div>
            <div>
              <label className="block mb-1">Libellé</label>
              <Input value={source.Libelle} disabled />
            </div>
            <div>
              <label className="block mb-1">Utilisateur</label>
              <Input value={source.Utilisateur ?? "-"} disabled />
            </div>
            <div>
              <label className="block mb-1">Date de création</label>
              <Input value={source.Heure ?? "-"} disabled />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600">Source introuvable.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
