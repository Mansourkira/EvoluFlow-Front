// src/components/objetTache/UpdateObjetTacheDialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  updateObjetTacheSchema,
  ObjetTache
} from "@/schemas/objetTacheSchema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objet: ObjetTache;
  onSubmit: (data: ObjetTache) => void;
}

export default function UpdateObjetTacheDialog({
  open,
  onOpenChange,
  objet,
  onSubmit
}: Props) {
  const form = useForm<ObjetTache>({
    resolver: zodResolver(updateObjetTacheSchema),
    defaultValues: objet
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = form;

  useEffect(() => {
    reset(objet);
  }, [objet, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier Objet de Tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Référence</label>
            <Input {...control.register("Reference")} disabled />
          </div>
          <div>
            <label>Libellé</label>
            <Input {...control.register("Libelle")} />
            {errors.Libelle && <p className="text-sm text-red-600">{errors.Libelle.message}</p>}
          </div>
          <DialogFooter className="flex justify-end">
            <Button type="submit">Mettre à jour</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
