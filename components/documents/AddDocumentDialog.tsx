"use client";

import { useState, useEffect } from "react";
import { Loader2, FilePlus, Plus, Hash, StickyNote, BookOpen, MapPin, Info, Clock, DollarSign, Layers, CheckCircle, Shuffle } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";

interface AddDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddDocumentFormData) => Promise<void>;
}

export default function AddDocumentDialog({ open, onClose, onSubmit }: AddDocumentDialogProps) {
  const { documents } = useDocuments();
  const { toast } = useToast();

  const form = useForm<AddDocumentFormData>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: {
      Reference: "",
      Nom_Document: "",
      Type: "",
      Lieu_Extraction: "",
      Observation: "",
      Delai_Traitement: undefined,
      Prix_Traitement: undefined,
      Ordre: undefined,
      Reference_Filiere: "",
      Obligatoire: false,
      Necessaire_Examen: false,
      Necessaire_Inscription: false,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
    setValue,
    getValues
  } = form;

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const existingRefs = documents.map(d => d.Reference).filter(ref => ref.startsWith(`DOC${year}${month}`));

    let counter = 1;
    let newRef = `DOC${year}${month}${counter.toString().padStart(3, '0')}`;

    while (existingRefs.includes(newRef)) {
      counter++;
      newRef = `DOC${year}${month}${counter.toString().padStart(3, '0')}`;
    }

    setValue('Reference', newRef);
    toast({
      title: "✅ Référence générée",
      description: `Nouvelle référence: ${newRef}`,
    });
  };

  useEffect(() => {
    if (!getValues('Reference')) {
      generateReference();
    }
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: AddDocumentFormData) => {
    await onSubmit(data);
    handleClose();
  };

  const iconMap: Record<string, React.ReactNode> = {
    Reference: <Hash className="h-4 w-4 text-gray-500" />,
    Nom_Document: <StickyNote className="h-4 w-4 text-gray-500" />,
    Type: <BookOpen className="h-4 w-4 text-gray-500" />,
    Lieu_Extraction: <MapPin className="h-4 w-4 text-gray-500" />,
    Observation: <Info className="h-4 w-4 text-gray-500" />,
    Delai_Traitement: <Clock className="h-4 w-4 text-gray-500" />,
    Prix_Traitement: <DollarSign className="h-4 w-4 text-gray-500" />,
    Ordre: <Layers className="h-4 w-4 text-gray-500" />,
    Reference_Filiere: <Hash className="h-4 w-4 text-gray-500" />,
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
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* 🧾 Informations Générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FilePlus className="h-5 w-5" /> Informations Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Reference", "Nom_Document", "Type", "Reference_Filiere", "Observation"].map((name) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name as keyof AddDocumentFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{name.replaceAll("_", " ")}</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            {iconMap[name]}
                            <Input
                              {...field}
                              type="text"
                              value={typeof field.value === "boolean" ? "" : field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            {name === "Reference" && (
                              <Button type="button" size="icon" variant="outline" onClick={generateReference}>
                                <Shuffle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            {/* 🧭 Traitement & Lieu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" /> Traitement & Lieu
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Lieu_Extraction", "Delai_Traitement", "Prix_Traitement", "Ordre"].map((name) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name as keyof AddDocumentFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{name.replaceAll("_", " ")}</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            {iconMap[name]}
                            <Input
                              type={["Delai_Traitement", "Prix_Traitement", "Ordre"].includes(name) ? "number" : "text"}
                              value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                              onChange={(e) =>
                                field.onChange(
                                  ["Delai_Traitement", "Prix_Traitement", "Ordre"].includes(name)
                                    ? e.target.value === "" ? undefined : Number(e.target.value)
                                    : e.target.value
                                )
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            {/* ✅ Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5" /> Options
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ name: "Obligatoire", label: "Obligatoire" }, { name: "Necessaire_Examen", label: "Nécessaire pour examen" }, { name: "Necessaire_Inscription", label: "Nécessaire pour inscription" }].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name as keyof AddDocumentFormData}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox checked={!!field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
                        </FormControl>
                        <FormLabel>{label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

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
