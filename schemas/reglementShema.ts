import { z } from "zod";

// ✅ Schéma Zod pour l'ajout
export const addObjetReglementSchema = z.object({
  Reference: z.string().min(1, "La référence est requise"),
  Libelle: z.string().min(1, "Le libellé est requis"),
});

export type AddObjetReglementFormData = z.infer<typeof addObjetReglementSchema>;

// ✅ Schéma Zod pour la mise à jour
export const updateObjetReglementSchema = z.object({
  Reference: z.string().min(1, "La référence est requise"),
  Libelle: z.string().min(1, "Le libellé est requis"),
});

export type UpdateObjetReglementFormData = z.infer<typeof updateObjetReglementSchema>;

// ✅ Type complet avec métadonnées
export type ObjetReglement = {
  Reference: string;
  Libelle: string;
  Utilisateur?: string | null;
  Heure?: Date | string | null;
};
