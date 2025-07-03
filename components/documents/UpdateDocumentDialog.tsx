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
import { FileText, Loader2, Pencil } from "lucide-react";

interface UpdateDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  document: Document;
}

export function UpdateDocumentDialog({ open, onClose, document }: UpdateDocumentDialogProps) {
  const { updateDocument } = useDocuments();
  const { users } = useUsers();
  const [isLoading, setIsLoading] = useState(false);

  const matchedUser = users.find(u => u.Reference === document.Utilisateur);
  const fullName = matchedUser ? `${matchedUser.Nom_Prenom}` : "-";

  const form = useForm<Document>({
    resolver: zodResolver(updateDocumentSchema),
    defaultValues: document,
  });

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Reference", "Nom_Document", "Lieu_Extraction", "Observation", "Type", "Reference_Filiere"].map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof Document}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{name.replaceAll("_", " ")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={typeof field.value === "boolean" || field.value instanceof Date ? "" : field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {["Delai_Traitement", "Prix_Traitement", "Ordre"].map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof Document}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{name.replaceAll("_", " ")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={typeof field.value === "number" ? field.value : field.value === undefined || field.value === null ? "" : Number(field.value)}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormItem className="md:col-span-2">
                <FormLabel>Heure</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={document.Heure ? new Date(document.Heure).toISOString().slice(0, 16) : ""}
                    disabled
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Utilisateur</FormLabel>
                <FormControl>
                  <Input value={fullName} disabled />
                </FormControl>
              </FormItem>

              {["Obligatoire", "Necessaire_Examen", "Necessaire_Inscription"].map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof Document}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{name.replaceAll("_", " ")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

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
