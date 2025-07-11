"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { addSiteSchema, type AddSiteFormData } from "@/schemas/siteSchema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Building, Eye, EyeOff, RefreshCw, Image as ImageIcon, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TUNISIA_GOVERNORATES } from "@/lib/constants";

interface AddSiteDialogProps {
  onSiteAdded?: () => void;
}

export function AddSiteDialog({ onSiteAdded }: AddSiteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<AddSiteFormData>({
    resolver: zodResolver(addSiteSchema),
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

  const onSubmit = async (data: AddSiteFormData) => {
    setIsLoading(true);
    try {
      // Generate auto-reference if not provided
      const siteData = {
        ...data,
        Reference: data.Reference || `S${String(Date.now()).slice(-6)}`,
      };

      // Remove empty string fields and convert them to null for backend
      Object.keys(siteData).forEach(key => {
        if (siteData[key as keyof AddSiteFormData] === "") {
          (siteData as any)[key] = null;
        }
      });

      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/v1/sites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(siteData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "✅ Site créé",
          description: `${siteData.Raison_Sociale} a été ajouté avec succès`,
        });
        
        // Reset form and close dialog
        form.reset();
        setImagePreview(null);
        setOpen(false);
        onSiteAdded?.();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la création du site');
      }
    } catch (error) {
      console.error('Erreur création site:', error);
      toast({
        title: "❌ Erreur de création",
        description: error instanceof Error ? error.message : "Impossible de créer le site. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setImagePreview(null);
    setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3A90DA] hover:bg-[#2B7BC8] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-[#3A90DA]" />
            Ajouter un nouveau site
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau site.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Logo/Sigle */}
                 <FormField
                control={form.control}
                name="Sigle"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Logo/Sigle</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-4">
                          {!imagePreview ? (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full h-24 border-dashed flex flex-col items-center justify-center gap-2"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Cliquez pour sélectionner un logo
                              </span>
                              <span className="text-xs text-gray-400">
                                PNG, JPG jusqu'à 5MB
                              </span>
                            </Button>
                          ) : (
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative">
                                <img
                                  src={`data:image/jpeg;base64,${imagePreview}`}
                                  alt="Aperçu du logo"
                                  className="w-32 h-32 object-cover rounded-lg border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                                  onClick={removeImage}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                              >
                                <ImageIcon className="h-4 w-4" />
                                Changer
                              </Button>
                            </div>
                          )}
                          <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Reference */}
              <FormField
                control={form.control}
                name="Reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence *</FormLabel>
                    <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ex: S001" 
                        {...field} 
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const timestamp = Date.now().toString().slice(-6);
                          const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
                          const generatedReference = `S${timestamp}${randomSuffix}`;
                          field.onChange(generatedReference);
                        }}
                        disabled={isLoading}
                        title="Générer une référence automatique"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
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
                    Création...
                  </>
                ) : (
                  <>
                    <Building className="mr-2 h-4 w-4" />
                    Créer le site
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