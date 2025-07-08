import { z } from 'zod';

// ✅ Schéma ajout
export const addSalleSchema = z.object({
  Reference: z.string().min(1, 'Référence requise'),
  Libelle: z.string().min(1, 'Libellé requis'),
  Reference_Site: z.string().min(1, 'Référence de site requise'),
  Nombre_Candidat_Max: z.number().int().min(0, 'Nombre max requis'),
});

// ✅ Schéma update
export const updateSalleSchema = addSalleSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// ✅ Types TS
export type AddSalleFormData = z.infer<typeof addSalleSchema>;
export type Salle = z.infer<typeof updateSalleSchema>;
