// components/filieres/UpdateFiliereDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateFiliereFormData,
  updateFiliereSchema,
} from "@/schemas/filiereSchema";
import { useFilieres } from "@/hooks/useFilieres";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, GraduationCap } from "lucide-react";

interface UpdateFiliereDialogProps {
  reference: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateFiliereDialog({
  reference,
  open,
  onOpenChange,
}: UpdateFiliereDialogProps) {
  const { getFiliereByReference, updateFiliere, isLoading: isSaving } =
    useFilieres();
  const { toast } = useToast();
  const [isFetching, setIsFetching] = useState(false);

  const form = useForm<UpdateFiliereFormData>({
    resolver: zodResolver(updateFiliereSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Description: "",
      Delai_Max_Traitement_Dossier: undefined,
      Prix_Traitement_Dossier: undefined,
      Heure: undefined,
    },
  });
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (!open) return;
    setIsFetching(true);

    getFiliereByReference(reference)
      .then((f) => {
        if (!f) {
          toast({
            title: "❌ Introuvable",
            description: "Cette filière n'existe pas.",
            variant: "destructive",
          });
          onOpenChange(false);
          return;
        }

        // ==== Conversion safe en number ====
        const asString = String(f.Delai_Max_Traitement_Dossier ?? "").trim();
        const parsedDelai = asString === "" ? undefined : Number(asString);

        const asStringPrix = String(f.Prix_Traitement_Dossier ?? "").trim();
        const parsedPrix = asStringPrix === "" ? undefined : Number(asStringPrix);

        reset({
          Reference: f.Reference,
          Libelle: f.Libelle,
          Description: f.Description ?? "",
          Delai_Max_Traitement_Dossier: parsedDelai,
          Prix_Traitement_Dossier: parsedPrix,
          // Heure: f.Heure ? new Date(f.Heure) : undefined,
        });
      })
      .catch(() =>
        toast({
          title: "❌ Erreur serveur",
          description: "Impossible de charger la filière",
          variant: "destructive",
        })
      )
      .finally(() => setIsFetching(false));
  }, [open, reference, getFiliereByReference, reset, toast, onOpenChange]);

  const onSubmit = async (data: UpdateFiliereFormData) => {
    const success = await updateFiliere(data);
    if (success) {
      toast({ title: "✅ Succès", description: "Filière mise à jour" });
      onOpenChange(false);
    } else {
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier la filière",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby="update-filiere-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#3A90DA]" />
            Modifier la filière
          </DialogTitle>
          <DialogDescription id="update-filiere-description">
            Vous pouvez mettre à jour les champs ci-dessous.
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-[#3A90DA]" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Référence */}
              <FormField
                control={control}
                name="Reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-gray-100" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Libellé */}
              <FormField
                control={control}
                name="Libelle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={control}
                name="Description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isSaving} className="min-h-[80px]" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Délai max & Prix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="Delai_Max_Traitement_Dossier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Délai max (jours)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value == null ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          disabled={isSaving}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="Prix_Traitement_Dossier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix de traitement</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value == null ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          disabled={isSaving}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSaving}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-[#3A90DA] hover:bg-[#2A7BC8]">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Modifier
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
