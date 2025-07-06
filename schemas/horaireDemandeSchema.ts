import { z } from "zod";

// ✅ Schéma pour l'ajout
export const addHoraireDemandeSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
});

// ✅ Schéma pour la mise à jour (avec Utilisateur et Heure)
export const updateHoraireDemandeSchema = addHoraireDemandeSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// ✅ Types TypeScript
export type AddHoraireDemandeFormData = z.infer<typeof addHoraireDemandeSchema>;
export type HoraireDemande = z.infer<typeof updateHoraireDemandeSchema>;
