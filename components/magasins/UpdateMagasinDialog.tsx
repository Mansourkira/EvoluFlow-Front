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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Magasin, magasinSchema} from "@/schemas/magasinShema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  magasin: Magasin;
  onSubmit: (data: Magasin) => Promise<void>;
}

export default function UpdateMagasinDialog({ open, onOpenChange, magasin, onSubmit }: Props) {
  const form = useForm<Magasin>({
    resolver: zodResolver(magasinSchema),
    defaultValues: magasin,
  });

  useEffect(() => {
    if (open) {
      form.reset(magasin);
    }
  }, [open, magasin, form]);

  const handleSubmit = (data: Magasin) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier un magasin</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
            <FormField
              control={form.control}
              name="Stock_Negatif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock négatif</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option value={0}>Non autorisé</option>
                      <option value={1}>Autorisé</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}