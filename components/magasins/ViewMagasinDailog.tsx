'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Magasin } from '@/schemas/magasinSchema';
import { Loader2 } from 'lucide-react';

interface ViewMagasinDialogProps {
  open: boolean;
  onClose: () => void;
  reference: string;
}

export default function ViewMagasinDialog({
  open,
  onClose,
  reference,
}: ViewMagasinDialogProps) {
  const [magasin, setMagasin] = useState<Magasin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagasin = async () => {
      if (!open || !reference) return;

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/v1/magasins/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ Reference: reference }),
        });

        if (!response.ok) throw new Error('Erreur de récupération');
        const data = await response.json();
        setMagasin(data);
      } catch (error) {
        console.error('Erreur lors du chargement du magasin :', error);
        setMagasin(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMagasin();
  }, [open, reference]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du magasin</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Chargement...
          </div>
        ) : magasin ? (
          <div className="grid gap-4">
            <div>
              <label>Référence</label>
              <Input value={magasin.Reference} disabled />
            </div>
            <div>
              <label>Libellé</label>
              <Input value={magasin.Libelle} disabled />
            </div>
            <div>
              <label>Stock Négatif</label>
              <Input
                value={magasin.Stock_Negatif === 1 ? 'Autorisé' : 'Non autorisé'}
                disabled
              />
            </div>
            <div>
              <label>Utilisateur</label>
              <Input value={magasin.Utilisateur ?? '-'} disabled />
            </div>
            <div>
              <label>Heure</label>
              <Input value={magasin.Heure ?? '-'} disabled />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Magasin introuvable.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
