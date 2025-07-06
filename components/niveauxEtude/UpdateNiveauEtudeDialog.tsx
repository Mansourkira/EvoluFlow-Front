"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateNiveauEtudeSchema, NiveauEtude } from "@/schemas/niveauEtudeSchema";

interface UpdateNiveauEtudeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  niveau: NiveauEtude;
  onSubmit: (data: NiveauEtude) => void;
}

export default function UpdateNiveauEtudeDialog({
  open,
  onOpenChange,
  niveau,
  onSubmit,
}: UpdateNiveauEtudeDialogProps) {
  const form = useForm<NiveauEtude>({
    resolver: zodResolver(updateNiveauEtudeSchema),
    defaultValues: niveau,
  });
  const { handleSubmit, control, reset, formState: { errors } } = form;

  useEffect(() => {
    reset(niveau);
  }, [niveau, reset]);

  const handleFormSubmit = (data: NiveauEtude) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le niveau d'étude</DialogTitle>
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
            <FormField
              control={control}
              name="Nombre_Heure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre d'heures</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
