"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRegimeTva } from "@/hooks/useRegimeTva";
import { 
  updateRegimeTvaSchema, 
  UpdateRegimeTvaFormData, 
  RegimeTva 
} from "@/schemas/regimeTvaSchema";

interface UpdateRegimeTvaDialogProps {
  regimeTva: RegimeTva | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateRegimeTvaDialog({ 
  regimeTva, 
  open, 
  onOpenChange, 
  onSuccess 
}: UpdateRegimeTvaDialogProps) {
  const { updateRegimeTva, isLoading } = useRegimeTva();
  const { toast } = useToast();

  const form = useForm<UpdateRegimeTvaFormData>({
    resolver: zodResolver(updateRegimeTvaSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Sous_Traitance: false,
    },
  });

  useEffect(() => {
    if (regimeTva && open) {
      form.reset({
        Reference: regimeTva.Reference,
        Libelle: regimeTva.Libelle || "",
        Sous_Traitance: regimeTva.Sous_Traitance || false,
      });
    }
  }, [regimeTva, open, form]);

  const onSubmit = async (data: UpdateRegimeTvaFormData) => {
    try {
      const success = await updateRegimeTva(data);
      if (success) {
        toast({
          title: "Succès",
          description: "Régime de TVA modifié avec succès",
        });
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du régime de TVA",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Modifier le régime de TVA
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations du régime de TVA.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence *</FormLabel>
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
                  <FormLabel>Libellé *</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le libellé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Sous_Traitance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Sous-traitance</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Ce régime de TVA concerne-t-il la sous-traitance ?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 