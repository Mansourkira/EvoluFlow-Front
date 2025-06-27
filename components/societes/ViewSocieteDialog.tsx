"use client";

import React from 'react';
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
import { Building2, Phone, Mail, Globe, MapPin, DollarSign, Calendar, User, ExternalLink, Copy, CheckCircle } from 'lucide-react';

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
}

export function ViewSocieteDialog({ societe, open, onOpenChange }: ViewSocieteDialogProps) {
  if (!societe) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto p-0 gap-0">
        <div className="bg-gradient-to-r from-[#3A90DA] to-[#2B75BD] text-white p-6 rounded-t-lg">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 className="h-6 w-6" />
              </div>
              Informations de la Société
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-lg">
              {societe.Raison_Sociale}
            </DialogDescription>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Référence: {societe.Reference}
              </Badge>
              {societe.Activite && (
                <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                  {societe.Activite}
                </Badge>
              )}
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Logo if available */}
          {societe.Sigle && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={`data:image/jpeg;base64,${societe.Sigle}`}
                  alt={`Logo de ${societe.Raison_Sociale}`}
                  className="w-32 h-32 object-cover rounded-xl border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#3A90DA] text-white p-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}

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
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Raison Sociale</label>
                    <p className="text-gray-900 font-semibold text-lg mt-1">{societe.Raison_Sociale}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Matricule Fiscal</label>
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
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Capital</label>
                    <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                      <DollarSign className="h-4 w-4 text-gray-600" />
                      {societe.Capital || 'Non spécifié'}
                    </p>
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
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Adresse complète</label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Contact */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 mb-3">Contact principal</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-600" />
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Téléphone</label>
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
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fax</label>
                      <p className="text-gray-900 font-medium mt-1">{societe.Fax || 'Non spécifié'}</p>
                    </div>
                    {societe.Site_Web && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-gray-600" />
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Site Web</label>
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

                {/* Email Contacts */}
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
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block">{email.label}</label>
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
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Créé par</label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-600" />
                    {societe.Utilisateur || 'Non spécifié'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date de création</label>
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