import { z } from 'zod'

// 🔍 Schéma de validation pour la situation
export const situationSchema = z.object({
  Reference: z.string()
    .min(1, 'La référence est requise')
    .max(50, 'La référence ne peut pas dépasser 50 caractères'),
  Libelle: z.string()
    .min(1, 'Le libellé est requis')
    .max(255, 'Le libellé ne peut pas dépasser 255 caractères'),
  
})

export type SituationFormData = z.infer<typeof situationSchema> 