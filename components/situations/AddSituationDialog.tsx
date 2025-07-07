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
import { addSituationSchema, Situation } from "@/schemas/situationSchema";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { useSituations } from "@/hooks/useSituations";

interface AddSituationDialogProps {
  onSituationAdded?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSituationDialog({ onSituationAdded, open, onOpenChange }: AddSituationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addSituation } = useSituations();

  const form = useForm<Situation>({
        resolver: zodResolver(addSituationSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
    },
  });

        const onSubmit = async (data: Situation) => {
    setIsLoading(true);
    try {
        const success = await addSituation(data);
        if (success) {
            toast.success(`La situation "${data.Libelle}" a été ajoutée avec succès`);
            form.reset();
            onOpenChange(false);
            onSituationAdded?.();
        } else {
            toast.error("Erreur lors de l'ajout de la situation");
        }
    } catch (error) {
        console.error('Erreur création situation:', error);
        toast.error(error instanceof Error ? error.message : "Une erreur est survenue lors de l'ajout de la situation");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ajouter une situation</DialogTitle>
          <DialogDescription>
            Remplissez les informations de la situation. Cliquez sur enregistrer quand vous avez terminé.
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
                        placeholder="Ex: SIT001" 
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
                          const generatedReference = `SIT${timestamp}${randomSuffix}`;
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
                          placeholder="Ex: Situation entreprise ABC" 
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
                onClick={() => onOpenChange(false)}
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