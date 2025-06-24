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
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSchema, type UpdateSiteFormData } from "@/schemas/siteSchema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building, X } from "lucide-react";
import type { Site } from "@/hooks/useSites";

interface UpdateSiteDialogProps {
  site: Site;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSiteUpdated?: () => void;
}

export function UpdateSiteDialog({ site, open, onOpenChange, onSiteUpdated }: UpdateSiteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<UpdateSiteFormData>({
    resolver: zodResolver(updateSiteSchema),
    defaultValues: {
      Reference: "",
      Raison_Sociale: "",
      Adresse: "",
      Complement_adresse: "",
      Code_Postal: "",
      Ville: "",
      Gouvernorat: "",
      Pays: "Tunisie",
      Telephone: "",
      Fax: "",
      E_Mail_Commercial: "",
      E_Mail_Marketing: "",
      E_Mail_Administration: "",
      E_Mail_Financier: "",
      Site_Web: "",
      Activite: "",
      Matricule_Fiscal: "",
      Capital: "",
      Sigle: "",
      Nombre_Max_Relance_Entretien: 0,
      Nombre_Max_Relance_Inscription: 0,
      Nombre_Max_Relance_Preparation: 0,
      Nombre_Max_Relance_Propect: 0,
    },
  });

  // Update form when site prop changes
  useEffect(() => {
    if (site && open) {
      form.reset({
        Reference: site.Reference || "",
        Raison_Sociale: site.Raison_Sociale || "",
        Adresse: site.Adresse || "",
        Complement_adresse: site.Complement_adresse || "",
        Code_Postal: site.Code_Postal || "",
        Ville: site.Ville || "",
        Gouvernorat: site.Gouvernorat || "",
        Pays: site.Pays || "Tunisie",
        Telephone: site.Telephone || "",
        Fax: site.Fax || "",
        E_Mail_Commercial: site.E_Mail_Commercial || "",
        E_Mail_Marketing: site.E_Mail_Marketing || "",
        E_Mail_Administration: site.E_Mail_Administration || "",
        E_Mail_Financier: site.E_Mail_Financier || "",
        Site_Web: site.Site_Web || "",
        Activite: site.Activite || "",
        Matricule_Fiscal: site.Matricule_Fiscal || "",
        Capital: site.Capital || "",
        Sigle: site.Sigle || "",
        Nombre_Max_Relance_Entretien: site.Nombre_Max_Relance_Entretien || 0,
        Nombre_Max_Relance_Inscription: site.Nombre_Max_Relance_Inscription || 0,
        Nombre_Max_Relance_Preparation: site.Nombre_Max_Relance_Preparation || 0,
        Nombre_Max_Relance_Propect: site.Nombre_Max_Relance_Propect || 0,
      });

      // Set image preview if site has logo
      if (site.Sigle) {
        setImagePreview(site.Sigle);
      } else {
        setImagePreview(null);
      }
    }
  }, [site, open, form]);

  const onSubmit = async (data: UpdateSiteFormData) => {
    setIsLoading(true);
    try {
      // Remove empty string fields and convert them to null for backend
      const siteData = { ...data };
      Object.keys(siteData).forEach(key => {
        if (siteData[key as keyof UpdateSiteFormData] === "") {
          (siteData as any)[key] = null;
        }
      });

      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/v1/sites/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(siteData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "✅ Site mis à jour",
          description: `${siteData.Raison_Sociale} a été modifié avec succès`,
        });
        
        onOpenChange(false);
        onSiteUpdated?.();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la modification du site');
      }
    } catch (error) {
      console.error('Erreur modification site:', error);
      toast({
        title: "❌ Erreur de modification",
        description: error instanceof Error ? error.message : "Impossible de modifier le site. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setImagePreview(null);
    onOpenChange(false);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        form.setValue('Sigle', base64);
        setImagePreview(base64);
      } catch (error) {
        toast({
          title: "❌ Erreur",
          description: "Impossible de traiter l'image sélectionnée.",
          variant: "destructive",
        });
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = (error) => reject(error);
    });
  };

  const removeImage = () => {
    form.setValue('Sigle', '');
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-[#3A90DA]" />
            Modifier le site
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations du site {site?.Raison_Sociale}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reference */}
              <FormField
                control={form.control}
                name="Reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence *</FormLabel>
                    <FormControl>
                      <Input placeholder="Référence du site" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Raison Sociale */}
              <FormField
                control={form.control}
                name="Raison_Sociale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raison Sociale *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Adresse */}
              <FormField
                control={form.control}
                name="Adresse"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse principale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Complement d'adresse */}
              <FormField
                control={form.control}
                name="Complement_adresse"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Complément d'adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Complément d'adresse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Code Postal */}
              <FormField
                control={form.control}
                name="Code_Postal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Code postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ville */}
              <FormField
                control={form.control}
                name="Ville"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gouvernorat */}
              <FormField
                control={form.control}
                name="Gouvernorat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gouvernorat</FormLabel>
                    <FormControl>
                      <Input placeholder="Gouvernorat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pays */}
              <FormField
                control={form.control}
                name="Pays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telephone */}
              <FormField
                control={form.control}
                name="Telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro de téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fax */}
              <FormField
                control={form.control}
                name="Fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro de fax" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Commercial */}
              <FormField
                control={form.control}
                name="E_Mail_Commercial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Commercial</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="commercial@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Marketing */}
              <FormField
                control={form.control}
                name="E_Mail_Marketing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Marketing</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="marketing@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Administration */}
              <FormField
                control={form.control}
                name="E_Mail_Administration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Administration</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Financier */}
              <FormField
                control={form.control}
                name="E_Mail_Financier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Financier</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="finance@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Site Web */}
              <FormField
                control={form.control}
                name="Site_Web"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Site Web</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activite */}
              <FormField
                control={form.control}
                name="Activite"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Activité</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description de l'activité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Matricule Fiscal */}
              <FormField
                control={form.control}
                name="Matricule_Fiscal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule Fiscal</FormLabel>
                    <FormControl>
                      <Input placeholder="Matricule fiscal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Capital */}
              <FormField
                control={form.control}
                name="Capital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capital</FormLabel>
                    <FormControl>
                      <Input placeholder="Capital de l'entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logo/Sigle */}
              <FormField
                control={form.control}
                name="Sigle"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Logo/Sigle</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                        {imagePreview && (
                          <div className="relative inline-block">
                            <img
                              src={`data:image/jpeg;base64,${imagePreview}`}
                              alt="Aperçu du logo"
                              className="w-32 h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={removeImage}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nombres de relances */}
              <div className="md:col-span-2">
                <h4 className="font-medium mb-3 text-gray-700">Paramètres de relance</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="Nombre_Max_Relance_Entretien"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Relance Entretien</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Nombre_Max_Relance_Inscription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Relance Inscription</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Nombre_Max_Relance_Preparation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Relance Préparation</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Nombre_Max_Relance_Propect"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Relance Prospect</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-[#3A90DA] hover:bg-[#2B7BC8]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  <>
                    <Building className="mr-2 h-4 w-4" />
                    Modifier le site
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