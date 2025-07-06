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
  updateMagasinSchema,
  Magasin,
} from "@/schemas/magasinSchema";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  magasin: Magasin;
  onSubmit: (data: Magasin) => void;
}

export default function UpdateMagasinDialog({
  open,
  onOpenChange,
  magasin,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Magasin>({
    resolver: zodResolver(updateMagasinSchema),
    defaultValues: magasin,
  });

  useEffect(() => {
    reset(magasin);
  }, [magasin, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="update-magasin-description">
        <DialogHeader>
          <DialogTitle id="update-magasin-description">Modifier le magasin</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Reference">Référence</label>
            <Input disabled {...register("Reference")} id="Reference" />
            {errors.Reference && <p className="text-red-500 text-sm">{errors.Reference.message}</p>}
          </div>
          <div>
            <label htmlFor="Libelle">Libellé</label>
            <Input {...register("Libelle")} id="Libelle" />
            {errors.Libelle && <p className="text-red-500 text-sm">{errors.Libelle.message}</p>}
          </div>
          <div>
            <label htmlFor="Stock_Negatif">Stock Négatif</label>
            <select
              {...register("Stock_Negatif", { valueAsNumber: true })}
              id="Stock_Negatif"
              className="w-full border px-2 py-1 rounded"
            >
              <option value={1}>Autorisé</option>
              <option value={0}>Non autorisé</option>
            </select>
            {errors.Stock_Negatif && <p className="text-red-500 text-sm">{errors.Stock_Negatif.message}</p>}
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
