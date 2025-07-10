// src/components/objetTache/AddObjetTacheDialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shuffle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useObjetTaches } from "@/hooks/useObjetTaches";
import { addObjetTacheSchema, ObjetTache } from "@/schemas/objetTacheSchema";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ObjetTache) => void;
}

export default function AddObjetTacheDialog({ open, onClose, onSubmit }: Props) {
  const { toast } = useToast();
  const { objets } = useObjetTaches();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<ObjetTache>({
    resolver: zodResolver(addObjetTacheSchema)
  });

  // Génère une réf unique
  const generateReference = () => {
    const yy = new Date().getFullYear().toString().slice(-2);
    const mm = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const prefix = `OT${yy}${mm}`;
    const existing = objets.map(o => o.Reference).filter(r => r.startsWith(prefix));
    let ref;
    do {
      ref = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
    } while (existing.includes(ref));
    setValue("Reference", ref);
    toast({ title: "Réf générée", description: ref });
  };

  useEffect(() => {
    if (open) {
      reset();
      generateReference();
    }
  }, [open, reset]);

  const onFormSubmit = (data: ObjetTache) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un Objet de Tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Reference" className="mb-1 block">Référence</label>
            <div className="flex gap-2 items-center">
              <Input
                id="Reference"
                {...register("Reference")}
                disabled
              />
              <Button type="button" size="icon" variant="outline" onClick={generateReference}>
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
            {errors.Reference && <p className="text-sm text-red-600">{errors.Reference.message}</p>}
          </div>

          <div>
            <label htmlFor="Libelle">Libellé</label>
            <Input id="Libelle" {...register("Libelle")} />
            {errors.Libelle && <p className="text-sm text-red-600">{errors.Libelle.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
