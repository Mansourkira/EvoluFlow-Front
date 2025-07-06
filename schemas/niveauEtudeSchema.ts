import { z } from 'zod';

// schéma pour l'ajout
export const addNiveauEtudeSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
  Nombre_Heure: z.number().int().min(0, "Nombre d'heures requis"),
});

// schéma pour la mise à jour, on étend avec Utilisateur & Heure
export const updateNiveauEtudeSchema = addNiveauEtudeSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

export type AddNiveauEtudeFormData = z.infer<typeof addNiveauEtudeSchema>;
export type NiveauEtude = z.infer<typeof updateNiveauEtudeSchema>;
