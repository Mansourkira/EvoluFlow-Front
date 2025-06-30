"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDocumentSchema, AddDocumentFormData } from "@/schemas/documentShema";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface AddDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddDocumentFormData) => Promise<void>;
}

export default function AddDocumentDialog({ open, onClose, onSubmit }: AddDocumentDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDocumentFormData>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: {
      Reference: "",
      Nom_Document: "",
      Lieu_Extraction: "",
      Observation: "",
      Obligatoire: false,
      Necessaire_Examen: false,
      Delai_Traitement: 0,
      Prix_Traitement: 0,
      Ordre: 0,
      Type: "",
      Reference_Filiere: "",
    },
  });

  const onSubmitForm = async (data: AddDocumentFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <Controller
            name="Reference"
            control={control}
            render={({ field }) => (
              <Input {...field} value={field.value ?? ""} placeholder="Référence" />
            )}
          />
          <Controller
            name="Nom_Document"
            control={control}
            render={({ field }) => (
              <Input {...field} value={field.value ?? ""} placeholder="Nom du document" />
            )}
          />
          <Controller
            name="Lieu_Extraction"
            control={control}
            render={({ field }) => (
              <Input {...field} value={field.value ?? ""} placeholder="Lieu d'extraction" />
            )}
          />
          <Controller
            name="Observation"
            control={control}
            render={({ field }) => (
              <Textarea {...field} value={field.value ?? ""} placeholder="Observation" />
            )}
          />
          <Controller
            name="Obligatoire"
            control={control}
            render={({ field }) => (
              <label className="flex items-center space-x-2">
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                <span>Document obligatoire</span>
              </label>
            )}
          />
          <Controller
            name="Necessaire_Examen"
            control={control}
            render={({ field }) => (
              <label className="flex items-center space-x-2">
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                <span>Nécessaire pour l'examen</span>
              </label>
            )}
          />
          <Controller
            name="Delai_Traitement"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
                type="number"
                placeholder="Délai de traitement (jours)"
              />
            )}
          />
          <Controller
            name="Prix_Traitement"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
                type="number"
                placeholder="Prix de traitement"
              />
            )}
          />
          <Controller
            name="Ordre"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
                type="number"
                placeholder="Ordre"
              />
            )}
          />
          <Controller
            name="Type"
            control={control}
            render={({ field }) => (
              <Input {...field} value={field.value ?? ""} placeholder="Type" />
            )}
          />
          <Controller
            name="Reference_Filiere"
            control={control}
            render={({ field }) => (
              <Input {...field} value={field.value ?? ""} placeholder="Référence filière" />
            )}
          />
          <Button type="submit" className="w-full">
            Ajouter
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
