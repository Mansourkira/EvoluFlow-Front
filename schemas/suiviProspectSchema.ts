import { z } from "zod";

// Suivi Prospect Schema
export const suiviProspectSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Utilisateur: z.string().optional().nullable(),
  Heure: z.string().optional().nullable(),
  Relance: z.boolean().default(false),
});

// Add Suivi Prospect Schema
export const addSuiviProspectSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Utilisateur: z.string().optional().nullable(),
  Relance: z.boolean().default(false),
});

// Update Suivi Prospect Schema
export const updateSuiviProspectSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Relance: z.boolean(),
  Utilisateur: z.string().optional().nullable(),
});

// Types
export type SuiviProspect = z.infer<typeof suiviProspectSchema>;
export type AddSuiviProspectFormData = z.infer<typeof addSuiviProspectSchema>;
export type UpdateSuiviProspectFormData = z.infer<typeof updateSuiviProspectSchema>;

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