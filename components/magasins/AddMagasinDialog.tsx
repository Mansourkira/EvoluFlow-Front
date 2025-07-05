"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { magasinSchema, AddMagasinFormData } from "@/schemas/magasinShema";
import { Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface AddMagasinDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddMagasinFormData) => void;
}

export default function AddMagasinDialog({ open, onClose, onSubmit }: AddMagasinDialogProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddMagasinFormData>({
    resolver: zodResolver(magasinSchema),
  });

  const handleFormSubmit = (data: AddMagasinFormData) => {
    onSubmit(data);
    reset();
  };

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const ref = `MAG${year}${month}${Math.floor(100 + Math.random() * 900)}`;
    setValue("Reference", ref);
    toast({ title: "✅ Référence générée", description: `Nouvelle référence : ${ref}` });
  };

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un magasin</DialogTitle>
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
            <label htmlFor="Libelle">Libellé</label>
            <Input {...register("Libelle")} id="Libelle" placeholder="Libellé du magasin" />
            {errors.Libelle && <p className="text-sm text-red-600">{errors.Libelle.message}</p>}
          </div>

          <div>
            <label htmlFor="Stock_Negatif">Stock négatif</label>
            <select {...register("Stock_Negatif")}
              id="Stock_Negatif"
              className="border rounded px-3 py-2 w-full"
            >
              <option value={0}>Non autorisé</option>
              <option value={1}>Autorisé</option>
            </select>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
