"use client";

import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSuiviProspects } from "@/hooks/useSuiviProspects";
import { SuiviProspect, updateSuiviProspectSchema, UpdateSuiviProspectFormData } from "@/schemas/suiviProspectSchema";

interface UpdateSuiviProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suiviProspect: SuiviProspect;
  onSuccess?: () => void;
}

export function UpdateSuiviProspectDialog({ 
  open,
  onOpenChange,
  suiviProspect,
  onSuccess 
}: UpdateSuiviProspectDialogProps) {
  const { updateSuiviProspect, isLoading } = useSuiviProspects();
  const { toast } = useToast();

  const form = useForm<UpdateSuiviProspectFormData>({
    resolver: zodResolver(updateSuiviProspectSchema),
    defaultValues: {
      Reference: suiviProspect.Reference,
      Libelle: suiviProspect.Libelle,
      Relance: suiviProspect.Relance || false,
    },
  });

  const onSubmit = async (data: UpdateSuiviProspectFormData) => {
    try {
      const success = await updateSuiviProspect({
        ...data,
        Reference: suiviProspect.Reference
      });
      if (success) {
        toast({
          title: "✅ Succès",
          description: "Suivi prospect modifié avec succès",
        });
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la modification du suivi prospect",
        variant: "destructive",
      });
    }
  };

  // Reset form when dialog opens with new data
  React.useEffect(() => {
    if (open && suiviProspect) {
      form.reset({
        Reference: suiviProspect.Reference,
        Libelle: suiviProspect.Libelle,
        Relance: suiviProspect.Relance || false,
      });
    }
  }, [open, suiviProspect, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Modifier le suivi prospect
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations du suivi prospect.
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
                    <Input placeholder="Entrez la référence" {...field} disabled />
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
              name="Relance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Relance
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Cochez cette case pour marquer comme relance
                    </p>
                  </div>
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
                Modifier
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}   