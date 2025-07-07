"use client";
  
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
import { Loader2, CreditCard, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { useSuiviProspects } from "@/hooks/useSuiviProspects";
import { addSuiviProspectSchema, type AddSuiviProspectFormData } from "@/schemas/suiviProspectSchema";

interface AddSuiviProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddSuiviProspectDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: AddSuiviProspectDialogProps) {
  const { addSuiviProspect, isLoading } = useSuiviProspects();

  const form = useForm<AddSuiviProspectFormData>({
    resolver: zodResolver(addSuiviProspectSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Relance: false,
    },
  });

  const onSubmit = async (data: AddSuiviProspectFormData) => {
    try {
      const success = await addSuiviProspect(data);
      if (success) {
        form.reset();
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ajout du suivi prospect");
    }
  };

  const generateReference = () => {
    const timestamp = new Date().getTime().toString();
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const reference = `SP${timestamp}${randomSuffix}`;
    form.setValue('Reference', reference);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Ajouter un suivi prospect
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau suivi prospect.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence *</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Ex: SP001"
                        {...field}
                        disabled={isLoading}
                        className="flex-1"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateReference}
                      disabled={isLoading}
                      className="px-3 flex-shrink-0"
                      title="Générer une référence automatique"
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé *</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le libellé" {...field} disabled={isLoading} />
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
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 