'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Magasin } from '@/schemas/magasinShema';
import { useMagasins } from '@/hooks/use-magasin';

interface Props {
  magasin: Magasin;
}

export default function UpdateMagasinDialog({ magasin }: Props) {
  const { updateMagasin, refetch } = useMagasins();
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState(magasin.Reference);
  const [libelle, setLibelle] = useState(magasin.Libelle);
  const [stockNegatif, setStockNegatif] = useState<0 | 1>(magasin.Stock_Negatif);

  useEffect(() => {
    if (open) {
      setReference(magasin.Reference);
      setLibelle(magasin.Libelle);
      setStockNegatif(magasin.Stock_Negatif);
    }
  }, [open, magasin]);

  const handleSubmit = async () => {
    const success = await updateMagasin({
      Reference: reference,
      Libelle: libelle,
      Stock_Negatif: stockNegatif,
    });

    if (success) {
      setOpen(false);
      refetch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Modifier</Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-w-full">
        <DialogHeader>
          <DialogTitle>Modifier un magasin</DialogTitle>
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
