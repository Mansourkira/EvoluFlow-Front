
"use client";

import { useState } from "react";
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
import { Document, updateDocumentSchema } from "@/schemas/documentShema";
import { useDocuments } from "@/hooks/useDocuments";
import { useUsers } from "@/hooks/useUsers";
import {
  FileText,
  Loader2,
  Pencil,
  Hash,
  StickyNote,
  BookOpen,
  Layers,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  User,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UpdateDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  document: Document;
}

export function UpdateDocumentDialog({ open, onClose, document }: UpdateDocumentDialogProps) {
  const { updateDocument } = useDocuments();
  const { users } = useUsers();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Document>({
    resolver: zodResolver(updateDocumentSchema),
    defaultValues: document,
  });

  const matchedUser = users.find(u => u.Reference === document.Utilisateur);
  const fullName = matchedUser ? `${matchedUser.Nom_Prenom} ` : "-";

  const onSubmit = async (data: Document) => {
    setIsLoading(true);
    try {
      await updateDocument(data);
      onClose();
    } catch (error) {
      console.error("Erreur mise à jour document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Modifier un document
          </DialogTitle>
          <DialogDescription>
            Modifiez les champs nécessaires pour mettre à jour ce document.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 🧾 Informations Générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" /> Informations Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Reference", "Nom_Document", "Type", "Reference_Filiere", "Observation", "Ordre"].map((name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof Document}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{name.replaceAll("_", " ")}</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              {...field}
                              type={["Ordre"].includes(name) ? "number" : "text"}
                              disabled={name === "Reference"}
                              value={
                                typeof field.value === "boolean" || field.value instanceof Date
                                  ? ""
                                  : field.value ?? ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  ["Ordre"].includes(name)
                                    ? e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value)
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

            {/* 🧭 Traitement & Lieu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" /> Traitement & Lieu
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Lieu_Extraction", "Delai_Traitement", "Prix_Traitement"].map((name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof Document}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{name.replaceAll("_", " ")}</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              {...field}
                              type={["Delai_Traitement", "Prix_Traitement"].includes(name) ? "number" : "text"}
                              value={
                                field.value !== undefined && field.value !== null
                                  ? String(field.value)
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  ["Delai_Traitement", "Prix_Traitement"].includes(name)
                                    ? e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value)
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
                {["Obligatoire", "Necessaire_Examen", "Necessaire_Inscription"].map((name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof Document}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(checked) => field.onChange(!!checked)}
                          />
                        </FormControl>
                        <FormLabel>{name.replaceAll("_", " ")}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            {/* 🔒 Sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" /> Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" /> Utilisateur
                  </FormLabel>
                  <Input value={fullName} disabled />
                </FormItem>

                <FormField
                  control={form.control}
                  name="Heure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" /> Heure
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Mise à jour...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" /> Mettre à jour
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