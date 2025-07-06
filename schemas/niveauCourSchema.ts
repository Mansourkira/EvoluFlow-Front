import { z } from "zod";

// Schéma pour l’ajout d’un niveau de cours
export const addNiveauCourSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
  Nombre_Heure: z
    .number({ invalid_type_error: "Nombre d'heures requis" })
    .int()
    .min(0, "Nombre d'heures requis"),
});

// Schéma pour la mise à jour (avec Utilisateur et Heure)
export const updateNiveauCourSchema = addNiveauCourSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// Types TypeScript
export type AddNiveauCourFormData = z.infer<typeof addNiveauCourSchema>;
export type NiveauCour = z.infer<typeof updateNiveauCourSchema>;
