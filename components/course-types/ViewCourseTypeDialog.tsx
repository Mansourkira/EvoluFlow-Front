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
import { type CourseType, getPriorityLabel, getPriorityColor, getPriorityIcon, getPriorityBadgeVariant, formatCreationDate } from "@/schemas/courseTypeSchema";
import { 
  BookOpen, 
  User, 
  Mail, 
  Building, 
  Calendar, 
  Flag,
  Hash,
  Tag,
  ArrowDown,
  ArrowUp,
  Minus,
  AlertTriangle,
  HelpCircle
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
                    {courseType.Priorite ? (
                      <Badge 
                        variant={getPriorityBadgeVariant(courseType.Priorite)}
                        className={`${getPriorityColor(courseType.Priorite)} flex items-center gap-2 px-3 py-1.5 border font-medium w-fit`}
                      >
                        {getPriorityIcon(courseType.Priorite) === "ArrowDown" && <ArrowDown className="h-4 w-4" />}
                        {getPriorityIcon(courseType.Priorite) === "Minus" && <Minus className="h-4 w-4" />}
                        {getPriorityIcon(courseType.Priorite) === "ArrowUp" && <ArrowUp className="h-4 w-4" />}
                        {getPriorityIcon(courseType.Priorite) === "AlertTriangle" && <AlertTriangle className="h-4 w-4" />}
                        <span className="text-sm font-semibold">
                          {getPriorityLabel(courseType.Priorite)}
                        </span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 flex items-center gap-2 px-3 py-1.5 w-fit">
                        <HelpCircle className="h-4 w-4" />
                        <span className="text-sm">Non définie</span>
                      </Badge>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-t pt-4">
              <User className="h-4 w-4" />
              Informations Système
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <User className="h-4 w-4" />
                    Créé par
                  </div>
                  <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                    {courseType.Utilisateur || "Non défini"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Date de création
                  </div>
                  <div className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                    {formatCreationDate(courseType.Heure)}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
} 