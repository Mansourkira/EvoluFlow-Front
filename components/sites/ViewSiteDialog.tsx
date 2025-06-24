"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building, Phone, Mail, Globe, MapPin, DollarSign, Calendar } from "lucide-react";
import type { Site } from "@/hooks/useSites";

interface ViewSiteDialogProps {
  site: Site | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewSiteDialog({ site, open, onOpenChange }: ViewSiteDialogProps) {
  if (!site) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-[#3A90DA]" />
            Détails du site
          </DialogTitle>
          <DialogDescription>
            Informations détaillées du site {site.Raison_Sociale}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header avec logo si disponible */}
          {site.Sigle && (
            <div className="flex justify-center">
              <img
                src={`data:image/jpeg;base64,${site.Sigle}`}
                alt={`Logo de ${site.Raison_Sociale}`}
                className="w-24 h-24 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
                Informations générales
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Référence</label>
                  <p className="text-gray-900">{site.Reference}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Raison Sociale</label>
                  <p className="text-gray-900 font-medium">{site.Raison_Sociale}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Activité</label>
                  <p className="text-gray-900">{site.Activite || "Non spécifiée"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Matricule Fiscal</label>
                  <p className="text-gray-900">{site.Matricule_Fiscal || "Non spécifié"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Capital</label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {site.Capital || "Non spécifié"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
                Adresse
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Adresse</label>
                  <p className="text-gray-900 flex items-start gap-1">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    {site.Adresse || "Non spécifiée"}
                  </p>
                </div>
                
                {site.Complement_adresse && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Complément d'adresse</label>
                    <p className="text-gray-900">{site.Complement_adresse}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Code Postal</label>
                    <p className="text-gray-900">{site.Code_Postal || "Non spécifié"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ville</label>
                    <p className="text-gray-900">{site.Ville || "Non spécifiée"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gouvernorat</label>
                    <p className="text-gray-900">{site.Gouvernorat || "Non spécifié"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pays</label>
                    <p className="text-gray-900">{site.Pays || "Non spécifié"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
              Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Téléphone</label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {site.Telephone || "Non spécifié"}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Fax</label>
                  <p className="text-gray-900">{site.Fax || "Non spécifié"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Site Web</label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {site.Site_Web ? (
                      <a 
                        href={site.Site_Web} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {site.Site_Web}
                      </a>
                    ) : (
                      "Non spécifié"
                    )}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Commercial</label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {site.E_Mail_Commercial ? (
                      <a href={`mailto:${site.E_Mail_Commercial}`} className="text-blue-600 hover:underline">
                        {site.E_Mail_Commercial}
                      </a>
                    ) : (
                      "Non spécifié"
                    )}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Marketing</label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {site.E_Mail_Marketing ? (
                      <a href={`mailto:${site.E_Mail_Marketing}`} className="text-blue-600 hover:underline">
                        {site.E_Mail_Marketing}
                      </a>
                    ) : (
                      "Non spécifié"
                    )}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Administration</label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {site.E_Mail_Administration ? (
                      <a href={`mailto:${site.E_Mail_Administration}`} className="text-blue-600 hover:underline">
                        {site.E_Mail_Administration}
                      </a>
                    ) : (
                      "Non spécifié"
                    )}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Financier</label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {site.E_Mail_Financier ? (
                      <a href={`mailto:${site.E_Mail_Financier}`} className="text-blue-600 hover:underline">
                        {site.E_Mail_Financier}
                      </a>
                    ) : (
                      "Non spécifié"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres de relance */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
              Paramètres de relance
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Entretien</p>
                <p className="text-xl font-bold text-[#3A90DA]">
                  {site.Nombre_Max_Relance_Entretien || 0}
                </p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Inscription</p>
                <p className="text-xl font-bold text-[#3A90DA]">
                  {site.Nombre_Max_Relance_Inscription || 0}
                </p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Préparation</p>
                <p className="text-xl font-bold text-[#3A90DA]">
                  {site.Nombre_Max_Relance_Preparation || 0}
                </p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Prospect</p>
                <p className="text-xl font-bold text-[#3A90DA]">
                  {site.Nombre_Max_Relance_Propect || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
              Informations système
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Créé par</label>
                <p className="text-gray-900">{site.Utilisateur || "Non spécifié"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Date de création</label>
                <p className="text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(site.Heure)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 