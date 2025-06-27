import { z } from 'zod';

// Enum-like options for better type safety and reusability
export const SexeOptions = {
  HOMME: 'Homme',
  FEMME: 'Femme',
} as const;

export const EtatCivilOptions = {
  CELIBATAIRE: 'Célibataire',
  MARIE: 'Marié(e)',
  DIVORCE: 'Divorcé(e)',
  VEUF: 'Veuf(ve)',
} as const;

export const TypeUtilisateurOptions = {
  ADMIN: 'admin',
  DIRECTION: 'direction',
  CONSULTANT: 'consultant',
  FINANCIER: 'financier',
} as const;

export const addUserSchema = z.object({
  Reference: z.string().optional(), // Auto-generated, not required from user
  E_mail: z.string().min(1, 'Email est requis').email('Format email invalide').max(255, 'Email doit être inférieur à 255 caractères'),
  Nom_Prenom: z.string().min(1, 'Nom complet est requis').max(255, 'Nom doit être inférieur à 255 caractères'),
  Adresse: z.string().min(1, 'Adresse est requise').max(255, 'Adresse doit être inférieure à 255 caractères'),
  Complement_adresse: z.string().max(255, 'Complément d\'adresse doit être inférieur à 255 caractères').optional(),
  Code_Postal: z.string().min(1, 'Code postal est requis').max(30, 'Code postal doit être inférieur à 30 caractères'),
  Ville: z.string().min(1, 'Ville est requise').max(255, 'Ville doit être inférieure à 255 caractères'),
  Gouvernorat: z.string().min(1, 'Gouvernorat est requis').max(255, 'Gouvernorat doit être inférieur à 255 caractères'),
  Pays: z.string().min(1, 'Pays est requis').max(255, 'Pays doit être inférieur à 255 caractères'),
  Telephone: z.string().min(1, 'Numéro de téléphone est requis').max(255, 'Numéro de téléphone doit être inférieur à 255 caractères'),
  Type_Utilisateur: z.string().min(1, 'Type d\'utilisateur est requis'),
  Mot_de_passe: z.string().default('123456'), // Fixed password
  Site_Defaut: z.string().min(1, 'Site par défaut est requis').max(100, 'Site par défaut doit être inférieur à 100 caractères'),
  Profil: z.string().min(1, 'Profil est requis'),
  Image: z.string().nullable().optional(),
  Sexe: z.enum(['Homme', 'Femme']).optional(),
  Etat_Civil: z.enum(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)']).optional(),
  Reinitialisation_mot_de_passe: z.boolean().default(true), // Force password reset on first login
});

export type AddUserFormData = z.infer<typeof addUserSchema>;

// Update User Schema - most fields are optional for updates
export const updateUserSchema = z.object({
  Reference: z.string().optional(),
  E_mail: z.string().email('Format email invalide').optional(), // Email is the identifier, so it's always provided
  Nom_Prenom: z.string().min(1, 'Nom complet est requis').max(255, 'Nom doit être inférieur à 255 caractères').optional(),
  Adresse: z.string().max(255, 'Adresse doit être inférieure à 255 caractères').optional(),
  Complement_adresse: z.string().max(255, 'Complément d\'adresse doit être inférieur à 255 caractères').optional(),
  Code_Postal: z.string().max(30, 'Code postal doit être inférieur à 30 caractères').optional(),
  Ville: z.string().max(255, 'Ville doit être inférieure à 255 caractères').optional(),
  Gouvernorat: z.string().max(255, 'Gouvernorat doit être inférieur à 255 caractères').optional(),
  Pays: z.string().max(255, 'Pays doit être inférieur à 255 caractères').optional(),
  Telephone: z.string().max(255, 'Numéro de téléphone doit être inférieur à 255 caractères').optional(),
  Type_Utilisateur: z.string().optional(),
  Mot_de_passe: z.string().optional(), // Optional for updates - only update if provided
  Site_Defaut: z.string().max(100, 'Site par défaut doit être inférieur à 100 caractères').optional(),
  Profil: z.string().optional(), // Profile is optional for updates
  Image: z.string().nullable().optional(),
  Sexe: z.enum(['Homme', 'Femme']).optional(),
  Etat_Civil: z.enum(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)']).optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// View User Schema - for display purposes
export interface ViewUserData {
  Reference: string;
  E_mail: string;
  Nom_Prenom: string;
  Adresse: string;
  Complement_adresse?: string;
  Code_Postal: string;
  Ville: string;
  Gouvernorat: string;
  Pays: string;
  Telephone: string;
  Type_Utilisateur: string;
  Mot_de_passe: string;
  Site_Defaut: string;
  Profil: string;
  Profil_Libelle?: string;
  Heure?: string;
  Temp_Raffraichissement?: string;
  Couleur?: string;
  Image: string | null;
  Sexe?: 'Homme' | 'Femme';
  Etat_Civil?: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)';
}

// Profile Update Schema - for profile section
export const profileUpdateSchema = z.object({
  Nom_Prenom: z.string().min(1, 'Nom complet est requis').max(255, 'Nom doit être inférieur à 255 caractères'),
  E_mail: z.string().min(1, 'Email est requis').email('Format email invalide').max(255, 'Email doit être inférieur à 255 caractères'),
  Telephone: z.string().max(255, 'Numéro de téléphone doit être inférieur à 255 caractères').optional(),
  Adresse: z.string().max(255, 'Adresse doit être inférieure à 255 caractères').optional(),
  Complement_adresse: z.string().max(255, 'Complément d\'adresse doit être inférieur à 255 caractères').optional(),
  Code_Postal: z.string().max(30, 'Code postal doit être inférieur à 30 caractères').optional(),
  Ville: z.string().max(255, 'Ville doit être inférieure à 255 caractères').optional(),
  Gouvernorat: z.string().max(255, 'Gouvernorat doit être inférieur à 255 caractères').optional(),
  Pays: z.string().max(255, 'Pays doit être inférieur à 255 caractères').optional(),
  Couleur: z.string().optional(),
  Temp_Raffraichissement: z.string().optional(),
  Image: z.string().nullable().optional(),
  Etat_Civil: z.enum(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)']).optional(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// Utility functions for reusability
export const convertBase64ToDataUrl = (base64: string): string => {
  if (base64.startsWith('data:')) return base64;
  return `data:image/jpeg;base64,${base64}`;
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'L\'image ne doit pas dépasser 5MB.' };
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Format non supporté. Utilisez JPG, PNG ou GIF.' };
  }
  
  return { isValid: true };
}; 