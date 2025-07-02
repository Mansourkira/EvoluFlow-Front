import { z } from "zod";

// Course Type Schema
export const courseTypeSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Libelle: z.string().min(1, "Le libellé est obligatoire"),
  Priorite: z.number().min(0, "La priorité doit être positive").optional().nullable(),
  Utilisateur: z.string().optional().nullable(), // User who created the record
  Heure: z.string().optional().nullable(), // Creation date from backend
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

// Priority icons mapping
export const PriorityIcons = {
  1: "ArrowDown",
  2: "Minus",
  3: "ArrowUp",
  4: "AlertTriangle",
} as const;

// Utility functions
export const getPriorityLabel = (priority: number | null | undefined): string => {
  if (!priority) return "Non définie";
  return PriorityLabels[priority as keyof typeof PriorityLabels] || "Inconnue";
};

export const getPriorityColor = (priority: number | null | undefined): string => {
  switch (priority) {
    case 1: return "bg-green-100 text-green-800 border-green-200";
    case 2: return "bg-blue-100 text-blue-800 border-blue-200";
    case 3: return "bg-orange-100 text-orange-800 border-orange-200";
    case 4: return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getPriorityBadgeVariant = (priority: number | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
  switch (priority) {
    case 1: return "outline";
    case 2: return "secondary";
    case 3: return "default";
    case 4: return "destructive";
    default: return "outline";
  }
};

export const getPriorityIcon = (priority: number | null | undefined): string => {
  if (!priority) return "HelpCircle";
  return PriorityIcons[priority as keyof typeof PriorityIcons] || "HelpCircle";
};

export const getPrioritySortValue = (priority: number | null | undefined): number => {
  return priority || 0;
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