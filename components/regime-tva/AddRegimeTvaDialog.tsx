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
import { Loader2, Plus, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRegimeTva } from "@/hooks/useRegimeTva";
import { addRegimeTvaSchema, AddRegimeTvaFormData } from "@/schemas/regimeTvaSchema";

interface AddRegimeTvaDialogProps {
  onSuccess?: () => void;
}

export function AddRegimeTvaDialog({ onSuccess }: AddRegimeTvaDialogProps) {
  const [open, setOpen] = useState(false);
  const { addRegimeTva, isLoading } = useRegimeTva();
  const { toast } = useToast();

  const form = useForm<AddRegimeTvaFormData>({
    resolver: zodResolver(addRegimeTvaSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Sous_Traitance: false,
    },
  });

  const onSubmit = async (data: AddRegimeTvaFormData) => {
    try {
      const success = await addRegimeTva(data);
      if (success) {
        toast({
          title: "Succès",
          description: "Régime de TVA ajouté avec succès",
        });
        form.reset();
        setOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du régime de TVA",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un régime de TVA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Ajouter un régime de TVA
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau régime de TVA.
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
                      Ce régime de TVA concerne-t-il la sous-traitance ?
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