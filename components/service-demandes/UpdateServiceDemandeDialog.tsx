// components/serviceDemand/UpdateServiceDemandeDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  updateServiceDemandeSchema,
  ServiceDemande,
} from "@/schemas/serviceDemandeSchema";

interface UpdateServiceDemandeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demande: ServiceDemande;
  onSubmit: (data: ServiceDemande) => Promise<void>;
}

export default function UpdateServiceDemandeDialog({
  open,
  onOpenChange,
  demande,
  onSubmit,
}: UpdateServiceDemandeDialogProps) {
  const form = useForm<ServiceDemande>({
    resolver: zodResolver(updateServiceDemandeSchema),
    defaultValues: demande,
  });
  const { handleSubmit, control, reset, formState } = form;

  useEffect(() => {
    reset(demande);
  }, [demande, reset]);

  const onSubmitInternal = async (data: ServiceDemande) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la demande de service</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitInternal)} className="space-y-4">
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
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

            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={formState.isSubmitting}>
                Modifier
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
