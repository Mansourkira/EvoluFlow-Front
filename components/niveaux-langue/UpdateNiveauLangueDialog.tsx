// components/niveaux-langue/UpdateNiveauLangueDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { updateNiveauLangueSchema, NiveauLangue } from "@/schemas/niveauLangueSchema";

interface UpdateNiveauLangueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  niveau: NiveauLangue;
  onSubmit: (data: NiveauLangue) => void;
}

export default function UpdateNiveauLangueDialog({
  open,
  onOpenChange,
  niveau,
  onSubmit,
}: UpdateNiveauLangueDialogProps) {
  const form = useForm<NiveauLangue>({
    resolver: zodResolver(updateNiveauLangueSchema),
    defaultValues: niveau,
  });
  const { handleSubmit, control, reset, formState: { errors } } = form;

  useEffect(() => {
    reset(niveau);
  }, [niveau, reset]);

  const onFormSubmit = (data: NiveauLangue) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier un niveau de langue</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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
                  <FormMessage>{errors.Libelle?.message}</FormMessage>
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
