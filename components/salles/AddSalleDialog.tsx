"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shuffle } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { useSalles } from "@/hooks/useSalles";
import { addSalleSchema, AddSalleFormData } from "@/schemas/salleSchema";

interface AddSalleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddSalleFormData) => Promise<void>;
}

export default function AddSalleDialog({ open, onClose, onSubmit }: AddSalleDialogProps) {
  const { toast } = useToast();
  const { salles } = useSalles();

  const form = useForm<AddSalleFormData>({
    resolver: zodResolver(addSalleSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Reference_Site: "",
      Nombre_Candidat_Max: 0,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = form;

  // Génère une référence unique SAL{AA}{MM}{NNN}
  const generateReference = () => {
    const yy = new Date().getFullYear().toString().slice(-2);
    const mm = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const prefix = `SAL${yy}${mm}`;
    const existing = salles.map((s) => s.Reference).filter((r) => r.startsWith(prefix));
    let counter = 1;
    let ref = `${prefix}${counter.toString().padStart(3, "0")}`;
    while (existing.includes(ref)) {
      counter++;
      ref = `${prefix}${counter.toString().padStart(3, "0")}`;
    }
    setValue("Reference", ref);
    toast({ title: "✅ Référence générée", description: ref });
  };

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const onFormSubmit = async (data: AddSalleFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une salle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* Référence */}
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input {...field} disabled placeholder="Cliquez sur 🔄 pour générer" />
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
            {/* Libellé */}
            <FormField
              control={control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom de la salle" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Référence Site */}
            <FormField
              control={control}
              name="Reference_Site"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence du site</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ref. du site associé" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Capacité */}
            <FormField
              control={control}
              name="Nombre_Candidat_Max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacité maximale</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value?.toString() || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => { reset(); onClose(); }}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ajout..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
