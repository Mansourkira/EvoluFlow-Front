"use client";

import { useEffect } from "react";
import { Plus, Loader2, Shuffle, Hash, StickyNote, Clock } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNiveauxCour } from "@/hooks/useNiveauxCour";
import {
  addNiveauCourSchema,
  AddNiveauCourFormData,
} from "@/schemas/niveauCourSchema";

interface AddNiveauCourDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddNiveauCourFormData) => Promise<void>;
}

export default function AddNiveauCourDialog({
  open,
  onClose,
  onSubmit,
}: AddNiveauCourDialogProps) {
  const { niveaux, fetchNiveaux } = useNiveauxCour();
  const { toast } = useToast();

  const form = useForm<AddNiveauCourFormData>({
    resolver: zodResolver(addNiveauCourSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Nombre_Heure: 0,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState,
  } = form;

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const prefix = `NC${year}${month}`;
    const existing = niveaux
      .map((n) => n.Reference)
      .filter((r) => r.startsWith(prefix));
    let counter = 1;
    let ref = `${prefix}${counter.toString().padStart(3, "0")}`;
    while (existing.includes(ref)) {
      counter++;
      ref = `${prefix}${counter.toString().padStart(3, "0")}`;
    }
    setValue("Reference", ref);
    toast({ title: "Référence générée", description: ref });
  };

  useEffect(() => {
    if (open) {
      fetchNiveaux();
      if (!getValues("Reference")) generateReference();
    }
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: AddNiveauCourFormData) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un Niveau de Cours</DialogTitle>
          <DialogDescription>
            Remplissez les champs requis.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <Input {...field} value={field.value || ""} />
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

            <FormField
              control={control}
              name="Nombre_Heure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre d’heures</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <Input
                        type="number"
                        value={
                          field.value !== undefined && field.value !== null
                            ? String(field.value)
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
