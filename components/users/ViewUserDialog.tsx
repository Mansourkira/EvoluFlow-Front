"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Shield, 
  Clock, 
  Eye,
  Calendar,
  Heart,
  Home,
  Globe,
  IdCard,
  Settings
} from "lucide-react";
import type { ViewUserData } from "@/schemas/userSchema";

interface ViewUserDialogProps {
  user: ViewUserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserDialog({ user, open, onOpenChange }: ViewUserDialogProps) {
  const [fullUserData, setFullUserData] = useState<ViewUserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch complete user data when dialog opens
  useEffect(() => {
    const fetchUserData = async () => {
      if (!open || !user?.E_mail) return;

      setIsLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseUrl}/api/v1/user`, {
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
        } else {
          setFullUserData(user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setFullUserData(user);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [open, user]);

  const displayUser = fullUserData || user;

  if (!displayUser) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Détails de l'Utilisateur
          </DialogTitle>
          <DialogDescription>
            Informations complètes de {displayUser.Nom_Prenom}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Avatar and Basic Info */}
            <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={displayUser.Image || undefined} alt={displayUser.Nom_Prenom} />
                <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-700">
                  {displayUser.Nom_Prenom?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{displayUser.Nom_Prenom}</h2>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {displayUser.E_mail}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="default" className="gap-1">
                    <Shield className="h-3 w-3" />
                    {displayUser.Profil_Libelle || displayUser.Profil}
                  </Badge>
                 
                  {displayUser.Sexe && (
                    <Badge variant="outline" className="gap-1">
                      <Heart className="h-3 w-3" />
                      {displayUser.Sexe}
                    </Badge>
                  )}
                  {displayUser.Etat_Civil && (
                    <Badge variant="outline" className="gap-1">
                      <Heart className="h-3 w-3" />
                      {displayUser.Etat_Civil}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <IdCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Référence</p>
                        <p className="font-medium">{displayUser.Reference}</p>
                      </div>
                    </div>

                    {displayUser.Telephone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Téléphone</p>
                          <p className="font-medium">{displayUser.Telephone}</p>
                        </div>
                      </div>
                    )}

                    {displayUser.Sexe && (
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Sexe</p>
                          <p className="font-medium">{displayUser.Sexe}</p>
                        </div>
                      </div>
                    )}

                    {displayUser.Etat_Civil && (
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">État Civil</p>
                          <p className="font-medium">{displayUser.Etat_Civil}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Adresse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayUser.Adresse ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Home className="h-4 w-4 text-gray-500 mt-1" />
                        <div className="space-y-1">
                          <p className="font-medium">{displayUser.Adresse}</p>
                          {displayUser.Complement_adresse && (
                            <p className="text-sm text-gray-600">{displayUser.Complement_adresse}</p>
                          )}
                          <div className="text-sm text-gray-600">
                            {displayUser.Code_Postal && <span>{displayUser.Code_Postal} </span>}
                            {displayUser.Ville && <span>{displayUser.Ville}</span>}
                          </div>
                          {displayUser.Gouvernorat && (
                            <p className="text-sm text-gray-600">{displayUser.Gouvernorat}</p>
                          )}
                          {displayUser.Pays && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3 text-gray-500" />
                              <span className="text-sm text-gray-600">{displayUser.Pays}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Aucune adresse renseignée</p>
                  )}
                </CardContent>
              </Card>

              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    Informations Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Site par défaut</p>
                        <p className="font-medium">{displayUser.Site_Defaut || 'Non défini'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Profil</p>
                        <p className="font-medium">
                          {displayUser.Profil_Libelle || displayUser.Profil}
                          {displayUser.Profil_Libelle && (
                            <span className="text-sm text-gray-500 ml-2">({displayUser.Profil})</span>
                          )}
                        </p>
                      </div>
                    </div>

                  
                  </div>
                </CardContent>
              </Card>

              {/* Security Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5" />
                    Informations de Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {displayUser.Utilisateur && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Créé par</p>
                          <p className="font-medium">{displayUser.Utilisateur}</p>
                        </div>
                      </div>
                    )}

                    {displayUser.Heure && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date de création</p>
                          <p className="font-medium">
                            {new Date(displayUser.Heure).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {displayUser.Derniere_connexion && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Dernière connexion</p>
                          <p className="font-medium">
                            {new Date(displayUser.Derniere_connexion).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {displayUser.Reinitialisation_mot_de_passe && (
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium text-amber-600">Statut mot de passe</p>
                          <Badge variant="outline" className="text-amber-600 border-amber-200">
                            Réinitialisation requise
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    Préférences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {displayUser.Couleur && (
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-4 w-4 rounded border border-gray-300"
                          style={{ backgroundColor: displayUser.Couleur }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Couleur du thème</p>
                          <p className="font-medium">{displayUser.Couleur}</p>
                        </div>
                      </div>
                    )}

                    {displayUser.Temp_Raffraichissement && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Temps de rafraîchissement</p>
                          <p className="font-medium">{displayUser.Temp_Raffraichissement}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 