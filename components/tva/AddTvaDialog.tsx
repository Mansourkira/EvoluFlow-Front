"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addTvaSchema,
  AddTvaFormData,
} from "@/schemas/tvaSchema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTvas } from "@/hooks/use-tva";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddTvaFormData) => void;
}

export default function AddTvaDialog({ open, onClose, onSubmit }: Props) {
  const { toast } = useToast();
  const { tvas } = useTvas();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<AddTvaFormData>({
    resolver: zodResolver(addTvaSchema),
  });

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const existingRefs = tvas.map((tva) => tva.Reference).filter((ref) => ref.startsWith(`TVA${year}${month}`));

    let counter = 1;
    let newRef = `TVA${year}${month}${counter.toString().padStart(3, '0')}`;

    while (existingRefs.includes(newRef)) {
      counter++;
      newRef = `TVA${year}${month}${counter.toString().padStart(3, '0')}`;
    }

    setValue("Reference", newRef);
    toast({
      title: "✅ Référence générée",
      description: `Nouvelle référence: ${newRef}`,
    });
  };

  useEffect(() => {
    if (open && !getValues("Reference")) {
      generateReference();
    }
    if (open) reset();
  }, [open, reset]);

  const handleFormSubmit = (data: AddTvaFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une TVA</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Reference">Référence</label>
            <div className="flex gap-2">
              <Input id="Reference" {...register("Reference")} placeholder="Référence" />
              <Button type="button" variant="outline" onClick={generateReference}>
                Générer
              </Button>
            </div>
            {errors.Reference && (
              <p className="text-sm text-red-600">{errors.Reference.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="Libelle">Libellé</label>
            <Input id="Libelle" {...register("Libelle")} placeholder="Libellé" />
            {errors.Libelle && (
              <p className="text-sm text-red-600">{errors.Libelle.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="Taux">Taux</label>
            <Input id="Taux" {...register("Taux")} placeholder="Taux" />
            {errors.Taux && (
              <p className="text-sm text-red-600">{errors.Taux.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="Actif">Actif</label>
              <select
  {...register("Actif", { valueAsNumber: true })}
  id="Valide"
  className="w-full border px-2 py-1 rounded"
>
  <option value={1}>Oui</option>
  <option value={0}>Non</option>
</select>
            {errors.Actif && (
              <p className="text-sm text-red-600">{errors.Actif.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
