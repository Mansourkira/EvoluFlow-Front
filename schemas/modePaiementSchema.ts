// ✅ Schéma Zod : modePaiementSchema.ts
import { z } from "zod";

// Pour l'ajout
export const addModePaiementSchema = z.object({
  Reference: z.string().min(1, "La référence est requise"),
  Libelle: z.string().min(1, "Le libellé est requis"),
  Nombre_Jour_Echeance: z.coerce.number().min(0, "Nombre de jours requis"),
  Versement_Banque: z.union([z.literal(0), z.literal(1)]),
});

// Pour la mise à jour
export const updateModePaiementSchema = addModePaiementSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// Types TypeScript
export type AddModePaiementFormData = z.infer<typeof addModePaiementSchema>;
export type ModePaiement = z.infer<typeof updateModePaiementSchema>;
