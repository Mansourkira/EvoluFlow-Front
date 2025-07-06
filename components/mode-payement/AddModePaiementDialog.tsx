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
  const { modes, fetchModes } = useModePaiement();
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

  const { handleSubmit, reset, control, setValue, formState } = form;

  const generateReference = async () => {
    await fetchModes(); // 🔁 met à jour la liste à jour
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const prefix = `MP${year}${month}`;

    const existingRefs = modes
      .map((m) => m.Reference)
      .filter((ref) => ref.startsWith(prefix));

    let counter = 1;
    let newRef = `${prefix}${counter.toString().padStart(3, "0")}`;
    while (existingRefs.includes(newRef)) {
      counter++;
      newRef = `${prefix}${counter.toString().padStart(3, "0")}`;
    }

    setValue("Reference", newRef);
    toast({ title: "Référence générée", description: newRef });
  };

  useEffect(() => {
    if (open) {
      generateReference(); // ✅ appelle une nouvelle référence toujours fraîche
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
    <Dialog open={open} onOpenChange={(state) => !state && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un Mode de Paiement</DialogTitle>
          <DialogDescription>Remplissez les champs requis.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reference">Référence</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <Input id="reference" {...field} value={field.value || ""} />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={generateReference}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="libelle">Libellé</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <StickyNote className="w-4 h-4 text-gray-500" />
                      <Input id="libelle" {...field} value={field.value || ""} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="Versement_Banque"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="versement"
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                    />
                  </FormControl>
                  <FormLabel htmlFor="versement">Versement en banque</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="Nombre_Jour_Echeance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="echeance">Nombre de jours d'échéance</FormLabel>
                  <FormControl>
                    <Input
                      id="echeance"
                      type="number"
                      value={field.value !== undefined ? String(field.value) : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Ajout...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
