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

        </div>
      </DialogContent>
    </Dialog>
  );
} 