"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSites } from "@/hooks/useSites";
import type { Site } from "@/hooks/useSites";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { addUserSchema, type AddUserFormData, SexeOptions, EtatCivilOptions, TypeUtilisateurOptions } from "@/schemas/userSchema";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { TUNISIA_GOVERNORATES, USER_TYPES, safeMapWithUniqueKeys, deduplicateArray } from "@/lib/constants";
import { Loader2, Plus, Shield, User, Eye, EyeOff, RefreshCw, X, Image as ImageIcon } from "lucide-react";

interface Profile {
  Reference: string;
  Libelle: string;
}

interface AddUserDialogProps {
  onUserAdded?: () => void;
}

// Function to generate a random password
const generatePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { sites, isLoading: loadingSites } = useSites();
  const { toast } = useToast();

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      Reference: "",
      E_mail: "",
      Nom_Prenom: "",
      Adresse: "",
      Complement_adresse: "",
      Code_Postal: "",
      Ville: "",
      Gouvernorat: "",
      Pays: "Tunisie",
      Telephone: "",
      Type_Utilisateur: "",
      Mot_de_passe: generatePassword(), 
      Site_Defaut: "",
      Profil: "",
      Image: null,
      Sexe: undefined,
      Etat_Civil: undefined,
      Reinitialisation_mot_de_passe: true,
    },
  });

  // Fetch profiles when component mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoadingProfiles(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/profiles', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const profilesData = await response.json();
          setProfiles(profilesData);
        } else {
          console.error('Failed to fetch profiles');
          toast({
            title: "⚠️ Erreur de chargement",
            description: "Impossible de charger les profils utilisateur.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "❌ Erreur de connexion",
          description: "Impossible de contacter le serveur pour charger les profils.",
          variant: "destructive",
        });
      } finally {
        setLoadingProfiles(false);
      }
    };

    if (open) {
      fetchProfiles();
    }
  }, [open, toast]);

  const onSubmit = async (data: AddUserFormData) => {
    // Validate that profile is not a placeholder value
    if (!data.Profil || data.Profil === "loading" || data.Profil === "no-profiles") {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un profil valide.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Generate auto-reference if not provided
      const userData = {
        ...data,
        Reference: data.Reference || `U${String(Date.now()).slice(-3)}`,
        Mot_de_passe: "123456", // Ensure fixed password
        Reinitialisation_mot_de_passe: data.Reinitialisation_mot_de_passe, // Use form value
      };

      // Remove Image field if it's null to avoid backend issues
      if (userData.Image === null || userData.Image === undefined) {
        delete userData.Image;
      }

      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "✅ Utilisateur créé",
          description: `${userData.Nom_Prenom} a été ajouté avec succès.${userData.Reinitialisation_mot_de_passe ? ' Il devra changer son mot de passe lors de sa première connexion.' : ' Il peut utiliser le mot de passe temporaire directement.'}`,
        });
        
        // Reset form and close dialog
        form.reset();
        setOpen(false);
        onUserAdded?.();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la création de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      toast({
        title: "❌ Erreur de création",
        description: error instanceof Error ? error.message : "Impossible de créer l'utilisateur. Veuillez réessayer.",
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



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter Utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Ajouter un Nouvel Utilisateur
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau compte utilisateur.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations Personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="Nom_Prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom Complet *</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrer le nom complet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="E_mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Entrer l'adresse email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="Telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrer le numéro de téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sexe */}
                <FormField
                  control={form.control}
                  name="Sexe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexe</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le sexe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={SexeOptions.HOMME}>{SexeOptions.HOMME}</SelectItem>
                          <SelectItem value={SexeOptions.FEMME}>{SexeOptions.FEMME}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* État Civil */}
                <FormField
                  control={form.control}
                  name="Etat_Civil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>État Civil</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner l'état civil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={EtatCivilOptions.CELIBATAIRE}>{EtatCivilOptions.CELIBATAIRE}</SelectItem>
                          <SelectItem value={EtatCivilOptions.MARIE}>{EtatCivilOptions.MARIE}</SelectItem>
                          <SelectItem value={EtatCivilOptions.DIVORCE}>{EtatCivilOptions.DIVORCE}</SelectItem>
                          <SelectItem value={EtatCivilOptions.VEUF}>{EtatCivilOptions.VEUF}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="Image"
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="col-span-full">
                      <FormControl>
                        <ImageUpload
                          label="Photo de profil"
                          value={value}
                          onChange={onChange}
                          onError={(error) => toast({
                            title: "❌ Erreur",
                            description: error,
                            variant: "destructive",
                          })}
                          size="md"
                          shape="circle"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations d'Adresse</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address */}
                <FormField
                  control={form.control}
                  name="Adresse"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Adresse *</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrer l'adresse complète" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Postal Code */}
                <FormField
                  control={form.control}
                  name="Code_Postal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code Postal *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 2005" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="Ville"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Gafsa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Governorate */}
                <FormField
                  control={form.control}
                  name="Gouvernorat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gouvernorat *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le gouvernorat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TUNISIA_GOVERNORATES.map((governorate, index) => (
                            <SelectItem key={`gov-${governorate}-${index}`} value={governorate}>
                              {governorate}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="Pays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tunisie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* System Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Informations Système
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* User Type */}
                <FormField
                  control={form.control}
                  name="Type_Utilisateur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type d'Utilisateur *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {USER_TYPES.map((type, index) => (
                            <SelectItem key={`user-type-${type}-${index}`} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Default Site */}
                <FormField
                  control={form.control}
                  name="Site_Defaut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site par Défaut *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingSites ? "Chargement..." : "Sélectionner le site"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingSites ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Chargement des sites...
                            </SelectItem>
                          ) : sites.length > 0 ? (
                            (() => {
                              // Deduplicate sites by Raison_Sociale
                              const uniqueSites = deduplicateArray(sites, site => site.Raison_Sociale);
                              return uniqueSites.map((site, index) => (
                                <SelectItem key={`site-${site.Raison_Sociale}-${index}`} value={site.Raison_Sociale}>
                                  {site.Raison_Sociale}
                                </SelectItem>
                              ));
                            })()
                          ) : (
                            <SelectItem value="no-sites" disabled>
                              Aucun site disponible
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Profile */}
                <FormField
                  control={form.control}
                  name="Profil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profil *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingProfiles ? "Chargement..." : "Sélectionner le profil"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingProfiles ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Chargement des profils...
                            </SelectItem>
                          ) : profiles.length > 0 ? (
                            (() => {
                              // Deduplicate profiles by Reference (should be unique but extra safety)
                              const uniqueProfiles = deduplicateArray(profiles, profile => profile.Reference);
                              return uniqueProfiles.map((profile, index) => (
                                <SelectItem key={`profile-${profile.Reference}-${index}`} value={profile.Reference}>
                                  {profile.Libelle} ({profile.Reference})
                                </SelectItem>
                              ));
                            })()
                          ) : (
                            <SelectItem value="no-profiles" disabled>
                              Aucun profil disponible
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

            {/* Password Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations de Connexion</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="Mot_de_passe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newPassword = generatePassword();
                            form.setValue("Mot_de_passe", newPassword);
                            toast({
                              title: "🔑 Nouveau mot de passe",
                              description: "Un nouveau mot de passe a été généré.",
                            });
                          }}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Générer
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Force Password Reset Checkbox */}
                <FormField
                  control={form.control}
                  name="Reinitialisation_mot_de_passe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Forcer la réinitialisation du mot de passe
                        </FormLabel>
                        <FormDescription className="text-sm text-gray-600">
                          L'utilisateur sera obligé de changer son mot de passe lors de sa première connexion. 
                          Recommandé pour la sécurité.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Sécurité du mot de passe</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    Un mot de passe temporaire (123456) sera assigné automatiquement. 
                    {form.watch("Reinitialisation_mot_de_passe") ? (
                      <strong> L'utilisateur sera obligé de changer son mot de passe lors de sa première connexion</strong>
                    ) : (
                      " L'utilisateur peut utiliser ce mot de passe directement"
                    )} pour des raisons de sécurité.
                  </p>
                </div>
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
                    Créer l'Utilisateur
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