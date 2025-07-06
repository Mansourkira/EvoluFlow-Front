
import { z } from "zod";

// ✅ Schéma principal pour la table Raison_Report
export const raisonSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Utilisateur: z.string().optional().nullable(),
  Heure: z.date().optional().nullable(),
});

// ✅ Type TypeScript correspondant
export type Raison = z.infer<typeof raisonSchema>;

// ✅ Schéma pour le formulaire d’ajout
export const addRaisonSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
});

// ✅ Schéma pour le formulaire de mise à jour (tous les champs optionnels)
export const updateRaisonSchema = addRaisonSchema.partial();

// ✅ Types associés
export type AddRaisonFormData = z.infer<typeof addRaisonSchema>;
export type UpdateRaisonFormData = z.infer<typeof updateRaisonSchema>;
