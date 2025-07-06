"use client";

import { useEffect } from "react";
import { Plus, Loader2, Shuffle, Hash, StickyNote } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { AddNiveauEtudeFormData, addNiveauEtudeSchema } from "@/schemas/niveauEtudeSchema";
import { useNiveauxEtude } from "@/hooks/useNiveauxEtude";

interface AddNiveauEtudeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddNiveauEtudeFormData) => Promise<void>;
}

export function AddNiveauEtudeDialog({ open, onClose, onSubmit }: AddNiveauEtudeDialogProps) {
  const { niveaux } = useNiveauxEtude();
  const { toast } = useToast();

  const form = useForm<AddNiveauEtudeFormData>({
    resolver: zodResolver(addNiveauEtudeSchema),
    defaultValues: { Reference: "", Libelle: "" },
  });

  const { handleSubmit, reset, control, setValue, getValues, formState } = form;

  const generateReference = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const prefix = `NE${year}${month}`;
    const existing = niveaux.map(n => n.Reference).filter(r => r.startsWith(prefix));
    let i = 1;
    let ref = `${prefix}${i.toString().padStart(3,'0')}`;
    while (existing.includes(ref)) {
      i++;
      ref = `${prefix}${i.toString().padStart(3,'0')}`;
    }
    setValue("Reference", ref);
    toast({ title: "Référence générée", description: ref });
  };

  useEffect(() => {
    if (open && !getValues('Reference')) generateReference();
  }, [open]);

  const onCloseDialog = () => {
    reset();
    onClose();
  };

  const onSubmitForm = async (data: AddNiveauEtudeFormData) => {
    await onSubmit(data);
    onCloseDialog();
  };

  return (
    <Dialog open={open} onOpenChange={state => !state && onCloseDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un niveau d’étude</DialogTitle>
          <DialogDescription>Remplissez les champs requis.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="ne-reference">Référence</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <Input id="ne-reference" {...field} />
                      <Button type="button" size="icon" variant="outline" onClick={generateReference}>
                        <Shuffle className="w-4 h-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="ne-libelle">Libellé</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-gray-500" />
                      <Input id="ne-libelle" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCloseDialog} disabled={formState.isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? <><Loader2 className="animate-spin w-4 h-4 mr-2"/>Ajout... </> : <><Plus className="w-4 h-4 mr-2"/>Ajouter</>}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
export default AddNiveauEtudeDialog;