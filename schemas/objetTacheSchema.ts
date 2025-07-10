// src/schemas/objetTacheSchema.ts
import { z } from 'zod';

// ✅ Schéma pour l'ajout
export const addObjetTacheSchema = z.object({
  Reference: z.string().min(1, 'Référence requise'),
  Libelle: z.string().min(1, 'Libellé requis'),
});

// ✅ Schéma pour la mise à jour (ajout des champs utilisateur et heure)
export const updateObjetTacheSchema = addObjetTacheSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// ✅ Types TypeScript
export type AddObjetTacheFormData = z.infer<typeof addObjetTacheSchema>;
export type ObjetTache             = z.infer<typeof updateObjetTacheSchema>;
