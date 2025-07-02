"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  addDocumentSchema,
  AddDocumentFormData,
} from "@/schemas/documentShema";
import { Plus, Loader2, FilePlus } from "lucide-react";

interface AddDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddDocumentFormData) => Promise<void>;
}

export default function AddDocumentDialog({
  open,
  onClose,
  onSubmit,
}: AddDocumentDialogProps) {
  const form = useForm<AddDocumentFormData>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: {
      Reference: "",
      Nom_Document: "",
      Type: "",
      Obligatoire: false,
      Lieu_Extraction: "",
      Observation: "",
      Delai_Traitement: undefined,
      Prix_Traitement: undefined,
      Ordre: undefined,
      Reference_Filiere: "",
      Necessaire_Examen: false,
      Necessaire_Inscription: false,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: AddDocumentFormData) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(state) => !state && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePlus className="h-5 w-5" /> Nouveau Document
          </DialogTitle>
          <DialogDescription>
            Remplissez les champs pour ajouter un document.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Reference", label: "Référence" },
                { name: "Nom_Document", label: "Nom du Document" },
                { name: "Type", label: "Type" },
                { name: "Lieu_Extraction", label: "Lieu d'Extraction" },
                { name: "Observation", label: "Observation" },
                { name: "Delai_Traitement", label: "Délai de Traitement", type: "number" },
                { name: "Prix_Traitement", label: "Prix de Traitement", type: "number" },
                { name: "Ordre", label: "Ordre", type: "number" },
                { name: "Reference_Filiere", label: "Référence Filière" },
              ].map(({ name, label, type }) => (
                <FormField
                  key={name}
                  control={control}
                  name={name as keyof AddDocumentFormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={type || "text"}
                          value={
                            typeof field.value === "boolean"
                              ? ""
                              : field.value !== undefined
                              ? String(field.value)
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              type === "number"
                                ? e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                                : e.target.value
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {[
              { name: "Obligatoire", label: "Obligatoire" },
              { name: "Necessaire_Examen", label: "Nécessaire pour examen" },
              { name: "Necessaire_Inscription", label: "Nécessaire pour inscription" },
            ].map(({ name, label }) => (
              <FormField
                key={name}
                control={control}
                name={name as keyof AddDocumentFormData}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    </FormControl>
                    <FormLabel>{label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enregistrement...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
