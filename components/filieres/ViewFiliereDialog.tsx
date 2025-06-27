"use client";

import { Filiere, formatPrice, formatDelay } from "@/schemas/filiereSchema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Calendar,
  DollarSign,
  Clock,
  User,
  Mail,
  FileText,
  Tag,
} from "lucide-react";

interface ViewFiliereDialogProps {
  filiere: Filiere | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewFiliereDialog({ filiere, open, onOpenChange }: ViewFiliereDialogProps) {
  if (!filiere) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#3A90DA]" />
            Détails de la filière
          </DialogTitle>
          <DialogDescription>
            Informations complètes de la filière "{filiere.Libelle}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Tag className="h-4 w-4" />
                Référence
              </div>
              <div className="text-lg font-semibold">{filiere.Reference}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <GraduationCap className="h-4 w-4" />
                Libellé
              </div>
              <div className="text-lg font-semibold">{filiere.Libelle}</div>
            </div>
          </div>

          {/* Description */}
          {filiere.Description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <FileText className="h-4 w-4" />
                Description
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {filiere.Description}
              </div>
            </div>
          )}

          {/* Financial and Processing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Clock className="h-4 w-4" />
                Délai de traitement
              </div>
              <Badge variant="outline" className="text-sm">
                {formatDelay(filiere.Delai_Max_Traitement_Dossier)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <DollarSign className="h-4 w-4" />
                Prix de traitement
              </div>
              <Badge variant="outline" className="text-sm">
                {formatPrice(filiere.Prix_Traitement_Dossier)}
              </Badge>
            </div>
          </div>

          {/* User Information */}
          {filiere.Nom_Prenom && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <User className="h-4 w-4" />
                Utilisateur responsable
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-[#3A90DA] text-white">
                    {filiere.Nom_Prenom.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{filiere.Nom_Prenom}</div>
                  {filiere.E_mail && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      {filiere.E_mail}
                    </div>
                  )}
                  {filiere.Type_Utilisateur && (
                    <Badge variant="secondary" className="text-xs">
                      {filiere.Type_Utilisateur}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timestamp */}
          {filiere.Heure && (
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Calendar className="h-4 w-4" />
                Date de création
              </div>
              <div className="text-sm text-gray-600">
                {new Date(filiere.Heure).toLocaleString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 