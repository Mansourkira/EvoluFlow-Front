'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMagasins } from '@/hooks/use-magasin';

export default function AddMagasinDialog() {
  const { addMagasin, refetch } = useMagasins();
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState('');
  const [libelle, setLibelle] = useState('');
  const [stockNegatif, setStockNegatif] = useState<0 | 1>(0);

  const handleSubmit = async () => {
    const success = await addMagasin({
      Reference: reference,
      Libelle: libelle,
      Stock_Negatif: stockNegatif,
    });

    if (success) {
      setOpen(false);
      setReference('');
      setLibelle('');
      setStockNegatif(0);
      refetch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Ajouter un magasin</Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-w-full">
        <DialogHeader>
          <DialogTitle>Ajouter un magasin</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Référence"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <Input
            placeholder="Libellé"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
          />
          <select
            value={stockNegatif}
            onChange={(e) => setStockNegatif(Number(e.target.value) as 0 | 1)}
            className="border rounded px-3 py-2"
          >
            <option value={0}>Stock Positif</option>
            <option value={1}>Stock Négatif Autorisé</option>
          </select>
        </div>
        <Button onClick={handleSubmit}>Enregistrer</Button>
      </DialogContent>
    </Dialog>
  );
}
