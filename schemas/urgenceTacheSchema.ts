// src/schemas/urgenceTacheSchema.ts
import { z } from 'zod';

// Pour l'ajout
export const addUrgenceTacheSchema = z.object({
  Reference: z.string().min(1, 'Référence requise'),
  Libelle:   z.string().min(1, 'Libellé requis'),
});

// Pour la mise à jour
export const updateUrgenceTacheSchema = addUrgenceTacheSchema.extend({
  Utilisateur: z.string().optional(),
  Heure:       z.string().optional(),
});

// Types
export type AddUrgenceTacheFormData = z.infer<typeof addUrgenceTacheSchema>;
export type UrgenceTache             = z.infer<typeof updateUrgenceTacheSchema>;
