import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateObjetReglementSchema,
  UpdateObjetReglementFormData,
} from "@/schemas/reglementShema";
import { useEffect } from "react";

interface UpdateObjetReglementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objet: UpdateObjetReglementFormData;
  onSubmit: (data: UpdateObjetReglementFormData) => Promise<void>;
}

export default function UpdateObjetReglementDialog({
  open,
  onOpenChange,
  objet,
  onSubmit,
}: UpdateObjetReglementDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateObjetReglementFormData>({
    resolver: zodResolver(updateObjetReglementSchema),
  });

  useEffect(() => {
    if (objet) {
      setValue("Reference", objet.Reference);
      setValue("Libelle", objet.Libelle);
    }
  }, [objet, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier un objet de règlement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="border p-4 rounded-lg space-y-4">
            <div>
              <label htmlFor="Reference">Référence</label>
              <Input id="Reference" disabled {...register("Reference")} />
            </div>

            <div>
              <label htmlFor="Libelle">Libellé</label>
              <Input id="Libelle" {...register("Libelle")} />
              {errors.Libelle && (
                <p className="text-sm text-red-500">{errors.Libelle.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Mise à jour..." : "Enregistrer les modifications"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
