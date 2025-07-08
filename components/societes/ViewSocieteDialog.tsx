"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Phone, Mail, Globe, MapPin, DollarSign, Calendar, User, ExternalLink, Copy, CheckCircle, Edit3, Save, X, Upload, ImageIcon } from 'lucide-react';
import { getDynamicLogoUrl, getFallbackLogoUrl, getLogoAltText, getLogoKey } from '@/lib/logoUtils';

interface Societe {
  Reference: string;
  Raison_Sociale: string;
  Adresse?: string;
  Complement_adresse?: string;
  Code_Postal?: string;
  Ville?: string;
  Gouvernorat?: string;
  Pays?: string;
  Telephone?: string;
  Fax?: string;
  E_Mail_Commercial?: string;
  E_Mail_Marketing?: string;
  E_Mail_Administration?: string;
  E_Mail_Financier?: string;
  Site_Web?: string;
  Activite?: string;
  Matricule_Fiscal?: string;
  Capital?: string;
  Sigle?: string;
  Utilisateur?: string;
  Heure?: string;
}

interface ViewSocieteDialogProps {
  societe: Societe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSociete: (updatedSociete: Partial<Societe>) => Promise<boolean>;
  onShowToast: (toast: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => void;
}

export function ViewSocieteDialog({ societe, open, onOpenChange, onUpdateSociete, onShowToast }: ViewSocieteDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Societe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true);
    if (societe) {
      setFormData(societe);
    }
  }, []);

  // Reset form data when societe changes
  useEffect(() => {
    if (societe && isClient) {
      setFormData(societe);
      setLogoPreview(null);
      setLogoFile(null);
      setIsEditing(false);
      setIsUploadingLogo(false);
    }
  }, [societe, isClient]);

  // Don't render until client-side and we have data
  if (!isClient || !societe || !formData) return null;



  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifié';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleInputChange = (field: keyof Societe, value: string) => {
    setFormData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        onShowToast({
          title: 'Erreur',
          description: 'Veuillez sélectionner un fichier image',
          variant: 'destructive'
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setIsLoading(true);
    
    try {
      let updateData = { ...formData };
      
      // Handle logo upload if there's a new file
      if (logoFile) {
        setIsUploadingLogo(true);
        
        try {
          // Convert file to base64
          const base64String = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                if (typeof reader.result === 'string') {
                  const base64 = reader.result.split(',')[1];
                  if (!base64) throw new Error('Invalid base64 data');
                  resolve(base64);
                } else {
                  throw new Error('Invalid reader result');
                }
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(logoFile);
          });

          // Validate base64 string
          if (!base64String || base64String === '[object Object]') {
            throw new Error('Invalid base64 data generated');
          }

          updateData.Sigle = base64String;
          console.log('Base64 string length:', base64String.length);
        } catch (error) {
          console.error('Error processing image:', error);
          onShowToast({
            title: 'Erreur',
            description: 'Erreur lors du traitement de l\'image',
            variant: 'destructive'
          });
          setIsLoading(false);
          setIsUploadingLogo(false);
          return;
        }
      }
      
      // Update société with or without new logo
      const success = await onUpdateSociete(updateData);
      if (success) {
        onShowToast({
          title: 'Succès',
          description: logoFile 
            ? 'Le logo et les informations de la société ont été mis à jour avec succès'
            : 'Les informations de la société ont été mises à jour avec succès'
        });
        setIsEditing(false);
        setLogoFile(null);
        setLogoPreview(null);
      } else {
        onShowToast({
          title: 'Erreur',
          description: 'Erreur lors de la mise à jour des informations',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating société:', error);
      onShowToast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour des informations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsUploadingLogo(false);
    }
  };

  const handleCancel = () => {
    if (societe) {
      setFormData(societe);
    }
    setIsEditing(false);
    setLogoFile(null);
    setLogoPreview(null);
    setIsUploadingLogo(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto p-0 gap-0" key={societe.Reference}>
        <div className="bg-gradient-to-r from-[#3A90DA] to-[#2B75BD] text-white p-6 rounded-t-lg">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center justify-between text-2xl font-bold">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                Informations de la Société
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                  </>
                )}
              </div>
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-lg">
              {isEditing ? formData.Raison_Sociale : societe.Raison_Sociale}
            </DialogDescription>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Référence: {societe.Reference}
              </Badge>
              {(isEditing ? formData.Activite : societe.Activite) && (
                <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                  {isEditing ? formData.Activite : societe.Activite}
                </Badge>
              )}
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Logo Section */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"  
                className="hidden"
              />
              
              {/* Logo Display */}
              <div className="relative">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt={`Nouveau logo de ${formData.Raison_Sociale}`}
                    className="w-32 h-32 object-cover rounded-xl border-4 border-white shadow-lg"
                  />
                ) : (
                  <img
                    key={getLogoKey(societe)}
                    src={getDynamicLogoUrl(societe)}
                    alt={getLogoAltText(societe)}
                    className="w-32 h-32 object-cover rounded-xl border-4 border-white shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallbackUrl = getFallbackLogoUrl(societe);
                      if (target.src !== fallbackUrl) {
                        target.src = fallbackUrl;
                      }
                    }}
                  />
                )}
                
                {/* Loading overlay for logo upload */}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-white text-xs font-medium bg-black/70 px-2 py-1 rounded">
                      Upload...
                    </div>
                  </div>
                )}
              </div>
              
              {/* Edit button for logo */}
              {isEditing && !isUploadingLogo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-[#3A90DA] text-white border-white hover:bg-[#2B75BD] h-8 w-8 p-0 rounded-full"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              )}
              
              {/* Status indicator */}
              {!isEditing && (
                <div className="absolute -bottom-2 -right-2 bg-[#3A90DA] text-white p-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>

          {/* Cards Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Information Card */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Building2 className="h-5 w-5" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Raison Sociale</Label>
                    {isEditing ? (
                      <Input
                        value={formData.Raison_Sociale}
                        onChange={(e) => handleInputChange('Raison_Sociale', e.target.value)}
                        className="mt-1 font-semibold text-lg"
                        placeholder="Nom de la société"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold text-lg mt-1">{societe.Raison_Sociale}</p>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Matricule Fiscal</Label>
                    {isEditing ? (
                      <Input
                        value={formData.Matricule_Fiscal || ''}
                        onChange={(e) => handleInputChange('Matricule_Fiscal', e.target.value)}
                        className="mt-1 font-medium"
                        placeholder="Matricule fiscal"
                      />
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-900 font-medium">{societe.Matricule_Fiscal || 'Non spécifié'}</p>
                        {societe.Matricule_Fiscal && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(societe.Matricule_Fiscal!)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Capital</Label>
                    {isEditing ? (
                      <Input
                        value={formData.Capital || ''}
                        onChange={(e) => handleInputChange('Capital', e.target.value)}
                        className="mt-1 font-medium"
                        placeholder="Capital social"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                        <DollarSign className="h-4 w-4 text-gray-600" />
                        {societe.Capital || 'Non spécifié'}
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Activité</Label>
                    {isEditing ? (
                      <Input
                        value={formData.Activite || ''}
                        onChange={(e) => handleInputChange('Activite', e.target.value)}
                        className="mt-1 font-medium"
                        placeholder="Secteur d'activité"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium mt-1">{societe.Activite || 'Non spécifié'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <MapPin className="h-5 w-5" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Adresse</Label>
                      <Textarea
                        value={formData.Adresse || ''}
                        onChange={(e) => handleInputChange('Adresse', e.target.value)}
                        className="mt-1"
                        placeholder="Adresse principale"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Complément d'adresse</Label>
                      <Input
                        value={formData.Complement_adresse || ''}
                        onChange={(e) => handleInputChange('Complement_adresse', e.target.value)}
                        className="mt-1"
                        placeholder="Complément d'adresse"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code Postal</Label>
                        <Input
                          value={formData.Code_Postal || ''}
                          onChange={(e) => handleInputChange('Code_Postal', e.target.value)}
                          className="mt-1"
                          placeholder="Code postal"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ville</Label>
                        <Input
                          value={formData.Ville || ''}
                          onChange={(e) => handleInputChange('Ville', e.target.value)}
                          className="mt-1"
                          placeholder="Ville"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gouvernorat</Label>
                        <Input
                          value={formData.Gouvernorat || ''}
                          onChange={(e) => handleInputChange('Gouvernorat', e.target.value)}
                          className="mt-1"
                          placeholder="Gouvernorat"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pays</Label>
                        <Input
                          value={formData.Pays || ''}
                          onChange={(e) => handleInputChange('Pays', e.target.value)}
                          className="mt-1"
                          placeholder="Pays"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Adresse complète</Label>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-900 font-medium">{societe.Adresse || 'Non spécifiée'}</p>
                      {societe.Complement_adresse && (
                        <p className="text-gray-600 text-sm">{societe.Complement_adresse}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <span className="bg-white px-2 py-1 rounded border">
                          {societe.Code_Postal || '--'}
                        </span>
                        <span>{societe.Ville || 'Ville non spécifiée'}</span>
                      </div>
                      {(societe.Gouvernorat || societe.Pays) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{societe.Gouvernorat}</span>
                          {societe.Gouvernorat && societe.Pays && <span>•</span>}
                          <span className="font-medium">{societe.Pays}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Phone className="h-5 w-5" />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Contact - Editing Mode */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 mb-3">Contact principal</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</Label>
                        <Input
                          value={formData.Telephone || ''}
                          onChange={(e) => handleInputChange('Telephone', e.target.value)}
                          className="mt-1"
                          placeholder="Numéro de téléphone"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fax</Label>
                        <Input
                          value={formData.Fax || ''}
                          onChange={(e) => handleInputChange('Fax', e.target.value)}
                          className="mt-1"
                          placeholder="Numéro de fax"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Site Web</Label>
                        <Input
                          value={formData.Site_Web || ''}
                          onChange={(e) => handleInputChange('Site_Web', e.target.value)}
                          className="mt-1"
                          placeholder="www.example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Contacts - Editing Mode */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 mb-3">Contacts email</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Commercial</Label>
                        <Input
                          value={formData.E_Mail_Commercial || ''}
                          onChange={(e) => handleInputChange('E_Mail_Commercial', e.target.value)}
                          className="mt-1"
                          placeholder="commercial@example.com"
                          type="email"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Marketing</Label>
                        <Input
                          value={formData.E_Mail_Marketing || ''}
                          onChange={(e) => handleInputChange('E_Mail_Marketing', e.target.value)}
                          className="mt-1"
                          placeholder="marketing@example.com"
                          type="email"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Administration</Label>
                        <Input
                          value={formData.E_Mail_Administration || ''}
                          onChange={(e) => handleInputChange('E_Mail_Administration', e.target.value)}
                          className="mt-1"
                          placeholder="admin@example.com"
                          type="email"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Financier</Label>
                        <Input
                          value={formData.E_Mail_Financier || ''}
                          onChange={(e) => handleInputChange('E_Mail_Financier', e.target.value)}
                          className="mt-1"
                          placeholder="finance@example.com"
                          type="email"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Contact - View Mode */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 mb-3">Contact principal</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-600" />
                          <div>
                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Téléphone</Label>
                            <p className="text-gray-900 font-medium">{societe.Telephone || 'Non spécifié'}</p>
                          </div>
                        </div>
                        {societe.Telephone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(societe.Telephone!)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fax</Label>
                        <p className="text-gray-900 font-medium mt-1">{societe.Fax || 'Non spécifié'}</p>
                      </div>
                      {societe.Site_Web && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-gray-600" />
                            <div>
                              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Site Web</Label>
                              <p className="text-gray-900 font-medium">{societe.Site_Web}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(societe.Site_Web?.startsWith('http') ? societe.Site_Web : `https://${societe.Site_Web}`, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Contacts - View Mode */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 mb-3">Contacts email</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Commercial', value: societe.E_Mail_Commercial },
                        { label: 'Marketing', value: societe.E_Mail_Marketing },
                        { label: 'Administration', value: societe.E_Mail_Administration },
                        { label: 'Financier', value: societe.E_Mail_Financier }
                      ].map((email) => (
                        email.value && (
                          <div key={email.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 text-gray-600" />
                              <div>
                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide block">{email.label}</Label>
                                <p className="text-gray-900 font-medium">{email.value}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(email.value!)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => window.open(`mailto:${email.value}`, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Information Card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Calendar className="h-5 w-5" />
                Informations système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Créé par</Label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-600" />
                    {societe.Utilisateur || 'Non spécifié'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date de création</Label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    {formatDate(societe.Heure)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with close button */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end rounded-b-lg">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-[#3A90DA] hover:bg-[#2B75BD] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 