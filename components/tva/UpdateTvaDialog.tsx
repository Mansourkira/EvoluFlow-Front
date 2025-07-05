import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTvaSchema, Tva } from "@/schemas/tvaSchema";
import { useEffect } from "react";

interface Props {
  tva: Tva;
  open: boolean;
  onSubmit: (data: Tva) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateTvaDialog({ tva, open, onSubmit, onOpenChange }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Tva>({
    resolver: zodResolver(addTvaSchema),
    defaultValues: tva,
  });

  useEffect(() => {
    if (open) reset(tva);
  }, [open, tva, reset]);

  const handleFormSubmit = (data: Tva) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la TVA</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Reference">Référence</label>
            <Input id="Reference" {...register("Reference")} />
            {errors.Reference && <p className="text-red-500 text-sm">{errors.Reference.message}</p>}
          </div>
          <div>
            <label htmlFor="Libelle">Libellé</label>
            <Input id="Libelle" {...register("Libelle")} />
            {errors.Libelle && <p className="text-red-500 text-sm">{errors.Libelle.message}</p>}
          </div>
          <div>
            <label htmlFor="Taux">Taux</label>
            <Input id="Taux" {...register("Taux")} />
            {errors.Taux && <p className="text-red-500 text-sm">{errors.Taux.message}</p>}
          </div>
          <div>
            <label htmlFor="Actif">Actif</label>
           <select
  {...register("Actif", { valueAsNumber: true })}
  id="Valide"
  className="w-full border px-2 py-1 rounded"
>
  <option value={1}>Oui</option>
  <option value={0}>Non</option>
</select>
            {errors.Actif && <p className="text-red-500 text-sm">{errors.Actif.message}</p>}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Modifier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
