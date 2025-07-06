import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";  
import { objetReclamationSchema, ObjetReclamationFormValues, ObjetReclamation } from "@/schemas/objetReclamationSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface UpdateObjetReclamationDialogProps {
    objetReclamation: ObjetReclamation;
    onSubmit: (Reference: string, data: ObjetReclamationFormValues) => Promise<boolean>;
    open: boolean;
    onClose: () => void;
    onObjetReclamationUpdated?: () => void;
}

export function UpdateObjetReclamationDialog({
    objetReclamation,
    onSubmit,
    open,
    onClose,
    onObjetReclamationUpdated,
}: UpdateObjetReclamationDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ObjetReclamationFormValues>({
        resolver: zodResolver(objetReclamationSchema),
        defaultValues: {
            Reference: objetReclamation.Reference,
            Libelle: objetReclamation.Libelle,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                Reference: objetReclamation.Reference,
                Libelle: objetReclamation.Libelle,
            });
        }
    }, [open, objetReclamation, form]);

    const handleSubmit = async (data: ObjetReclamationFormValues) => {
        try {
            setIsSubmitting(true);
            const success = await onSubmit(objetReclamation.Reference, data);
            if (success) {
                toast.success("Objet de réclamation mis à jour avec succès");
                onObjetReclamationUpdated?.();
                onClose();
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour de l'objet de réclamation");
            console.error("Error updating objet de reclamation:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Modifier l'objet de réclamation
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    Informations de base
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="Reference"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Référence</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Entrez une référence" />
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
                                                    <Input {...field} placeholder="Entrez un libellé" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Separator />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 