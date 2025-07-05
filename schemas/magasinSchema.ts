import { z } from "zod";

export const addMagasinSchema = z.object({
  Reference: z.string().min(1, "Référence requise"),
  Libelle: z.string().min(1, "Libellé requis"),
  Stock_Negatif: z.union([z.literal(0), z.literal(1)]),
});

export const updateMagasinSchema = addMagasinSchema.extend({
  Utilisateur: z.string().optional(),
  Heure: z.string().optional(),
});

export type AddMagasinFormData = z.infer<typeof addMagasinSchema>;
export type Magasin = z.infer<typeof updateMagasinSchema>;
