"use client";

import { useState } from "react";
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
  DialogTrigger,
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
import { addSuiviProspectSchema, type AddSuiviProspectFormData } from "@/schemas/suiviProspectSchema";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw } from "lucide-react";

interface AddSuiviProspectDialogProps {
  onSuiviProspectAdded?: () => void;
}

export function AddSuiviProspectDialog({ onSuiviProspectAdded }: AddSuiviProspectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddSuiviProspectFormData>({
    resolver: zodResolver(addSuiviProspectSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Relance: false,
    },
  });

  const onSubmit = async (data: AddSuiviProspectFormData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/suivi-prospects/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`✅ Suivi prospect créé - ${data.Libelle} a été ajouté avec succès.`);
        
        // Reset form and close dialog
        form.reset();
        setOpen(false);
        onSuiviProspectAdded?.();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la création du suivi prospect');
      }
    } catch (error) {
      console.error('Erreur création suivi prospect:', error);
      toast.error(`❌ Erreur de création - ${error instanceof Error ? error.message : "Impossible de créer le suivi prospect. Veuillez réessayer."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un suivi prospect
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau suivi prospect</DialogTitle>
          <DialogDescription>
            Remplissez les informations du suivi prospect. Cliquez sur enregistrer quand vous avez terminé.
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
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ex: SUIV001" 
                        {...field} 
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const timestamp = Date.now().toString().slice(-6);
                          const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
                          const generatedReference = `SUIV${timestamp}${randomSuffix}`;
                          field.onChange(generatedReference);
                        }}
                        disabled={isLoading}
                        title="Générer une référence automatique"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
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
                onClick={() => setOpen(false)}
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