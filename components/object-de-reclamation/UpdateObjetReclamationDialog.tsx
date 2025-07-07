"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateObjetReclamationSchema, type UpdateObjetReclamationFormData, type ObjetReclamation } from "@/schemas/objetReclamationSchema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useObjetReclamation } from "@/hooks/useObjetReclamation";

interface UpdateObjetReclamationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    objetReclamation: ObjetReclamation;
    onSuccess?: () => void;
}

export function UpdateObjetReclamationDialog({ 
    open, 
    onOpenChange, 
    objetReclamation, 
    onSuccess 
}: UpdateObjetReclamationDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateObjetReclamation } = useObjetReclamation();

    const form = useForm<UpdateObjetReclamationFormData>({
        resolver: zodResolver(updateObjetReclamationSchema),
        defaultValues: {
            Reference: objetReclamation.Reference,
            Libelle: objetReclamation.Libelle,
        },
    });

    const onSubmit = async (data: UpdateObjetReclamationFormData) => {
        setIsLoading(true);
        try {
            const success = await updateObjetReclamation(data);
            if (success) {
                toast.success(`✅ Objet de réclamation mis à jour - ${data.Libelle} a été modifié avec succès.`);
                onOpenChange(false);
                onSuccess?.();
            }
        } catch (error) {
            console.error('Erreur mise à jour objet de réclamation:', error);
            toast.error(`❌ Erreur de mise à jour - ${error instanceof Error ? error.message : "Impossible de mettre à jour l'objet de réclamation. Veuillez réessayer."}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Modifier l'objet de réclamation</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de l'objet de réclamation. Cliquez sur enregistrer quand vous avez terminé.
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
                                            placeholder="Ex: OBJ001" 
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
                                            placeholder="Ex: Objet de réclamation entreprise ABC" 
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