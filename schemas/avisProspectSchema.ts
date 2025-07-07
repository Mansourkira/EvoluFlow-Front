import { z } from "zod";

// Avis Prospect Schema
export const avisProspectSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Utilisateur: z.string().optional().nullable(),
  Heure: z.date().optional().nullable(),
});

// Add Avis Prospect Schema
export const addAvisProspectSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
});

// Update Avis Prospect Schema
export const updateAvisProspectSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
});

// Types
export type AvisProspect = z.infer<typeof avisProspectSchema>;
export type AddAvisProspectFormData = z.infer<typeof addAvisProspectSchema>;
export type UpdateAvisProspectFormData = z.infer<typeof updateAvisProspectSchema>;

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