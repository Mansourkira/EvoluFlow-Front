"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ViewUserData } from "@/schemas/userSchema";
import { 
  Eye, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Building, 
  Key,
  Hash,
  Globe,
  Camera,
  
  ImageIcon
} from "lucide-react";

interface ViewUserDialogProps {
  user: ViewUserData;
  trigger?: React.ReactNode;
}

export function ViewUserDialog({ user, trigger }: ViewUserDialogProps) {
  const getUserTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'admission':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'consultant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'user':
      case 'utilisateur':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'admin':
        return 'Admin';
      case 'admission':
        return 'Utilisateur avec pouvoir';
      case 'manager':
        return 'Manager';
      case 'consultant':
        return 'Consultant';
      case 'user':
      case 'utilisateur':
        return 'Utilisateur';
      default:
        return type || 'Non défini';
    }
  };

  const getProfileColor = (profil: string) => {
    switch (profil) {
      case '99':
        return 'bg-red-100 text-red-800 border-red-200';
      case '1':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case '2':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '3':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProfileLabel = (profil: string) => {
    switch (profil) {
      case '99':
        return 'Super Admin';
      case '1':
        return 'Admin';
      case '2':
        return 'Manager';
      case '3':
        return 'Utilisateur';
      case '4':
        return 'Invité';
      default:
        return `Profil ${profil}`;
    }
  };

  // Add debugging
  console.log("ViewUserDialog - User data:", {
    name: user.Nom_Prenom,
    email: user.E_mail,
    hasImage: !!user.Image,
    imageType: typeof user.Image,
    imagePreview: user.Image ? user.Image.substring(0, 50) + '...' : 'null'
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Voir Détails
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Détails de l'Utilisateur
          </DialogTitle>
          <DialogDescription>
            Informations complètes de l'utilisateur {user.Nom_Prenom}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
              <strong>Debug:</strong> Image data: {user.Image ? 'Present' : 'Missing'} 
              {user.Image && ` (${user.Image.length} chars)`}
            </div>
          )}

          {/* Header with Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage 
                  src={user.Image || undefined} 
                  alt={user.Nom_Prenom}
                  className="object-cover"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    console.error('Image src:', user.Image);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully');
                  }}
                />
                <AvatarFallback className="text-3xl font-semibold bg-blue-100 text-blue-700">
                  {user.Nom_Prenom?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              {user.Image ? (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo de profil
                </div>
              ) : (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Pas de photo
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.Nom_Prenom}</h2>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user.E_mail}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getUserTypeColor(user.Type_Utilisateur)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {getUserTypeLabel(user.Type_Utilisateur)}
                </Badge>
                <Badge variant="outline" className={getProfileColor(user.Profil)}>
                  <Hash className="h-3 w-3 mr-1" />
                  {getProfileLabel(user.Profil)}
                </Badge>
              </div>
            </div>
          </div>

        

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4" />
              Informations Personnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Référence
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <Hash className="h-4 w-4 text-gray-400" />
                    {user.Reference}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Nom d'utilisateur
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    {user.Nom_Prenom}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {user.E_mail}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Téléphone
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {user.Telephone || 'Non renseigné'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Type d'utilisateur
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4 text-gray-400" />
                    {user.Type_Utilisateur || 'Non défini'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Date de création
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <Hash className="h-4 w-4 text-gray-400" />
                    {user.Heure ? new Date(user.Heure).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Informations d'Adresse
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Adresse principale
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {user.Adresse || 'Non renseignée'}
                  </p>
                </div>

                {user.Complement_adresse && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Complément d'adresse
                    </label>
                    <p className="text-gray-900 font-medium mt-1">
                      {user.Complement_adresse}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Code Postal
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {user.Code_Postal || 'Non renseigné'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Ville
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {user.Ville || 'Non renseignée'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Gouvernorat
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {user.Gouvernorat || 'Non renseigné'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Pays
                  </label>
                  <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                    <Globe className="h-4 w-4 text-gray-400" />
                    {user.Pays || 'Non renseigné'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* System Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Informations Système
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Type d'utilisateur
                </label>
                <div className="mt-2">
                  <Badge className={getUserTypeColor(user.Type_Utilisateur)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {getUserTypeLabel(user.Type_Utilisateur)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Site par défaut
                </label>
                <p className="text-gray-900 font-medium flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4 text-gray-400" />
                  {user.Site_Defaut || 'Non défini'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Profil
                </label>
                <div className="mt-2">
                  <Badge className={getProfileColor(user.Profil)}>
                    <Hash className="h-3 w-3 mr-1" />
                    {user.Profil_Libelle || getProfileLabel(user.Profil)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Additional system info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {user.Temp_Raffraichissement && (
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Temps de rafraîchissement
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {user.Temp_Raffraichissement} secondes
                  </p>
                </div>
              )}

              {user.Couleur && (
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Couleur de thème
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded border border-gray-300" 
                      style={{ backgroundColor: user.Couleur }}
                    ></div>
                    <p className="text-gray-900 font-medium">
                      {user.Couleur}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Security Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Informations de Sécurité
            </h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Key className="h-4 w-4" />
                <span className="font-medium">Mot de passe</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Mot de passe: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">
                  {'•••••••'}
                </span>
              </p>
              <p className="text-yellow-600 text-xs mt-2">
                ⚠️ Le mot de passe par défaut doit être changé lors de la première connexion
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 