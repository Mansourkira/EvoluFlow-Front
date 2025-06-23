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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUserSchema, type AddUserFormData } from "@/schemas/userSchema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Shield, User, Eye, EyeOff, RefreshCw, Image as ImageIcon, X } from "lucide-react";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { sites, isLoading: loadingSites } = useSites();
  const { toast } = useToast();

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      Reference: "",
      E_mail: "",
      Nom_Prenom: "",
      Adresse: "",
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
          description: `${userData.Nom_Prenom} a été ajouté avec succès`,
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

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "⚠️ Image trop volumineuse",
          description: "L'image ne doit pas dépasser 5MB.",
          variant: "destructive",
        });
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        form.setValue("Image", base64);
        setImagePreview(base64);
      } catch (error) {
        console.error('Error converting image:', error);
        toast({
          title: "❌ Erreur",
          description: "Impossible de traiter l'image. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeImage = () => {
    form.setValue("Image", null);
    setImagePreview(null);
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

                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="Image"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Photo de profil</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            {imagePreview ? (
                              <div className="relative w-24 h-24">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-24 h-24 object-cover rounded-lg border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6"
                                  onClick={removeImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="cursor-pointer"
                                {...field}
                              />
                              <p className="text-sm text-gray-500 mt-2">
                                Format accepté: JPG, PNG, GIF (max. 5MB)
                              </p>
                            </div>
                          </div>
                        </div>
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
                          <SelectItem value="Ariana">Ariana</SelectItem>
                          <SelectItem value="Béja">Béja</SelectItem>
                          <SelectItem value="Ben Arous">Ben Arous</SelectItem>
                          <SelectItem value="Bizerte">Bizerte</SelectItem>
                          <SelectItem value="Gabès">Gabès</SelectItem>
                          <SelectItem value="Gafsa">Gafsa</SelectItem>
                          <SelectItem value="Jendouba">Jendouba</SelectItem>
                          <SelectItem value="Kairouan">Kairouan</SelectItem>
                          <SelectItem value="Kasserine">Kasserine</SelectItem>
                          <SelectItem value="Kébili">Kébili</SelectItem>
                          <SelectItem value="Kef">Kef</SelectItem>
                          <SelectItem value="Mahdia">Mahdia</SelectItem>
                          <SelectItem value="Manouba">Manouba</SelectItem>
                          <SelectItem value="Médenine">Médenine</SelectItem>
                          <SelectItem value="Monastir">Monastir</SelectItem>
                          <SelectItem value="Nabeul">Nabeul</SelectItem>
                          <SelectItem value="Sfax">Sfax</SelectItem>
                          <SelectItem value="Sidi Bouzid">Sidi Bouzid</SelectItem>
                          <SelectItem value="Siliana">Siliana</SelectItem>
                          <SelectItem value="Sousse">Sousse</SelectItem>
                          <SelectItem value="Tataouine">Tataouine</SelectItem>
                          <SelectItem value="Tozeur">Tozeur</SelectItem>
                          <SelectItem value="Tunis">Tunis</SelectItem>
                          <SelectItem value="Zaghouan">Zaghouan</SelectItem>
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
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Utilisateur avec puvoir">Utilisateur avec puvoir</SelectItem>
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
                            sites.map((site) => (
                              <SelectItem key={site.Raison_Sociale} value={site.Raison_Sociale}>
                                {site.Raison_Sociale}
                              </SelectItem>
                            ))
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
                            profiles.map((profile) => (
                              <SelectItem key={profile.Reference} value={profile.Reference}>
                                {profile.Libelle} ({profile.Reference})
                              </SelectItem>
                            ))
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Sécurité du mot de passe</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    Un mot de passe sécurisé a été généré automatiquement. 
                    Vous pouvez le modifier ou en générer un nouveau. 
                    L'utilisateur pourra le changer lors de sa première connexion.
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