import { z } from "zod";

// ✅ Schéma pour l'ajout
export const addValidationReglementSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
  
  Valide: z.union([z.literal(0), z.literal(1)])

});

// ✅ Schéma pour la mise à jour (ajout des champs utilisateur et heure)
export const updateValidationReglementSchema = addValidationReglementSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// ✅ Types TypeScript
export type AddValidationReglementFormData = z.infer<typeof addValidationReglementSchema>;
export type ValidationReglement = z.infer<typeof updateValidationReglementSchema>;
