"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateHoraireDemandeSchema, HoraireDemande } from "@/schemas/horaireDemandeSchema";

interface UpdateHoraireDemandeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horaire: HoraireDemande;
  onSubmit: (data: HoraireDemande) => void;
}

export default function UpdateHoraireDemandeDialog({
  open,
  onOpenChange,
  horaire,
  onSubmit,
}: UpdateHoraireDemandeDialogProps) {
  const form = useForm<HoraireDemande>({
    resolver: zodResolver(updateHoraireDemandeSchema),
    defaultValues: horaire,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset(horaire);
  }, [horaire, reset]);

  const handleFormSubmit = (data: HoraireDemande) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le créneau horaire</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={control}
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
              control={control}
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

            <DialogFooter className="flex justify-end">
              <Button type="submit">Mettre à jour</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
