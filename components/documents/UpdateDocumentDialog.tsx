"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Document, updateDocumentSchema } from "@/schemas/documentShema";
import { useDocuments } from "@/hooks/useDocuments";

interface UpdateDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  document: Document;
}

export default function UpdateDocumentDialog({
  open,
  onClose,
  document,
}: UpdateDocumentDialogProps) {
  const { updateDocument } = useDocuments();

  const { control, handleSubmit } = useForm<Document>({
    defaultValues: {
      ...document,
      Delai_Traitement: document.Delai_Traitement ?? 0,
      Prix_Traitement: document.Prix_Traitement ?? 0,
      Ordre: document.Ordre ?? 0,
    },
    resolver: zodResolver(updateDocumentSchema),
  });

  const onSubmit = async (data: Document) => {
    await updateDocument(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center gap-2">
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                <label>Obligatoire</label>
              </div>
            )}
          />
          <Controller
            name="Necessaire_Examen"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                <label>Nécessaire pour examen</label>
              </div>
            )}
          />
          <Controller
            name="Necessaire_Inscription"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                <label>Nécessaire pour inscription</label>
              </div>
            )}
          />
          <Controller
            name="Delai_Traitement"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
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
                type="number"
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
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
                type="number"
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
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
          <Button type="submit">Enregistrer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
