import { z } from 'zod';

export const addUserSchema = z.object({
  Reference: z.string().optional(), // Auto-generated, not required from user
  E_mail: z.string().min(1, 'Email is required').email('Invalid email format').max(255, 'Email must be less than 255 characters'),
  Nom_Prenom: z.string().min(1, 'Full name is required').max(255, 'Name must be less than 255 characters'),
  Adresse: z.string().min(1, 'Address is required').max(255, 'Address must be less than 255 characters'),
  Code_Postal: z.string().min(1, 'Postal code is required').max(30, 'Postal code must be less than 30 characters'),
  Ville: z.string().min(1, 'City is required').max(255, 'City must be less than 255 characters'),
  Gouvernorat: z.string().min(1, 'Governorate is required').max(255, 'Governorate must be less than 255 characters'),
  Pays: z.string().min(1, 'Country is required').max(255, 'Country must be less than 255 characters'),
  Telephone: z.string().min(1, 'Phone number is required').max(255, 'Phone number must be less than 255 characters'),
  Type_Utilisateur: z.string().min(1, 'User type is required'),
  Mot_de_passe: z.string().default('123456'), // Fixed password
  Site_Defaut: z.string().min(1, 'Default site is required').max(100, 'Default site must be less than 100 characters'),
  Profil: z.string().min(1, 'Profile is required'),
  Image: z.string().nullable().optional(),
});

export type AddUserFormData = z.infer<typeof addUserSchema>;

// Update User Schema - most fields are optional for updates
export const updateUserSchema = z.object({
  Reference: z.string().optional(),
  E_mail: z.string().email('Invalid email format').optional(), // Email is the identifier, so it's always provided
  Nom_Prenom: z.string().min(1, 'Full name is required').max(255, 'Name must be less than 255 characters').optional(),
  Adresse: z.string().max(255, 'Address must be less than 255 characters').optional(),
  Complement_adresse: z.string().max(255, 'Complement address must be less than 255 characters').optional(),
  Code_Postal: z.string().max(30, 'Postal code must be less than 30 characters').optional(),
  Ville: z.string().max(255, 'City must be less than 255 characters').optional(),
  Gouvernorat: z.string().max(255, 'Governorate must be less than 255 characters').optional(),
  Pays: z.string().max(255, 'Country must be less than 255 characters').optional(),
  Telephone: z.string().max(255, 'Phone number must be less than 255 characters').optional(),
  Type_Utilisateur: z.string().optional(),
  Mot_de_passe: z.string().optional(), // Optional for updates - only update if provided
  Site_Defaut: z.string().max(100, 'Default site must be less than 100 characters').optional(),
  Profil: z.string().optional(), // Profile is optional for updates
  Image: z.string().nullable().optional(),
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
} 