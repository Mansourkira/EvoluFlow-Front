import { z } from 'zod';

export const addUserSchema = z.object({
  reference: z.string().min(1, 'Reference is required').max(50, 'Reference must be less than 50 characters'),
  nom: z.string().min(1, 'Last name is required').max(255, 'Name must be less than 255 characters'),
  prenom: z.string().min(1, 'First name is required').max(255, 'Name must be less than 255 characters'),
  adresse: z.string().min(1, 'Address is required').max(255, 'Address must be less than 255 characters'),
  complement_adresse: z.string().max(255, 'Address complement must be less than 255 characters').optional(),
  code_postal: z.string().min(1, 'Postal code is required').max(30, 'Postal code must be less than 30 characters'),
  ville: z.string().min(1, 'City is required').max(255, 'City must be less than 255 characters'),
  gouvernorat: z.string().min(1, 'Governorate is required').max(255, 'Governorate must be less than 255 characters'),
  pays: z.string().min(1, 'Country is required').max(255, 'Country must be less than 255 characters'),
  telephone: z.string().min(1, 'Phone number is required').max(255, 'Phone number must be less than 255 characters'),
  type_utilisateur: z.string().min(1, 'User type is required').max(255, 'User type must be less than 255 characters'),
  e_mail: z.string().min(1, 'Email is required').email('Invalid email format').max(255, 'Email must be less than 255 characters'),
  mot_de_passe: z.string().min(6, 'Password must be at least 6 characters').max(255, 'Password must be less than 255 characters'),
  site_defaut: z.string().min(1, 'Default site is required').max(50, 'Default site must be less than 50 characters'),
  profil: z.string().min(1, 'Profile is required').max(2, 'Profile must be less than 2 characters'),
  image: z.instanceof(File).optional().nullable(),
});

export type AddUserFormData = z.infer<typeof addUserSchema>; 