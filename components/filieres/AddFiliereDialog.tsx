"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddFiliereFormData, addFiliereSchema } from "@/schemas/filiereSchema";
import { useFilieres } from "@/hooks/useFilieres";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, GraduationCap, RefreshCw, Shuffle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsers } from "@/hooks/useUsers";

interface AddFiliereDialogProps {
  trigger?: React.ReactNode;
  onFiliereAdded?: () => void;
}

export function AddFiliereDialog({ trigger, onFiliereAdded }: AddFiliereDialogProps) {
  const [open, setOpen] = useState(false);
  const { addFiliere, isLoading, filieres } = useFilieres();
  const { toast } = useToast();
 
  const form = useForm<AddFiliereFormData>({
    resolver: zodResolver(addFiliereSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Description: "",
      Delai_Max_Traitement_Dossier: undefined,
      Prix_Traitement_Dossier: undefined,
          Heure   : undefined,
    },
  });

  // Generate reference function
  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Get existing references to avoid duplicates
    const existingRefs = filieres.map(f => f.Reference).filter(ref => ref.startsWith(`FIL${year}${month}`));
    
    // Generate a unique number
    let counter = 1;
    let newRef = `FIL${year}${month}${counter.toString().padStart(3, '0')}`;
    
    while (existingRefs.includes(newRef)) {
      counter++;
      newRef = `FIL${year}${month}${counter.toString().padStart(3, '0')}`;
    }
    
    form.setValue('Reference', newRef);
    toast({
      title: "✅ Référence générée",
      description: `Nouvelle référence: ${newRef}`,
    });
  };

  const onSubmit = async (data: AddFiliereFormData) => {
    try {
      const success = await addFiliere(data);
      if (success) {
        toast({
          title: "✅ Filière ajoutée",
          description: `La filière "${data.Libelle}" a été ajoutée avec succès.`,
        });
        form.reset();
        setOpen(false); // Close the dialog
        onFiliereAdded?.(); // Trigger the callback to refresh the table
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de l'ajout de la filière",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    } else {
      // Auto-generate reference when dialog opens
      if (!form.getValues('Reference')) {
        generateReference();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#3A90DA] hover:bg-[#2A7BC8] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une filière
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#3A90DA]" />
            Ajouter une nouvelle filière
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle filière d'études.
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
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="Ex: FIL001"
                          {...field}
                          disabled={isLoading}
                          className="flex-1"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateReference}
                        disabled={isLoading}
                        className="px-3 flex-shrink-0"
                        title="Générer une référence automatique"
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
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


            <DialogFooter className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  generateReference();
                }}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button
                type="submit"
                className="bg-[#3A90DA] hover:bg-[#2A7BC8]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ajouter la filière
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}