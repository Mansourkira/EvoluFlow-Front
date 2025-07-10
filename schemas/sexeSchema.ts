// schemas/sexeSchema.ts
import { z } from "zod";

// ✅ Pour l'ajout
export const addSexeSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
});

// ✅ Pour la mise à jour (utilisateur + heure ajoutés en base)
export const updateSexeSchema = addSexeSchema.extend({
  Utilisateur: z.string().optional(),
  Heure:      z.string().optional(),
});

// Types TS
export type AddSexeFormData = z.infer<typeof addSexeSchema>;
export type Sexe              = z.infer<typeof updateSexeSchema>;
