// Fichier : schemas/documentShema.ts
import { z } from "zod";

// ✅ Schéma principal Document (lié à la base de données)
export const documentSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Nom_Document: z.string().min(1, "Le nom du document est obligatoire"),
  Lieu_Extraction: z.string().optional().nullable(),
  Observation: z.string().optional().nullable(),
  Obligatoire: z.boolean().optional().nullable(),
  Necessaire_Examen: z.boolean().optional().nullable(),
  Necessaire_Inscription: z.boolean().optional().nullable(),
  Delai_Traitement: z.number().optional().nullable(),
  Prix_Traitement: z.number().optional().nullable(),
  Ordre: z.number().optional().nullable(),
  Type: z.string().optional().nullable(),
  Reference_Filiere: z.string().optional().nullable(),
  Utilisateur: z.string().optional().nullable(),
  Heure: z.date().optional().nullable(),
});

// ✅ Type TypeScript du document
export type Document = z.infer<typeof documentSchema>;

// ✅ Formatage prix
export const formatPrice = (price?: number | null): string => {
  if (price == null) return "-";
  return `${price.toFixed(2)} DT`;
};

// ✅ Formatage délai
export const formatDelay = (days?: number | null): string => {
  if (!days) return "-";
  return `${days} jours`;
};

// ✅ Schéma formulaire ajout
export const addDocumentSchema = z.object({
  Reference: z.string().min(1, "La référence est obligatoire"),
  Nom_Document: z.string().min(1, "Le nom du document est obligatoire"),
  Lieu_Extraction: z.string().optional(),
  Observation: z.string().optional(),
  Obligatoire: z.boolean().optional(),
  Necessaire_Examen: z.boolean().optional(),
  Necessaire_Inscription: z.boolean().optional(),
  Delai_Traitement: z.number().optional(),
  Prix_Traitement: z.number().optional(),
  Ordre: z.number().optional(),
  Type: z.string().optional(),
  Reference_Filiere: z.string().optional(),
});

// ✅ Schéma formulaire modification
export const updateDocumentSchema = addDocumentSchema.partial();

// ✅ Types associés
export type AddDocumentFormData = z.infer<typeof addDocumentSchema>;
export type UpdateDocumentFormData = z.infer<typeof updateDocumentSchema>;
