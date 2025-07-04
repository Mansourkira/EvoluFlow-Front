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
import { Checkbox } from "@/components/ui/checkbox";
import { updateSuiviProspectSchema, type UpdateSuiviProspectFormData, type ViewSuiviProspectData } from "@/schemas/suiviProspectSchema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UpdateSuiviProspectDialogProps {
  suiviProspect: ViewSuiviProspectData | null;
  open: boolean;
  onClose: () => void;
  onSuiviProspectUpdated?: () => void;
}

export function UpdateSuiviProspectDialog({ suiviProspect, open, onClose, onSuiviProspectUpdated }: UpdateSuiviProspectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateSuiviProspectFormData>({
    resolver: zodResolver(updateSuiviProspectSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Relance: false,
    },
  });

  // Reset form when suivi prospect changes
  useEffect(() => {
    if (suiviProspect) {
      form.reset({
        Reference: suiviProspect.Reference,
        Libelle: suiviProspect.Libelle,
        Relance: suiviProspect.Relance,
      });
    }
  }, [suiviProspect, form]);

  const onSubmit = async (data: UpdateSuiviProspectFormData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/suivi-prospects/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`✅ Suivi prospect mis à jour - ${data.Libelle} a été modifié avec succès.`);
        
        onClose();
        onSuiviProspectUpdated?.();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du suivi prospect');
      }
    } catch (error) {
      console.error('Erreur mise à jour suivi prospect:', error);
      toast.error(`❌ Erreur de mise à jour - ${error instanceof Error ? error.message : "Impossible de mettre à jour le suivi prospect. Veuillez réessayer."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!suiviProspect) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Modifier le suivi prospect</DialogTitle>
          <DialogDescription>
            Modifiez les informations du suivi prospect. Cliquez sur enregistrer quand vous avez terminé.
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
                    <Input 
                      placeholder="Ex: SUIV001" 
                      {...field} 
                      disabled={true} // Reference should not be editable
                      className="bg-gray-50"
                    />
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
                    <Input 
                      placeholder="Ex: Suivi prospect entreprise ABC" 
                      {...field} 
                      disabled={isLoading}
                    />
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
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Relance nécessaire
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Cochez cette case si le prospect nécessite une relance
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 