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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addCourseTypeSchema, type AddCourseTypeFormData, PriorityOptions } from "@/schemas/courseTypeSchema";
import { useToast } from "@/hooks/use-toast";
import { deduplicateArray } from "@/lib/constants";
import { Loader2, Plus, BookOpen, RefreshCw } from "lucide-react";

interface User {
  Reference: string;
  Nom_Prenom: string;
  E_mail: string;
}

interface AddCourseTypeDialogProps {
  onCourseTypeAdded?: () => void;
}

export function AddCourseTypeDialog({ onCourseTypeAdded }: AddCourseTypeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddCourseTypeFormData>({
    resolver: zodResolver(addCourseTypeSchema),
    defaultValues: {
      Reference: "",
      Libelle: "",
      Priorite: null,
      Utilisateur: null,
    },
  });

  // Fetch users when dialog opens
  useEffect(() => {
    const fetchUsers = async () => {
      if (!open) return;
      
      setLoadingUsers(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/v1/UsersList', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [open]);

  const onSubmit = async (data: AddCourseTypeFormData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/v1/typecour/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "✅ Succès",
          description: "Type de cours ajouté avec succès",
        });
        form.reset();
        setOpen(false);
        onCourseTypeAdded?.();
      } else {
        const errorData = await response.json();
        toast({
          title: "❌ Erreur",
          description: errorData.error || "Erreur lors de l'ajout",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Add course type error:', error);
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
    setOpen(false);
  };

  const generateReference = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 5);
    return `TC_${timestamp}_${randomStr}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3A90DA] hover:bg-[#2B7BC8]">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un Type de Cours
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#3A90DA]" />
            Ajouter un Type de Cours
          </DialogTitle>
          <DialogDescription>
            Créez un nouveau type de cours avec ses informations de base.
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
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="TC_001" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newRef = generateReference();
                            form.setValue("Reference", newRef);
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
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

                {/* User */}
                <FormField
                  control={form.control}
                  name="Utilisateur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Utilisateur Responsable</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value === "none" ? null : value)} 
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingUsers ? "Chargement..." : "Sélectionner l'utilisateur"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingUsers ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Chargement des utilisateurs...
                            </SelectItem>
                          ) : users.length > 0 ? (
                            (() => {
                              const uniqueUsers = deduplicateArray(users, user => user.Reference);
                              return (
                                <>
                                  <SelectItem value="none">Aucun utilisateur</SelectItem>
                                  {uniqueUsers.map((user, index) => (
                                    <SelectItem key={`user-${user.Reference}-${index}`} value={user.Reference}>
                                      {user.Nom_Prenom} ({user.E_mail})
                                    </SelectItem>
                                  ))}
                                </>
                              );
                            })()
                          ) : (
                            <SelectItem value="no-users" disabled>
                              Aucun utilisateur disponible
                            </SelectItem>
                          )}
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
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le Type de Cours
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