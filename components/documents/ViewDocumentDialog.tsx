
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Eye,
  MapPin,
  Info,
  CheckCircle,
  Clock,
  DollarSign,
  Layers,
  BookOpen,
  User,
  Calendar,
  StickyNote,
  Hash,
} from "lucide-react";
import { Document } from "@/schemas/documentShema";
import { formatPrice, formatDelay } from "@/schemas/documentShema";
import { useUsers } from "@/hooks/useUsers";

interface ViewDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  document: Document;
}

export function ViewDocumentDialog({ open, onClose, document }: ViewDocumentDialogProps) {
  const { users } = useUsers();


 


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Détails du Document
          </DialogTitle>
          <DialogDescription>
            Informations complètes de <strong>{document.Nom_Document}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Informations Générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Référence :</span>
                <span className="font-medium">{document.Reference}</span>
              </div>
              {document.Reference_Filiere && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Référence Filière :</span>
                  <span className="font-medium">{document.Reference_Filiere}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Nom :</span>
                <span className="font-medium">{document.Nom_Document}</span>
              </div>
              {document.Type && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Type :</span>
                  <span className="font-medium">{document.Type}</span>
                </div>
              )}
              {document.Ordre !== undefined && (
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Ordre :</span>
                  <span className="font-medium">{document.Ordre}</span>
                </div>
              )}
              {document.Observation && (
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-sm text-gray-600">Observation :</span>
                  <span className="font-medium">{document.Observation}</span>
                </div>
              )}
              
            </CardContent>
          </Card>

          {/* Lieu et Traitement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Traitement & Lieu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Lieu d'extraction :</span>
                <span className="font-medium">{document.Lieu_Extraction || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Délai de traitement :</span>
                <span className="font-medium">{formatDelay(document.Delai_Traitement)}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Prix :</span>
                <span className="font-medium">{formatPrice(document.Prix_Traitement)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5" />
                Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant={document.Obligatoire ? "default" : "outline"}>
                {document.Obligatoire ? "Obligatoire" : "Non Obligatoire"}
              </Badge>
              <Badge variant={document.Necessaire_Examen ? "default" : "outline"}>
                {document.Necessaire_Examen ? "Nécessaire pour Examen" : "Pas Nécessaire pour Examen"}
              </Badge>
              <Badge variant={document.Necessaire_Inscription ? "default" : "outline"}>
                {document.Necessaire_Inscription ? "Nécessaire pour Inscription" : "Pas Nécessaire pour Inscription"}
              </Badge>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Utilisateur :</span>
                <span className="font-medium">{document.Utilisateur}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Date/Heure :</span>
                <span className="font-medium">
                  {document.Heure ? new Date(document.Heure).toLocaleString('fr-FR') : '-'}
                </span>
              </div>
              
              
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDocumentDialog;