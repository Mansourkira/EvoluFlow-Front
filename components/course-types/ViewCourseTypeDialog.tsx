"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type CourseType, getPriorityLabel, getPriorityColor } from "@/schemas/courseTypeSchema";
import { 
  BookOpen, 
  User, 
  Mail, 
  Building, 
  Calendar, 
  Flag,
  Hash,
  Tag
} from "lucide-react";

interface ViewCourseTypeDialogProps {
  courseType: CourseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewCourseTypeDialog({ 
  courseType, 
  open, 
  onOpenChange 
}: ViewCourseTypeDialogProps) {
  if (!courseType) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#3A90DA]" />
            Détails du Type de Cours
          </DialogTitle>
          <DialogDescription>
            Informations complètes du type de cours "{courseType.Libelle}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Informations de Base
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Hash className="h-4 w-4" />
                    Référence
                  </div>
                  <div className="font-mono text-sm bg-white px-3 py-2 rounded border">
                    {courseType.Reference}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    Libellé
                  </div>
                  <div className="font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                    {courseType.Libelle}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Flag className="h-4 w-4" />
                    Priorité
                  </div>
                  <div>
                    <Badge className={getPriorityColor(courseType.Priorite)}>
                      {getPriorityLabel(courseType.Priorite)}
                    </Badge>
                  </div>
                </div>

                {courseType.Heure && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Dernière Modification
                    </div>
                    <div className="text-sm text-gray-700 bg-white px-3 py-2 rounded border">
                      {new Date(courseType.Heure).toLocaleString('fr-FR')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Information */}
          {courseType.Utilisateur && courseType.Nom_Prenom && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Utilisateur Responsable
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    {courseType.Image ? (
                      <AvatarImage src={courseType.Image} alt={courseType.Nom_Prenom} />
                    ) : null}
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-semibold text-blue-900">{courseType.Nom_Prenom}</h4>
                      <p className="text-sm text-blue-700">{courseType.Type_Utilisateur}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {courseType.E_mail && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-800">{courseType.E_mail}</span>
                        </div>
                      )}
                      
                      {courseType.Site_Defaut && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-800">{courseType.Site_Defaut}</span>
                        </div>
                      )}
                    </div>

                    {courseType.Adresse && (
                      <div className="text-sm text-blue-800">
                        <strong>Adresse:</strong> {courseType.Adresse}
                        {courseType.Ville && `, ${courseType.Ville}`}
                        {courseType.Gouvernorat && `, ${courseType.Gouvernorat}`}
                        {courseType.Pays && `, ${courseType.Pays}`}
                      </div>
                    )}

                    {courseType.Telephone && (
                      <div className="text-sm text-blue-800">
                        <strong>Téléphone:</strong> {courseType.Telephone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No User Assigned */}
          {!courseType.Utilisateur && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Utilisateur Responsable
              </h3>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Aucun utilisateur assigné</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 