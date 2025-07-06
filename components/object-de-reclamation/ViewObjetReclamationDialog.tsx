"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";import { ObjetReclamation } from "@/schemas/objetReclamationSchema";
import { CalendarDays, User, AlertTriangle, CheckCircle } from "lucide-react";

interface ViewObjetReclamationDialogProps {
    objetReclamation: ObjetReclamation | null;
  open: boolean;
  onClose: () => void;
}

export function ViewObjetReclamationDialog({ objetReclamation, open, onClose }: ViewObjetReclamationDialogProps) {
  if (!objetReclamation) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Détails de l'objet de réclamation</span>
          </DialogTitle>
          <DialogDescription>
            Informations complètes de l'objet de réclamation sélectionné
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Référence
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="font-mono text-sm">{objetReclamation.Reference}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Libellé
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{objetReclamation.Libelle}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
        
        <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">Informations Système</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Utilisateur
                </label>
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                  <span className="text-sm text-gray-800">{objetReclamation.Utilisateur || "Non spécifié"}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  Date de création
                </label>
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                  <span className="text-sm text-gray-800">
                        {objetReclamation.Heure 
                      ? new Date(objetReclamation.Heure).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "Non spécifiée"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 