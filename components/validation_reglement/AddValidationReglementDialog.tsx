import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addValidationReglementSchema,
  AddValidationReglementFormData,
} from "@/schemas/validationReglementSchema";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddValidationReglementFormData) => void;
}

export default function AddValidationReglementDialog({
  open,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddValidationReglementFormData>({
    resolver: zodResolver(addValidationReglementSchema),
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleFormSubmit = (data: AddValidationReglementFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une validation règlement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="Reference" className="mb-1 block">
              Référence
            </label>
            <Input
              id="Reference"
              {...register("Reference")}
              placeholder="Référence"
            />
            {errors.Reference && (
              <p className="text-sm text-red-600">{errors.Reference.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="Libelle">Libellé</label>
            <Input
              id="Libelle"
              {...register("Libelle")}
              placeholder="Libellé"
            />
            {errors.Libelle && (
              <p className="text-sm text-red-600">{errors.Libelle.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="Valide">Valide</label>
          <select
  {...register("Valide", { valueAsNumber: true })}
  id="Valide"
  className="w-full border px-2 py-1 rounded"
>
  <option value={1}>Oui</option>
  <option value={0}>Non</option>
</select>

            {errors.Valide && (
              <p className="text-sm text-red-600">{errors.Valide.message}</p>
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
