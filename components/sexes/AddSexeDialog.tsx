// components/sexes/AddSexeDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shuffle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { addSexeSchema, AddSexeFormData } from "@/schemas/sexeSchema";

interface AddSexeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddSexeFormData) => void;
}

export default function AddSexeDialog({ open, onClose, onSubmit }: AddSexeDialogProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } =
    useForm<AddSexeFormData>({ resolver: zodResolver(addSexeSchema) });

  const onForm = (data: AddSexeFormData) => {
    onSubmit(data);
    reset();
  };

  const genRef = () => {
    const yy = new Date().getFullYear().toString().slice(-2);
    const mm = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const ref = `SX${yy}${mm}${Math.floor(1000 + Math.random() * 9000)}`;
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
          <DialogTitle>Ajouter un sexe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onForm)} className="space-y-4">
          <div>
            <label className="block mb-1">Référence</label>
            <div className="flex gap-2 items-center">
              <Input
                {...register("Reference")}
                placeholder="Cliquez pour générer"
                disabled
              />
              <Button type="button" size="icon" variant="outline" onClick={genRef}>
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
            {errors.Reference && (
              <p className="text-red-600 text-sm">{errors.Reference.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Libellé</label>
            <Input {...register("Libelle")} />
            {errors.Libelle && (
              <p className="text-red-600 text-sm">{errors.Libelle.message}</p>
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
