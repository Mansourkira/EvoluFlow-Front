// components/mode-paiement/AddModePaiementDialog.tsx
"use client";

import { useEffect } from "react";
import { Plus, Loader2, Shuffle, Hash, StickyNote } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useModePaiement } from "@/hooks/useModePaiement";
import {
  addModePaiementSchema,
  AddModePaiementFormData,
} from "@/schemas/modePaiementSchema";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddModePaiementFormData) => Promise<void>;
}

export default function AddModePaiementDialog({ open, onClose, onSubmit }: Props) {
  const { modes } = useModePaiement();
  const { toast } = useToast();

  const form = useForm<AddModePaiementFormData>({
    resolver: zodResolver(addModePaiementSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Versement_Banque: 0,
      Nombre_Jour_Echeance: 0,
    },
  });

  const { handleSubmit, reset, control, setValue, getValues, formState } = form;

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const existing = modes
      .map((m) => m.Reference)
      .filter((ref) => ref.startsWith(`MP${year}${month}`));

    let counter = 1;
    let ref = `MP${year}${month}${counter.toString().padStart(3, "0")}`;
    while (existing.includes(ref)) {
      counter++;
      ref = `MP${year}${month}${counter.toString().padStart(3, "0")}`;
    }

    setValue("Reference", ref);         // met à jour le formulaire
    toast({ title: "Référence générée", description: ref });
  };

  // Génère une ref à l’ouverture si vide
  useEffect(() => {
    if (open && !getValues("Reference")) {
      generateReference();
    }
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: AddModePaiementFormData) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un mode de paiement</DialogTitle>
          <DialogDescription>Remplissez les champs obligatoires.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Référence + génération */}
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      {/* on retire le value explicite pour laisser react-hook-form gérer */}
                      <Input {...field} />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={generateReference}
                      >
                        <Shuffle className="w-4 h-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Libellé */}
            <FormField
              control={control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-gray-500" />
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Versement en banque */}
            <FormField
              control={control}
              name="Versement_Banque"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value === 1}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? 1 : 0)
                      }
                    />
                  </FormControl>
                  <FormLabel>Versement en banque</FormLabel>
                </FormItem>
              )}
            />

            {/* Nombre de jours */}
            <FormField
              control={control}
              name="Nombre_Jour_Echeance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jours d’échéance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                &nbsp;Ajouter
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
