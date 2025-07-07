import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { addAvisProspectSchema, type AddAvisProspectFormData } from "@/schemas/avisProspectSchema";
import { RefreshCw } from "lucide-react";
import { useAvisProspect } from "@/hooks/useAvisProspect";

interface AddAvisProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAvisProspectAdded: () => void;
}

export function AddAvisProspectDialog({
  open,
  onOpenChange,
  onAvisProspectAdded,
}: AddAvisProspectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAvisProspect } = useAvisProspect();

  const form = useForm<AddAvisProspectFormData>({
    resolver: zodResolver(addAvisProspectSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
    },
  });

        const onSubmit = async (data: AddAvisProspectFormData) => {
    setIsSubmitting(true);
    try {
      const success = await addAvisProspect(data);
      if (success) {
        form.reset();
        onOpenChange(false);
        onAvisProspectAdded();
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un Avis Prospect</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Créez un nouveau Avis Prospect en remplissant les champs ci-dessous.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
              control={form.control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence *</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ex: AVIS001" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const timestamp = Date.now().toString().slice(-6);
                          const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
                            const generatedReference = `AVIS${timestamp}${randomSuffix}`;
                          field.onChange(generatedReference);
                        }}
                              disabled={isSubmitting}
                        title="Générer une référence automatique"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le libellé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Ajout en cours..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 