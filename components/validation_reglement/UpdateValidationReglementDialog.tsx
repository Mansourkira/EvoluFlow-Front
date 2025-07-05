"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateValidationReglementSchema,
  ValidationReglement,
} from "@/schemas/validationReglementSchema";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validation: ValidationReglement;
  onSubmit: (data: ValidationReglement) => void;
}

export default function UpdateValidationReglementDialog({
  open,
  onOpenChange,
  validation,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ValidationReglement>({
    resolver: zodResolver(updateValidationReglementSchema),
    defaultValues: validation,
  });

  useEffect(() => {
    reset(validation);
  }, [validation, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="update-validation">
        <DialogHeader>
          <DialogTitle>Modifier la validation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Reference">Référence</label>
            <Input disabled {...register("Reference")} id="Reference" />
          </div>
          <div>
            <label htmlFor="Libelle">Libellé</label>
            <Input {...register("Libelle")} id="Libelle" />
            {errors.Libelle && (
              <p className="text-sm text-red-600">{errors.Libelle.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="Valide">Valide</label>
            <select
  {...register("Valide", { valueAsNumber: true })}
  id="Valide"
  className="w-full border px-2 py-1 rounded"
>
  <option value={1}>Oui</option>
  <option value={0}>Non</option>
</select>

            {errors.Valide && (
              <p className="text-sm text-red-600">{errors.Valide.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="Utilisateur">Utilisateur</label>
            <Input disabled {...register("Utilisateur")} id="Utilisateur" />
          </div>
          <div>
            <label htmlFor="Heure">Date de création</label>
            <Input disabled {...register("Heure")} id="Heure" />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Mettre à jour</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
