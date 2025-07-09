"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import {
  addProfilUtilisateurSchema,
  AddProfilUtilisateurFormData,
} from "@/schemas/profilUtilisateurSchema";

interface AddProfilUtilisateurDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddProfilUtilisateurFormData) => void;
  existingRefs?: string[];
}

export default function AddProfilUtilisateurDialog({
  open,
  onClose,
  onSubmit,
  existingRefs = [],
}: AddProfilUtilisateurDialogProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<AddProfilUtilisateurFormData>({
    resolver: zodResolver(addProfilUtilisateurSchema),
  });

  // Réinitialise le formulaire à chaque ouverture
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    let ref: string;
    do {
      ref = `PU${year}${month}${Math.floor(1000 + Math.random() * 9000)}`;
    } while (existingRefs.includes(ref));
    setValue("Reference", ref);
    toast({ title: "✅ Réf générée", description: ref });
  };

  const onSubmitForm = (data: AddProfilUtilisateurFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un Profil Utilisateur</DialogTitle>
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
              <p className="text-sm text-red-600">{errors.Reference.message}</p>
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
              placeholder="Libellé"
            />
            {errors.Libelle && (
              <p className="text-sm text-red-600">{errors.Libelle.message}</p>
            )}
          </div>

          {/* Couleur */}
          <div>
            <label htmlFor="Couleur_Badge" className="mb-1 block">
              Couleur du badge
            </label>
            <Input
              id="Couleur_Badge"
              {...register("Couleur_Badge")}
              placeholder="#RRGGBB ou nom"
            />
            {errors.Couleur_Badge && (
              <p className="text-sm text-red-600">{errors.Couleur_Badge.message}</p>
            )}
          </div>

          {/* Bouton Ajouter */}
          <div className="flex justify-end">
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
