import { useEffect, useState } from "react";
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
import { updateAvisProspectSchema, type UpdateAvisProspectFormData } from "@/schemas/avisProspectSchema";
import { useAvisProspect } from "@/hooks/useAvisProspect";

interface UpdateAvisProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avisProspectData: UpdateAvisProspectFormData | null;
  onAvisProspectUpdated?: () => void;
}

export function UpdateAvisProspectDialog({
  open,
  onOpenChange,
  avisProspectData,
  onAvisProspectUpdated,
}: UpdateAvisProspectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateAvisProspect } = useAvisProspect();

  const form = useForm<UpdateAvisProspectFormData>({
    resolver: zodResolver(updateAvisProspectSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
    },
  });

  useEffect(() => {
    if (avisProspectData) {
      form.reset(avisProspectData);
    }
  }, [form, avisProspectData]);

  const onSubmit = async (data: UpdateAvisProspectFormData) => {
    setIsSubmitting(true);
    try {
      const success = await updateAvisProspect(data);
      if (success) {
        onOpenChange(false);
        onAvisProspectUpdated?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Modifier le Avis Prospect</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Modifiez les informations du Avis Prospect ci-dessous.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
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
                {isSubmitting ? "Modification en cours..." : "Modifier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 