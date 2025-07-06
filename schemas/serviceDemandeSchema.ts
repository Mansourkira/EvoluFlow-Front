import { z } from "zod";

// ✅ Schéma pour l'ajout
export const addServiceDemandeSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
});

// ✅ Schéma pour la mise à jour (ajout des champs utilisateur et heure)
export const updateServiceDemandeSchema = addServiceDemandeSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// ✅ Types TypeScript
export type AddServiceDemandeFormData = z.infer<typeof addServiceDemandeSchema>;
export type ServiceDemande = z.infer<typeof updateServiceDemandeSchema>;
