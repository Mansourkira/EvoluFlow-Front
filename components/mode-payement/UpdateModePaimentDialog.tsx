"use client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Save, StickyNote, CalendarClock, Banknote, Hash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateModePaiementSchema, ModePaiement } from "@/schemas/modePaiementSchema";
import { useEffect } from "react";

interface UpdateDialogProps {
  open: boolean;
  mode: ModePaiement;
  onSubmit: (data: ModePaiement) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateModePaiementDialog({ open, mode, onSubmit, onOpenChange }: UpdateDialogProps) {
  const form = useForm<ModePaiement>({
    resolver: zodResolver(updateModePaiementSchema),
    defaultValues: mode,
  });

  useEffect(() => {
    form.reset(mode);
  }, [mode]);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const iconMap: Record<string, React.ReactNode> = {
    Reference: <Hash className="h-4 w-4 text-gray-500" />,
    Libelle: <StickyNote className="h-4 w-4 text-gray-500" />,
    Nombre_Jour_Echeance: <CalendarClock className="h-4 w-4 text-gray-500" />,
    Versement_Banque: <Banknote className="h-4 w-4 text-gray-500" />,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Modifier le mode de paiement</DialogTitle>
          <DialogDescription>Mettre à jour les informations du mode</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["Reference", "Libelle", "Nombre_Jour_Echeance"] as const).map((name) => (
                <FormField
                  key={name}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{name.replace(/_/g, " ")}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          {iconMap[name]}
                          <Input
                            {...field}
                            type={name === "Nombre_Jour_Echeance" ? "number" : "text"}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                name === "Nombre_Jour_Echeance"
                                  ? Number(e.target.value)
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
            </div>

            {/* Toggle Versement_Banque */}
            <FormField
              control={control}
              name="Versement_Banque"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                    />
                  </FormControl>
                  <FormLabel>Versement à la banque</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="bg-black text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Enregistrement
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Enregistrer
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
