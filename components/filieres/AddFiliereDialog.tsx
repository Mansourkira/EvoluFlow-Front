"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddFiliereFormData, addFiliereSchema } from "@/schemas/filiereSchema";
import { useFilieres } from "@/hooks/useFilieres";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Loader2,
  GraduationCap,
  RefreshCw,
  Shuffle,
} from "lucide-react";

interface AddFiliereDialogProps {
  trigger?: React.ReactNode;
  onFiliereAdded?: () => void;
}

export function AddFiliereDialog({
  trigger,
  onFiliereAdded,
}: AddFiliereDialogProps) {
  const [open, setOpen] = useState(false);
  const { filieres, refetch, addFiliere, isLoading } = useFilieres();
  const { toast } = useToast();

  const form = useForm<AddFiliereFormData>({
    resolver: zodResolver(addFiliereSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Description: "",
      Delai_Max_Traitement_Dossier: undefined,
      Prix_Traitement_Dossier: undefined,
      Heure: undefined,
    },
  });

  // Génère et set une référence unique
  const generateReference = async () => {
    // on refait d'abord un fetch pour avoir la liste à jour
    await refetch();
    const yy = new Date().getFullYear().toString().slice(-2);
    const mm = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const prefix = `FIL${yy}${mm}`;

    const existing = filieres
      .map((f) => f.Reference)
      .filter((r) => r.startsWith(prefix));

    let counter = 1;
    let newRef = `${prefix}${counter.toString().padStart(3, "0")}`;
    while (existing.includes(newRef)) {
      counter++;
      newRef = `${prefix}${counter.toString().padStart(3, "0")}`;
    }

    form.setValue("Reference", newRef);
    toast({ title: "✅ Référence générée", description: newRef });
  };

  const onSubmit = async (data: AddFiliereFormData) => {
    const ok = await addFiliere(data);
    if (ok) {
      toast({
        title: "✅ Filière ajoutée",
        description: data.Libelle,
      });
      form.reset();
      setOpen(false);
      onFiliereAdded?.();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // A chaque ouverture, on régénère quoi qu'il arrive
      generateReference();
    } else {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-[#3A90DA] hover:bg-[#2A7BC8] text-white flex items-center gap-2">
            <Plus className="h-4 w-4" /> Ajouter une filière
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#3A90DA]" />
            Nouvelle filière
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <Form<AddFiliereFormData> {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Référence */}
              <FormField
                control={form.control}
                name="Reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence *</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateReference}
                        disabled={isLoading}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Libellé */}
              <FormField
                control={form.control}
                name="Libelle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isLoading} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Délai max & Prix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="Delai_Max_Traitement_Dossier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Délai max (jours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number(e.target.value)
                              : undefined
                          )
                        }
                        value={field.value ?? ""}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Prix_Traitement_Dossier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix de traitement</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number(e.target.value)
                              : undefined
                          )
                        }
                        value={field.value ?? ""}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  generateReference();
                }}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button
                type="submit"
                className="bg-[#3A90DA] hover:bg-[#2A7BC8]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Ajouter"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
