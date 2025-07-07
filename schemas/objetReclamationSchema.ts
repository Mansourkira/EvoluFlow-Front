import { z } from "zod";

// Objet Reclamation Schema
export const objetReclamationSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Utilisateur: z.string().optional().nullable(),
  Heure: z.string().optional().nullable(),
});

// Add Objet Reclamation Schema
export const addObjetReclamationSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
});

  // Update Objet Reclamation Schema
export const updateObjetReclamationSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
});

// Types
    export type ObjetReclamation = z.infer<typeof objetReclamationSchema>;
export type AddObjetReclamationFormData = z.infer<typeof addObjetReclamationSchema>;
export type UpdateObjetReclamationFormData = z.infer<typeof updateObjetReclamationSchema>;

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