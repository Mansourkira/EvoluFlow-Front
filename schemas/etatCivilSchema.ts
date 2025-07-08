import { z } from "zod";

// Etat Civil Schema
export const etatCivilSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Utilisateur: z.string().optional().nullable(),
  Heure: z.string().optional().nullable(),
});

// Add Etat Civil Schema
export const addEtatCivilSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
});

  // Update Etat Civil Schema
export const updateEtatCivilSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
});

// Types
export type EtatCivil = z.infer<typeof etatCivilSchema>;    
export type AddEtatCivilFormData = z.infer<typeof addEtatCivilSchema>;
export type UpdateEtatCivilFormData = z.infer<typeof updateEtatCivilSchema>;

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