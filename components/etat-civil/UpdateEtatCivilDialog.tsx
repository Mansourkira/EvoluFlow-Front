"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateEtatCivilSchema, type UpdateEtatCivilFormData, type EtatCivil } from "@/schemas/etatCivilSchema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEtatCivil } from "@/hooks/use-etat-civil";

interface UpdateEtatCivilDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    etatCivil: EtatCivil;
    onSuccess?: () => void;
}

export function UpdateEtatCivilDialog({ 
    open, 
    onOpenChange, 
    etatCivil, 
    onSuccess 
}: UpdateEtatCivilDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateEtatCivil } = useEtatCivil();

    const form = useForm<UpdateEtatCivilFormData>({
        resolver: zodResolver(updateEtatCivilSchema),
        defaultValues: {
            Reference: etatCivil.Reference,
            Libelle: etatCivil.Libelle,
        },
    });

        const onSubmit = async (data: UpdateEtatCivilFormData) => {
        setIsLoading(true);
        try {
            const success = await updateEtatCivil(data);
            if (success) {
                toast.success(`✅ Etat civil mis à jour - ${data.Libelle} a été modifié avec succès.`);
                onOpenChange(false);
                onSuccess?.();
            }
        } catch (error) {
            console.error('Erreur mise à jour état civil:', error);
            toast.error(`❌ Erreur de mise à jour - ${error instanceof Error ? error.message : "Impossible de mettre à jour l'état civil. Veuillez réessayer."}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Modifier l'état civil</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de l'état civil. Cliquez sur enregistrer quand vous avez terminé.
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
                                        <Input 
                                            placeholder="Ex: EC001" 
                                            {...field} 
                                            disabled={isLoading}
                                        />
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
                                        <Input 
                                            placeholder="Ex: Célibataire" 
                                            {...field} 
                                            disabled={isLoading}
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
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="gap-2"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 