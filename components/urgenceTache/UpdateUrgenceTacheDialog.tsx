// src/components/urgenceTache/UpdateUrgenceTacheDialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UrgenceTache, updateUrgenceTacheSchema } from "@/schemas/urgenceTacheSchema";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  urgence: UrgenceTache;
  onSubmit: (data: UrgenceTache) => void;
}

export default function UpdateUrgenceTacheDialog({
  open, onOpenChange, urgence, onSubmit
}: Props) {
  const form = useForm<UrgenceTache>({
    resolver: zodResolver(updateUrgenceTacheSchema),
    defaultValues: urgence
  });
  const { handleSubmit, reset, register } = form;

  useEffect(() => {
    reset(urgence);
  }, [urgence, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier Urgence de Tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Référence</label>
            <Input {...register("Reference")} disabled />
          </div>
          <div>
            <label>Libellé</label>
            <Input {...register("Libelle")} />
          </div>
          <DialogFooter className="flex justify-end">
            <Button type="submit">Mettre à jour</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
