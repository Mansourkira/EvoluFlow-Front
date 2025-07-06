"use client";

import { useEffect } from "react";
import { Shuffle, Plus, Loader2, Hash, StickyNote } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSourceContacts } from "@/hooks/useSourceContacts";
import {
  addSourceContactSchema,
  AddSourceContactFormData,
} from "@/schemas/sourceContactSchema";

interface AddSourceContactDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddSourceContactFormData) => Promise<void>;
}

export default function AddSourceContactDialog({
  open,
  onClose,
  onSubmit,
}: AddSourceContactDialogProps) {
  const { sources } = useSourceContacts();
  const { toast } = useToast();

  const form = useForm<AddSourceContactFormData>({
    resolver: zodResolver(addSourceContactSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState,
  } = form;

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const prefix = `SC${year}${month}`;
    const existing = sources
      .map((s) => s.Reference)
      .filter((ref) => ref.startsWith(prefix));
    let counter = 1;
    let newRef = `${prefix}${String(counter).padStart(3, "0")}`;
    while (existing.includes(newRef)) {
      counter++;
      newRef = `${prefix}${String(counter).padStart(3, "0")}`;
    }
    setValue("Reference", newRef);
    toast({ title: "Référence générée", description: newRef });
  };

  useEffect(() => {
    if (open && !getValues("Reference")) {
      generateReference();
    }
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmitForm = async (data: AddSourceContactFormData) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une source de contact</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="space-y-4"
          >
            {/* Référence */}
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reference">Référence</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <Input
                        id="reference"
                        {...field}
                        value={field.value || ""}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={generateReference}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Libellé */}
            <FormField
              control={control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="libelle">Libellé</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <StickyNote className="h-4 w-4 text-gray-500" />
                      <Input
                        id="libelle"
                        {...field}
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={formState.isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={formState.isSubmitting}
              >
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ajout...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
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
