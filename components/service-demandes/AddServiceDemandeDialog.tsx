// components/service-demandes/AddServiceDemandeDialog.tsx
"use client";

import { useEffect } from "react";
import { Shuffle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useServiceDemandes } from "@/hooks/useServiceDemandes";
import {
  addServiceDemandeSchema,
  AddServiceDemandeFormData,
} from "@/schemas/serviceDemandeSchema";

interface AddServiceDemandeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddServiceDemandeFormData) => void;
}

export default function AddServiceDemandeDialog({
  open,
  onClose,
  onSubmit,
}: AddServiceDemandeDialogProps) {
  const { toast } = useToast();
  const { serviceDemandes } = useServiceDemandes();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<AddServiceDemandeFormData>({
    resolver: zodResolver(addServiceDemandeSchema),
  });

  // Génère une référence SD + AA + MM + 4 chiffres au hasard
  const generateReference = () => {
    const yy = new Date().getFullYear().toString().slice(-2);
    const mm = (new Date().getMonth() + 1).toString().padStart(2, "0");
    // On peut filtrer si on veut garantir l'unicité :
    const existing = serviceDemandes.map((d) => d.Reference);
    let ref: string;
    do {
      ref = `SD${yy}${mm}${Math.floor(1000 + Math.random() * 9000)}`;
    } while (existing.includes(ref));
    setValue("Reference", ref);
    toast({
      title: "✅ Référence générée",
      description: `Nouvelle référence : ${ref}`,
    });
  };

  // À chaque ouverture, on reset le formulaire
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const onSubmitForm = (data: AddServiceDemandeFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une demande de service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Référence */}
          <div>
            <label htmlFor="Reference" className="mb-1 block">
              Référence
            </label>
            <div className="flex gap-2 items-center">
              <Input
                id="Reference"
                {...register("Reference")}
                placeholder="Cliquez sur l’icône pour générer"
                disabled
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={generateReference}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </div>
            {errors.Reference && (
              <p className="text-sm text-red-600">
                {errors.Reference.message}
              </p>
            )}
          </div>

          {/* Libellé */}
          <div>
            <label htmlFor="Libelle" className="mb-1 block">
              Libellé
            </label>
            <Input
              id="Libelle"
              {...register("Libelle")}
              placeholder="Libellé de la demande"
            />
            {errors.Libelle && (
              <p className="text-sm text-red-600">{errors.Libelle.message}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
