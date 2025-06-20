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
import { updateUserSchema, type UpdateUserFormData } from "@/schemas/userSchema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Shield, User, Image as ImageIcon, X, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Profile {
  Reference: string;
  Libelle: string;
}

interface UserData {
  Reference: string;
  Nom_Prenom: string;
  E_mail: string;
  Adresse?: string;
  Complement_adresse?: string;
  Code_Postal?: string;
  Ville?: string;
  Gouvernorat?: string;
  Pays?: string;
  Telephone?: string;
  Type_Utilisateur?: string;
  Site_Defaut?: string;
  Profil: string;
  Profil_Libelle?: string;
  Image?: string | null;
}

interface UpdateUserDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated?: () => void;
}

export function UpdateUserDialog({ user, open, onOpenChange, onUserUpdated }: UpdateUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [fullUserData, setFullUserData] = useState<UserData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
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
      Mot_de_passe: "", // Don't prefill password for security
      Site_Defaut: "",
      Profil: "",
      Image: null,
    },
  });

  // Fetch complete user data when dialog opens
  useEffect(() => {
    const fetchUserData = async () => {
      if (!open || !user?.E_mail) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/get', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ E_mail: user.E_mail }),
        });

        if (response.ok) {
          const userData = await response.json();
          setFullUserData(userData);
          setImagePreview(userData.Image || null);
          
          // Populate form with all available data
          form.reset({
            Reference: userData.Reference || "",
            E_mail: userData.E_mail || "",
            Nom_Prenom: userData.Nom_Prenom || "",
            Adresse: userData.Adresse || "",
            Complement_adresse: userData.Complement_adresse || "",
            Code_Postal: userData.Code_Postal || "",
            Ville: userData.Ville || "",
            Gouvernorat: userData.Gouvernorat || "",
            Pays: userData.Pays || "Tunisie",
            Telephone: userData.Telephone || "",
            Type_Utilisateur: userData.Type_Utilisateur || "",
            Mot_de_passe: "", // Don't prefill password
            Site_Defaut: userData.Site_Defaut || "",
            Profil: userData.Profil || "",
            Image: userData.Image || null,
          });
        } else {
          // Fallback to user data passed as prop
          form.reset({
            Reference: user.Reference || "",
            E_mail: user.E_mail || "",
            Nom_Prenom: user.Nom_Prenom || "",
            Adresse: user.Adresse || "",
            Complement_adresse: user.Complement_adresse || "",
            Code_Postal: user.Code_Postal || "",
            Ville: user.Ville || "",
            Gouvernorat: user.Gouvernorat || "",
            Pays: user.Pays || "Tunisie",
            Telephone: user.Telephone || "",
            Type_Utilisateur: user.Type_Utilisateur || "",
            Mot_de_passe: "", // Don't prefill password
            Site_Defaut: user.Site_Defaut || "",
            Profil: user.Profil || "",
            Image: null,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to user data passed as prop if fetch fails
        form.reset({
          Reference: user.Reference || "",
          E_mail: user.E_mail || "",
          Nom_Prenom: user.Nom_Prenom || "",
          Adresse: user.Adresse || "",
          Complement_adresse: user.Complement_adresse || "",
          Code_Postal: user.Code_Postal || "",
          Ville: user.Ville || "",
          Gouvernorat: user.Gouvernorat || "",
          Pays: user.Pays || "Tunisie",
          Telephone: user.Telephone || "",
          Type_Utilisateur: user.Type_Utilisateur || "",
          Mot_de_passe: "", // Don't prefill password
          Site_Defaut: user.Site_Defaut || "",
          Profil: user.Profil || "",
          Image: null,
        });
      }
    };

    fetchUserData();
  }, [open, user, form]);

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

  // Add image handling functions
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

  const onSubmit = async (data: UpdateUserFormData) => {
    // Validate that profile is not a placeholder value (only if a profile is selected)
    if (data.Profil && (data.Profil === "loading" || data.Profil === "no-profiles")) {
      toast({
        title: "⚠️ Erreur de validation",
        description: "Veuillez sélectionner un profil valide.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { E_mail, ...formData } = data;
      const updateData: any = {
        E_mail: user.E_mail, // Use original E_mail as identifier
      };

      // Only include fields that have actual values (not empty)
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (value !== null && value !== undefined && value !== '') {
          updateData[key] = value;
        }
      });

      // Handle image separately - if imagePreview is null, explicitly set Image to null
      if (imagePreview === null) {
        updateData.Image = null;
      } else if (data.Image) {
        updateData.Image = data.Image;
      }

      // Only include password if it was actually provided and not empty
      if (!data.Mot_de_passe || data.Mot_de_passe.trim() === '') {
        delete updateData.Mot_de_passe;
      }

      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "✅ Utilisateur mis à jour",
          description: `${updateData.Nom_Prenom || user.Nom_Prenom} a été mis à jour avec succès`,
        });
        
        onOpenChange(false);
        onUserUpdated?.();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      toast({
        title: "❌ Erreur de mise à jour",
        description: error instanceof Error ? error.message : "Impossible de mettre à jour l'utilisateur. Veuillez réessayer.",
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Modifier l'Utilisateur
          </DialogTitle>
          <DialogDescription>
            Modifier les informations de {user.Nom_Prenom}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photo de profil
              </h3>
              
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={imagePreview || undefined} 
                    alt={user.Nom_Prenom}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-semibold bg-blue-100 text-blue-700">
                    {user.Nom_Prenom?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="max-w-sm"
                  />
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Supprimer la photo
                    </Button>
                  )}
                  <p className="text-sm text-gray-500">
                    Format accepté: JPG, PNG. Taille max: 5MB
                  </p>
                </div>
              </div>
            </div>

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

                {/* Email - Read Only */}
                <FormField
                  control={form.control}
                  name="E_mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Entrer l'adresse email" 
                          {...field}
                          disabled
                          className="bg-gray-50 text-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="Telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrer le numéro de téléphone" {...field} />
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
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrer l'adresse complète" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Complement Address */}
                <FormField
                  control={form.control}
                  name="Complement_adresse"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Complément d'adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Complément d'adresse (optionnel)" {...field} value={field.value || ""} />
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
                      <FormLabel>Code Postal</FormLabel>
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
                      <FormLabel>Ville</FormLabel>
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
                      <FormLabel>Gouvernorat</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <FormLabel>Pays</FormLabel>
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
                      <FormLabel>Type d'Utilisateur</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <FormLabel>Site par Défaut</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le site" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tunis">Tunis</SelectItem>
                          <SelectItem value="Sfax">Sfax</SelectItem>
                          <SelectItem value="Sousse">Sousse</SelectItem>
                          <SelectItem value="Gafsa">Gafsa</SelectItem>
                          <SelectItem value="Gabès">Gabès</SelectItem>
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
                      <FormLabel>Profil</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
              <h3 className="text-lg font-semibold text-gray-900">Changer le Mot de Passe (Optionnel)</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Modification du mot de passe</span>
                </div>
                <FormField
                  control={form.control}
                  name="Mot_de_passe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Laissez vide pour conserver le mot de passe actuel" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-yellow-700 text-sm mt-2">
                  Laissez ce champ vide si vous ne souhaitez pas changer le mot de passe.
                </p>
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
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Mettre à Jour
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
