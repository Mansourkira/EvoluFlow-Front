import { z } from "zod";

// Course Type Schema
export const courseTypeSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Priorite: z.number().optional().nullable(),
  Utilisateur: z.string().optional().nullable(),
  Heure: z.string().optional(),
  // User info (from JOIN)
  Nom_Prenom: z.string().optional(),
  E_mail: z.string().optional(),
  Profil: z.string().optional(),
  Site_Defaut: z.string().optional(),
  Type_Utilisateur: z.string().optional(),
  Adresse: z.string().optional(),
  Telephone: z.string().optional(),
  Ville: z.string().optional(),
  Gouvernorat: z.string().optional(),
  Pays: z.string().optional(),
  Image: z.string().optional(),
});

// Add Course Type Schema
export const addCourseTypeSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Priorite: z.number().min(0, "La priorité doit être positive").optional().nullable(),
  Utilisateur: z.string().optional().nullable(),
});

// Update Course Type Schema
export const updateCourseTypeSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire").optional(),
  Priorite: z.number().min(0, "La priorité doit être positive").optional().nullable(),
  Utilisateur: z.string().optional().nullable(),
});

// Types
export type CourseType = z.infer<typeof courseTypeSchema>;
export type AddCourseTypeFormData = z.infer<typeof addCourseTypeSchema>;
export type UpdateCourseTypeFormData = z.infer<typeof updateCourseTypeSchema>;

// Priority options for dropdowns
export const PriorityOptions = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
} as const;

export const PriorityLabels = {
  1: "Faible",
  2: "Moyenne", 
  3: "Élevée",
  4: "Urgente",
} as const;

// Utility functions
export const getPriorityLabel = (priority: number | null | undefined): string => {
  if (!priority) return "Non définie";
  return PriorityLabels[priority as keyof typeof PriorityLabels] || "Inconnue";
};

export const getPriorityColor = (priority: number | null | undefined): string => {
  switch (priority) {
    case 1: return "bg-green-100 text-green-800";
    case 2: return "bg-yellow-100 text-yellow-800";
    case 3: return "bg-orange-100 text-orange-800";
    case 4: return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}; 