"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addHoraireDemandeSchema, AddHoraireDemandeFormData } from "@/schemas/horaireDemandeSchema";

interface AddHoraireDemandeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddHoraireDemandeFormData) => void;
}

export default function AddHoraireDemandeDialog({
  open,
  onClose,
  onSubmit,
}: AddHoraireDemandeDialogProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddHoraireDemandeFormData>({
    resolver: zodResolver(addHoraireDemandeSchema),
  });

  const handleFormSubmit = (data: AddHoraireDemandeFormData) => {
    onSubmit(data);
    reset();
  };

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const ref = `HD${year}${month}${Math.floor(1000 + Math.random() * 9000)}`;
    setValue("Reference", ref);
    toast({ title: "✅ Référence générée", description: ref });
  };

  useEffect(() => {
    if (open) {
      reset();
      generateReference();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="add-horaire-description">
        <DialogHeader>
          <DialogTitle>Ajouter un créneau horaire</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Reference" className="mb-1 block">Référence</label>
            <div className="flex gap-2 items-center">
              <Input
                id="Reference"
                {...register("Reference")}
                placeholder="Cliquez sur l’icône pour générer"
                disabled
              />
              <Button type="button" size="icon" variant="outline" onClick={generateReference}>
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
            {errors.Reference && <p className="text-sm text-red-600">{errors.Reference.message}</p>}
          </div>

          <div>
            <label htmlFor="Libelle" className="mb-1 block">Libellé</label>
            <Input
              id="Libelle"
              {...register("Libelle")}
              placeholder="Ex : 09h-12h"
            />
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
