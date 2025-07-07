import { z } from "zod";

// Situation Schema
export const situationSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Utilisateur: z.string().optional().nullable(),
  Heure: z.string().optional().nullable(),
});

// Add Situation Schema
export const addSituationSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
});

// Update Situation Schema
export const updateSituationSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
});

// Types
  export type Situation = z.infer<typeof situationSchema>;
export type AddSituationFormData = z.infer<typeof addSituationSchema>;
export type UpdateSituationFormData = z.infer<typeof updateSituationSchema>;

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