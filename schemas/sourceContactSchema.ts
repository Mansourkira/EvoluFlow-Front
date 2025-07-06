import { z } from "zod";

// ✅ Schéma pour l’ajout
export const addSourceContactSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
});

// ✅ Schéma pour la mise à jour (ajout des champs utilisateur et heure)
export const updateSourceContactSchema = addSourceContactSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// ✅ Types TypeScript
export type AddSourceContactFormData = z.infer<typeof addSourceContactSchema>;
export type SourceContact            = z.infer<typeof updateSourceContactSchema>;
