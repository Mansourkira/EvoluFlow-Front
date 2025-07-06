"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  updateSourceContactSchema,
  SourceContact,
} from "@/schemas/sourceContactSchema";

interface UpdateSourceContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: SourceContact;
  onSubmit: (data: SourceContact) => Promise<void>;
}

export default function UpdateSourceContactDialog({
  open,
  onOpenChange,
  source,
  onSubmit,
}: UpdateSourceContactDialogProps) {
  const form = useForm<SourceContact>({
    resolver: zodResolver(updateSourceContactSchema),
    defaultValues: source,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    reset(source);
  }, [source, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la source de contact</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Référence (readonly) */}
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reference">Référence</FormLabel>
                  <FormControl>
                    <Input
                      id="reference"
                      {...field}
                      disabled
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Libellé */}
            <FormField
              control={control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="libelle">Libellé</FormLabel>
                  <FormControl>
                    <Input
                      id="libelle"
                      {...field}
                      value={field.value}
                    />
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
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
