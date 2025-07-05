'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useMagasins } from '@/hooks/use-magasin';
import { Magasin } from '@/schemas/magasinShema';

interface ViewMagasinDialogProps {
  reference: string;
}

export default function ViewMagasinDialog({ reference }: ViewMagasinDialogProps) {
  const [open, setOpen] = useState(false);
  const [magasin, setMagasin] = useState<Magasin | null>(null);
  const { getMagasinByReference } = useMagasins();

  useEffect(() => {
    if (open) {
      getMagasinByReference(reference).then((data) => setMagasin(data));
    }
  }, [open, reference, getMagasinByReference]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-w-full">
        <DialogHeader>
          <DialogTitle>Détails du Magasin</DialogTitle>
        </DialogHeader>
        {magasin ? (
          <div className="grid gap-4 py-4">
            <p><strong>Référence :</strong> {magasin.Reference}</p>
            <p><strong>Libellé :</strong> {magasin.Libelle}</p>
            <p><strong>Stock Négatif :</strong> {magasin.Stock_Negatif ? 'Oui' : 'Non'}</p>
            <p><strong>Utilisateur :</strong> {magasin.Utilisateur || '-'}</p>
            <p><strong>Heure :</strong> {magasin.Heure ? new Date(magasin.Heure).toLocaleString() : '-'}</p>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
