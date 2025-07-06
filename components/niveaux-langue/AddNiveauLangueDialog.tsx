// components/niveaux-langue/AddNiveauLangueDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { addNiveauLangueSchema, AddNiveauLangueFormData } from "@/schemas/niveauLangueSchema";
import { NiveauLangue } from "@/schemas/niveauLangueSchema";

interface AddNiveauLangueDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddNiveauLangueFormData) => void;
}

export default function AddNiveauLangueDialog({
  open,
  onClose,
  onSubmit,
}: AddNiveauLangueDialogProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } =
    useForm<AddNiveauLangueFormData>({ resolver: zodResolver(addNiveauLangueSchema) });

  const handleFormSubmit = (data: AddNiveauLangueFormData) => {
    onSubmit(data);
    reset();
  };

  const generateReference = () => {
    const yy = new Date().getFullYear().toString().slice(-2);
    const mm = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const ref = `NL${yy}${mm}${Math.floor(1000 + Math.random() * 9000)}`;
    setValue("Reference", ref);
    toast({ title: "✅ Réf. générée", description: ref });
  };

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un niveau de langue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Reference" className="mb-1 block">Référence</label>
            <div className="flex items-center gap-2">
              <Input
                id="Reference"
                {...register("Reference")}
                placeholder="Cliquez pour générer"
                disabled
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
            <label htmlFor="Libelle" className="mb-1 block">Libellé</label>
            <Input id="Libelle" {...register("Libelle")} />
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
