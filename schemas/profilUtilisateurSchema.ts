import { z } from "zod";

// Schéma pour l’ajout
export const addProfilUtilisateurSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
  Couleur_Badge: z.string().min(1, "Couleur du badge requise"),
});

// Schéma pour la mise à jour (avec Utilisateur et Heure)
export const updateProfilUtilisateurSchema = addProfilUtilisateurSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

// Types TypeScript
export type AddProfilUtilisateurFormData = z.infer<typeof addProfilUtilisateurSchema>;
export type ProfilUtilisateur = z.infer<typeof updateProfilUtilisateurSchema>;
