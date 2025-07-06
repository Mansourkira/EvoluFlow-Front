// components/service-demandes/UpdateServiceDemandeDialog.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {
  updateServiceDemandeSchema,
  ServiceDemande,
} from '@/schemas/serviceDemandeSchema';
import { useServiceDemandes } from '@/hooks/useServiceDemandes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface UpdateServiceDemandeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Référence de la demande à éditer */
  reference: string;
  /** Appelé quand le formulaire est soumis */
  onSubmit: (data: ServiceDemande) => Promise<void>;
}

export default function UpdateServiceDemandeDialog({
  open,
  onOpenChange,
  reference,
  onSubmit,
}: UpdateServiceDemandeDialogProps) {
  const { getServiceDemandeByReference } = useServiceDemandes();
  const [loading, setLoading] = useState(false);

  const form = useForm<ServiceDemande>({
    resolver: zodResolver(updateServiceDemandeSchema),
    defaultValues: { Reference: '', Libelle: '' },
  });
  const { handleSubmit, reset, formState } = form;

  // Charger les données quand on ouvre
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getServiceDemandeByReference(reference)
      .then((data) => {
        if (data) reset(data);
      })
      .finally(() => setLoading(false));
  }, [open, reference, getServiceDemandeByReference, reset]);

  const submitHandler = async (data: ServiceDemande) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la demande de service</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-4 flex justify-center">
            <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
              <FormField
                control={form.control}
                name="Reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Libelle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={formState.isSubmitting}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" /> Enregistrement...
                    </>
                  ) : (
                    'Mettre à jour'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
