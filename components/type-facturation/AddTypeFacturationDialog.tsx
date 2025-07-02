"use client";

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
  DialogTrigger,
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
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTypeFacturation } from "@/hooks/useTypeFacturation";
import { addTypeFacturationSchema, AddTypeFacturationFormData } from "@/schemas/typeFacturationSchema";

interface AddTypeFacturationDialogProps {
  onSuccess?: () => void;
}

export function AddTypeFacturationDialog({ onSuccess }: AddTypeFacturationDialogProps) {
  const [open, setOpen] = useState(false);
  const { addTypeFacturation, isLoading } = useTypeFacturation();
  const { toast } = useToast();

  const form = useForm<AddTypeFacturationFormData>({
    resolver: zodResolver(addTypeFacturationSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Sous_Traitance: false,
    },
  });

  const onSubmit = async (data: AddTypeFacturationFormData) => {
    try {
      const success = await addTypeFacturation(data);
      if (success) {
        toast({
          title: "Succès",
          description: "Type de facturation ajouté avec succès",
        });
        form.reset();
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du type de facturation",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un type de facturation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Ajouter un type de facturation
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau type de facturation.
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
                  <FormControl>
                    <Input placeholder="Entrez la référence" {...field} />
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
                  <FormLabel>Libellé *</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le libellé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Sous_Traitance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Sous-traitance</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Ce type de facturation concerne-t-il la sous-traitance ?
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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