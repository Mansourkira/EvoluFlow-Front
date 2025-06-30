import { z } from "zod";

// Course Type Schema
export const courseTypeSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Priorite: z.number().min(0, "La priorité doit être positive").optional().nullable(),
});

// Add Course Type Schema
export const addCourseTypeSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Priorite: z.number().min(0, "La priorité doit être positive").optional().nullable(),
});

// Update Course Type Schema
export const updateCourseTypeSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire").optional(),
  Priorite: z.number().min(0, "La priorité doit être positive").optional().nullable(),
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