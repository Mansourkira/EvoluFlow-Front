"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  updateNiveauCourSchema,
  NiveauCour,
} from "@/schemas/niveauCourSchema";

interface UpdateNiveauCourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  niveau: NiveauCour;
  onSubmit: (data: NiveauCour) => Promise<void>;
}

export default function UpdateNiveauCourDialog({
  open,
  onOpenChange,
  niveau,
  onSubmit,
}: UpdateNiveauCourDialogProps) {
  const form = useForm<NiveauCour>({
    resolver: zodResolver(updateNiveauCourSchema),
    defaultValues: niveau,
  });

  const { handleSubmit, reset, control, formState } = form;

  useEffect(() => {
    reset(niveau);
  }, [niveau, reset]);

  const handleFormSubmit = async (data: NiveauCour) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier un Niveau de Cours</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel>Nombre d’heures</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={
                        field.value !== undefined && field.value !== null
                          ? String(field.value)
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="Utilisateur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utilisateur</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="Heure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de création</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={formState.isSubmitting}
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
