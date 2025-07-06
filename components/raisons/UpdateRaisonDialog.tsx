import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateRaisonFormData, updateRaisonSchema } from "@/schemas/raisonShema";
import { useEffect } from "react";

interface UpdateRaisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  raison: UpdateRaisonFormData;
  onSubmit: (data: UpdateRaisonFormData) => Promise<void>;
}

export default function UpdateRaisonDialog({ open, onOpenChange, raison, onSubmit }: UpdateRaisonDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRaisonFormData>({
    resolver: zodResolver(updateRaisonSchema),
  });

  useEffect(() => {
    if (raison) {
      setValue("Reference", raison.Reference);
      setValue("Libelle", raison.Libelle);
    }
  }, [raison, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier une raison</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="border p-4 rounded-lg space-y-4">
            <div>
              <Label htmlFor="Reference">Référence</Label>
              <Input id="Reference" disabled {...register("Reference")} />
            </div>

            <div>
              <Label htmlFor="Libelle">Libellé</Label>
              <Input id="Libelle" {...register("Libelle")} />
              {errors.Libelle && <p className="text-sm text-red-500">{errors.Libelle.message}</p>}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
