"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCourseTypeSchema, type UpdateCourseTypeFormData, PriorityOptions, type CourseType } from "@/schemas/courseTypeSchema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, BookOpen } from "lucide-react";

interface User {
  Reference: string;
  Nom_Prenom: string;
  E_mail: string;
}

interface UpdateCourseTypeDialogProps {
  courseType: CourseType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseTypeUpdated?: () => void;
}

export function UpdateCourseTypeDialog({ 
  courseType, 
  open, 
  onOpenChange, 
  onCourseTypeUpdated 
}: UpdateCourseTypeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<UpdateCourseTypeFormData>({
    resolver: zodResolver(updateCourseTypeSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Priorite: null,
    },
  });

  // Populate form when courseType changes
  useEffect(() => {
    if (courseType && open) {
      form.reset({
        Reference: courseType.Reference || "",
        Libelle: courseType.Libelle || "",
        Priorite: courseType.Priorite || null,
      });
    }
  }, [courseType, open, form]);



  const onSubmit = async (data: UpdateCourseTypeFormData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/typecour/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "✅ Succès",
          description: "Type de cours modifié avec succès",
        });
        onOpenChange(false);
        onCourseTypeUpdated?.();
      } else {
        const errorData = await response.json();
        toast({
          title: "❌ Erreur",
          description: errorData.error || "Erreur lors de la modification",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Update course type error:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#3A90DA]" />
            Modifier le Type de Cours
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations du type de cours "{courseType?.Libelle}".
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations de Base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reference */}
                <FormField
                  control={form.control}
                  name="Reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Référence *</FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="bg-gray-50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Libelle */}
                <FormField
                  control={form.control}
                  name="Libelle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Libellé *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du type de cours" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Priority */}
                <FormField
                  control={form.control}
                  name="Priorite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priorité</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value === "none" ? null : Number(value))} 
                        value={field.value?.toString() || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la priorité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Aucune priorité</SelectItem>
                          <SelectItem value={PriorityOptions.LOW.toString()}>Faible</SelectItem>
                          <SelectItem value={PriorityOptions.MEDIUM.toString()}>Moyenne</SelectItem>
                          <SelectItem value={PriorityOptions.HIGH.toString()}>Élevée</SelectItem>
                          <SelectItem value={PriorityOptions.URGENT.toString()}>Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>

          

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Modification...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
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