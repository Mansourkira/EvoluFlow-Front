import { z } from "zod";

// Regime TVA Schema
export const regimeTvaSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Sous_Traitance: z.boolean().optional().nullable(),
  Utilisateur: z.string().optional().nullable(), // User who created the record
  Heure: z.string().optional().nullable(), // Creation date from backend
});

// Add Regime TVA Schema
export const addRegimeTvaSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Sous_Traitance: z.boolean().optional().nullable(),
});

// Update Regime TVA Schema
export const updateRegimeTvaSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire").optional(),
  Sous_Traitance: z.boolean().optional().nullable(),
});

// Types
export type RegimeTva = z.infer<typeof regimeTvaSchema>;
export type AddRegimeTvaFormData = z.infer<typeof addRegimeTvaSchema>;
export type UpdateRegimeTvaFormData = z.infer<typeof updateRegimeTvaSchema>;

// Utility functions for Sous_Traitance display
export const getSousTraitanceLabel = (sousTraitance: boolean | null | undefined): string => {
  if (sousTraitance === true) return "Oui";
  if (sousTraitance === false) return "Non";
  return "Non défini";
};

export const getSousTraitanceColor = (sousTraitance: boolean | null | undefined): string => {
  if (sousTraitance === true) return "bg-green-100 text-green-800";
  if (sousTraitance === false) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

// Utility function for date formatting
export const formatCreationDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Non défini";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
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