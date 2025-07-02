import { z } from "zod";

// Filiere Schema
export const filiereSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Description: z.string().optional().nullable(),
  Delai_Max_Traitement_Dossier: z.number().min(0, "Le délai doit être positif").optional().nullable(),
  Prix_Traitement_Dossier: z.number().min(0, "Le prix doit être positif").optional().nullable(),
  Utilisateur: z.string().optional().nullable(), // User who created the record
  Heure: z.date().optional().nullable(),  
});

// Add Filiere Schema
export const addFiliereSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Description: z.string().optional(),
  Delai_Max_Traitement_Dossier: z.number().min(0, "Le délai doit être positif").optional(),
  Prix_Traitement_Dossier: z.number().min(0, "Le prix doit être positif").optional(),
  Heure: z.date().optional().nullable(),  
});

// Update Filiere Schema
export const updateFiliereSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire").optional(),
  Description: z.string().optional(),
  Delai_Max_Traitement_Dossier: z.number().min(0, "Le délai doit être positif").optional(),
  Prix_Traitement_Dossier: z.number().min(0, "Le prix doit être positif").optional(),
  Heure: z.date().optional().nullable(),  
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

// Utility function for date formatting
export const formatCreationDate = (date: Date | string | null | undefined): string => {
  if (!date) return "Non défini";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return "Date invalide";
  }
}; 