import { z } from 'zod';

export const addSuiviProspectSchema = z.object({
  Reference: z.string().min(1, 'Référence est requise').max(50, 'Référence doit être inférieure à 50 caractères'),
  Libelle: z.string().min(1, 'Libellé est requis').max(255, 'Libellé doit être inférieur à 255 caractères'),
  Relance: z.boolean().default(false),
});

export type AddSuiviProspectFormData = z.infer<typeof addSuiviProspectSchema>;

export const updateSuiviProspectSchema = z.object({
  Reference: z.string().min(1, 'Référence est requise').max(50, 'Référence doit être inférieure à 50 caractères'),
  Libelle: z.string().min(1, 'Libellé est requis').max(255, 'Libellé doit être inférieur à 255 caractères'),
  Relance: z.boolean().default(false),
});

export type UpdateSuiviProspectFormData = z.infer<typeof updateSuiviProspectSchema>;

export interface ViewSuiviProspectData {
  Reference: string;
  Libelle: string;
  Relance: boolean;
  Utilisateur: string;
  Heure: string;
}

export interface SuiviProspect {
  Reference: string;
  Libelle: string;
  Relance: boolean;
  Utilisateur: string;
  Heure: string;
} 