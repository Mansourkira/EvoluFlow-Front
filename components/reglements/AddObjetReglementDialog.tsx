"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddObjetReglementFormData, addObjetReglementSchema } from "@/schemas/reglementShema";

import { Shuffle } from "lucide-react";

interface AddObjetReglementDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddObjetReglementFormData) => void;
}

export default function AddObjetReglementDialog({
  open,
  onClose,
  onSubmit,
}: AddObjetReglementDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<AddObjetReglementFormData>({
    resolver: zodResolver(addObjetReglementSchema),
  });

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const reference = `OBJREG${year}${month}${random}`;
    setValue("Reference", reference);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit = (data: AddObjetReglementFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un objet de règlement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Reference">Référence</label>
            <div className="flex items-center gap-2">
              <Input
                {...register("Reference")}
                id="Reference"
                placeholder="Référence"
              />
              <Button type="button" size="icon" variant="outline" onClick={generateReference}>
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
            {errors.Reference && (
              <p className="text-sm text-red-600">{errors.Reference.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="Libelle">Libellé</label>
            <Input
              {...register("Libelle")}
              id="Libelle"
              placeholder="Libellé de l'objet"
            />
            {errors.Libelle && (
              <p className="text-sm text-red-600">{errors.Libelle.message}</p>
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
