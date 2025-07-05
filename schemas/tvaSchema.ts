import { z } from "zod";

// ✅ Schéma pour l'ajout
export const addTvaSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
  Taux: z.string().min(1, "Taux requis"),
  Actif: z.union([z.literal(0), z.literal(1)]),
});

// ✅ Schéma pour la mise à jour
export const updateTvaSchema = addTvaSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// ✅ Types TypeScript
export type AddTvaFormData = z.infer<typeof addTvaSchema>;
export type Tva = z.infer<typeof updateTvaSchema>;
