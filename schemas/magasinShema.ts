import { z } from "zod";

export const magasinSchema = z.object({
  Reference: z.string().min(1, "La référence est requise"),
  Libelle: z.string().min(1, "Le libellé est requis"),
  Stock_Negatif: z.union([z.literal(0), z.literal(1)]),
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

export type Magasin = z.infer<typeof magasinSchema>;
export type AddMagasinFormData = z.infer<typeof magasinSchema>;
