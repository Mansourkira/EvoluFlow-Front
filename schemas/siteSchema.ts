import { z } from "zod";

// Site form schema based on backend Site entity
export const addSiteSchema = z.object({
  Reference: z.string().min(1, "La référence est requise"),
  Raison_Sociale: z.string().min(1, "La raison sociale est requise"),
  Adresse: z.string().optional(),
  Complement_adresse: z.string().optional(),
  Code_Postal: z.string().optional(),
  Ville: z.string().optional(),
  Gouvernorat: z.string().optional(),
  Pays: z.string().default("Tunisie"),
  Telephone: z.string().optional(),
  Fax: z.string().optional(),
  E_Mail_Commercial: z.string().email("Email commercial invalide").optional().or(z.literal("")),
  E_Mail_Marketing: z.string().email("Email marketing invalide").optional().or(z.literal("")),
  E_Mail_Administration: z.string().email("Email administration invalide").optional().or(z.literal("")),
  E_Mail_Financier: z.string().email("Email financier invalide").optional().or(z.literal("")),
  Site_Web: z.string().url("URL du site web invalide").optional().or(z.literal("")),
  Activite: z.string().optional(),
  Matricule_Fiscal: z.string().optional(),
  Capital: z.string().optional(),
  Sigle: z.string().optional(), // Base64 string for image
  Nombre_Max_Relance_Entretien: z.number().int().min(0).optional(),
  Nombre_Max_Relance_Inscription: z.number().int().min(0).optional(),
  Nombre_Max_Relance_Preparation: z.number().int().min(0).optional(),
  Nombre_Max_Relance_Propect: z.number().int().min(0).optional(),
});

export const updateSiteSchema = addSiteSchema.partial().extend({
  Reference: z.string().min(1, "La référence est requise"),
});

export type AddSiteFormData = z.infer<typeof addSiteSchema>;
export type UpdateSiteFormData = z.infer<typeof updateSiteSchema>;

// View site data interface
export interface ViewSiteData {
  Reference: string;
  Raison_Sociale: string;
  Adresse?: string;
  Complement_adresse?: string;
  Code_Postal?: string;
  Ville?: string;
  Gouvernorat?: string;
  Pays?: string;
  Telephone?: string;
  Fax?: string;
  E_Mail_Commercial?: string;
  E_Mail_Marketing?: string;
  E_Mail_Administration?: string;
  E_Mail_Financier?: string;
  Site_Web?: string;
  Activite?: string;
  Matricule_Fiscal?: string;
  Capital?: string;
  Sigle?: string;
  Nombre_Max_Relance_Entretien?: number;
  Nombre_Max_Relance_Inscription?: number;
  Nombre_Max_Relance_Preparation?: number;
  Nombre_Max_Relance_Propect?: number;
  Utilisateur?: string;
  Heure?: string;
} 