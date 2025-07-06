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
import { objetReclamationSchema, type ObjetReclamationFormValues } from "@/schemas/objetReclamationSchema";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { useObjetReclamation } from "@/hooks/useObjetReclamation";

interface AddObjetReclamationDialogProps {
  onObjetReclamationAdded?: () => void;
}

export function AddObjetReclamationDialog({ onObjetReclamationAdded }: AddObjetReclamationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createObjetReclamation } = useObjetReclamation();

  const form = useForm<ObjetReclamationFormValues>({
    resolver: zodResolver(objetReclamationSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
    },
  });

  const onSubmit = async (data: ObjetReclamationFormValues) => {
    setIsLoading(true);
    try {
      const success = await createObjetReclamation(data);
      if (success) {
        toast.success(`✅ Objet de réclamation créé - ${data.Libelle} a été ajouté avec succès.`);
        form.reset();
        setOpen(false);
        onObjetReclamationAdded?.();
      }
    } catch (error) {
      console.error('Erreur création objet de réclamation:', error);
      toast.error(`❌ Erreur de création - ${error instanceof Error ? error.message : "Impossible de créer l'objet de réclamation. Veuillez réessayer."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un objet de réclamation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau objet de réclamation</DialogTitle>
          <DialogDescription>
            Remplissez les informations de l'objet de réclamation. Cliquez sur enregistrer quand vous avez terminé.
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
                        placeholder="Ex: OBJ001" 
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
                          const generatedReference = `OBJ${timestamp}${randomSuffix}`;
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
                      placeholder="Ex: Objet de réclamation entreprise ABC" 
                      {...field} 
                      disabled={isLoading}
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