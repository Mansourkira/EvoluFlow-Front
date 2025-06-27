"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateFiliereFormData, updateFiliereSchema, Filiere } from "@/schemas/filiereSchema";
import { useFilieres } from "@/hooks/useFilieres";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, GraduationCap } from "lucide-react";

interface UpdateFiliereDialogProps {
  filiere: Filiere | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateFiliereDialog({ filiere, open, onOpenChange }: UpdateFiliereDialogProps) {
  const { updateFiliere, isLoading } = useFilieres();
  const { toast } = useToast();

  const form = useForm<UpdateFiliereFormData>({
    resolver: zodResolver(updateFiliereSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Description: "",
      Delai_Max_Traitement_Dossier: undefined,
      Prix_Traitement_Dossier: undefined,
      Utilisateur: "",
    },
  });

  useEffect(() => {
    if (filiere && open) {
      form.reset({
        Reference: filiere.Reference,
        Libelle: filiere.Libelle,
        Description: filiere.Description || "",
        Delai_Max_Traitement_Dossier: filiere.Delai_Max_Traitement_Dossier || undefined,
        Prix_Traitement_Dossier: filiere.Prix_Traitement_Dossier || undefined,
        Utilisateur: filiere.Utilisateur || "",
      });
    }
  }, [filiere, open, form]);

  const onSubmit = async (data: UpdateFiliereFormData) => {
    try {
      const success = await updateFiliere(data);
      if (success) {
        toast({
          title: "✅ Succès",
          description: "Filière modifiée avec succès",
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la modification de la filière",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#3A90DA]" />
            Modifier la filière
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de la filière "{filiere?.Libelle}".
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reference */}
              <FormField
                control={form.control}
                name="Reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: FIL001"
                        {...field}
                        disabled={true} // Reference should not be editable
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Libelle */}
              <FormField
                control={form.control}
                name="Libelle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Informatique"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de la filière..."
                      className="min-h-[80px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delai_Max_Traitement_Dossier */}
              <FormField
                control={form.control}
                name="Delai_Max_Traitement_Dossier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Délai max de traitement (jours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 30"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value || ""}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prix_Traitement_Dossier */}
              <FormField
                control={form.control}
                name="Prix_Traitement_Dossier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix de traitement (TND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 250.00"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value || ""}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Utilisateur */}
            <FormField
              control={form.control}
              name="Utilisateur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utilisateur responsable</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Référence de l'utilisateur"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2 pt-4">
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
                className="bg-[#3A90DA] hover:bg-[#2A7BC8]"
                disabled={isLoading}
              >
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