// components/sexes/UpdateSexeDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { updateSexeSchema, Sexe } from "@/schemas/sexeSchema";

interface UpdateSexeDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  sexe: Sexe;
  onSubmit: (data: Sexe) => void;
}

export default function UpdateSexeDialog({
  open, onOpenChange, sexe, onSubmit
}: UpdateSexeDialogProps) {
  const form = useForm<Sexe>({
    resolver: zodResolver(updateSexeSchema),
    defaultValues: sexe,
  });
  const { handleSubmit, control, reset, formState: { errors } } = form;

  useEffect(() => {
    reset(sexe);
  }, [sexe, reset]);

  const onForm = (data: Sexe) => onSubmit(data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier un sexe</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onForm)} className="space-y-4">
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl><Input disabled {...field} /></FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
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
