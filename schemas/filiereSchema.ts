import { z } from "zod";

// Filiere Schema
export const filiereSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Description: z.string().optional().nullable(),
  Delai_Max_Traitement_Dossier: z.number().min(0, "Le délai doit être positif").optional().nullable(),
  Prix_Traitement_Dossier: z.number().min(0, "Le prix doit être positif").optional().nullable(),
  Utilisateur: z.string().optional().nullable(),
  Heure: z.string().optional(),
  // User info (from JOIN)
  Nom_Prenom: z.string().optional(),
  E_mail: z.string().optional(),
  Profil: z.string().optional(),
  Type_Utilisateur: z.string().optional(),
});

// Add Filiere Schema
export const addFiliereSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Description: z.string().optional(),
  Delai_Max_Traitement_Dossier: z.number().min(0, "Le délai doit être positif").optional(),
  Prix_Traitement_Dossier: z.number().min(0, "Le prix doit être positif").optional(),
  Utilisateur: z.string().optional(),
});

// Update Filiere Schema
export const updateFiliereSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire").optional(),
  Description: z.string().optional(),
  Delai_Max_Traitement_Dossier: z.number().min(0, "Le délai doit être positif").optional(),
  Prix_Traitement_Dossier: z.number().min(0, "Le prix doit être positif").optional(),
  Utilisateur: z.string().optional(),
});

// Types
export type Filiere = z.infer<typeof filiereSchema>;
export type AddFiliereFormData = z.infer<typeof addFiliereSchema>;
export type UpdateFiliereFormData = z.infer<typeof updateFiliereSchema>;

// Utility functions
export const formatPrice = (price: number | null | undefined): string => {
  if (!price) return "Non défini";
  return new Intl.NumberFormat('fr-TN', { 
    style: 'currency', 
    currency: 'TND' 
  }).format(price);
};

export const formatDelay = (delay: number | null | undefined): string => {
  if (!delay) return "Non défini";
  return `${delay} jour${delay > 1 ? 's' : ''}`;
}; 