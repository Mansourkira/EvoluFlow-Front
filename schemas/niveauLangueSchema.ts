// /schemas/niveauLangueSchema.ts
import { z } from "zod";

// Schéma pour l’ajout
export const addNiveauLangueSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
});

// Schéma pour la mise à jour (ajout des champs utilisateur et heure)
export const updateNiveauLangueSchema = addNiveauLangueSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// Types TypeScript
export type AddNiveauLangueFormData = z.infer<typeof addNiveauLangueSchema>;
export type NiveauLangue = z.infer<typeof updateNiveauLangueSchema>;
