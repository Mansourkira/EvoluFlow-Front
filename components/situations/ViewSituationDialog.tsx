"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Hash, Calendar, User } from "lucide-react"
  import { Situation } from "@/schemas/situationSchema"
import { useSituations } from "@/hooks/useSituations"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

interface ViewSituationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  situation: Situation;
}

export function ViewSituationDialog({ 
  open,
  onOpenChange,
  situation 
}: ViewSituationDialogProps) {
  const { getSituationByReference, isLoading } = useSituations();
  const { toast } = useToast();

  useEffect(() => {
    if (situation) {
      getSituationByReference(situation.Reference)
    }
  }, [situation, getSituationByReference])

      return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Détails de la situation
          </DialogTitle>
          <DialogDescription>
            Informations détaillées de la situation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Main Information */}
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold mb-2">Informations principales</h3>
              <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                <span className="text-sm font-medium text-gray-500">Référence:</span>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{situation.Reference}</span>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2 items-center mt-2">
                <span className="text-sm font-medium text-gray-500">Libellé:</span>
                <span>{situation.Libelle}</span>
              </div>
            </div>
          </div>

      
          {/* Informations système */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Informations système</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Utilisateur</label>
                <div className="mt-1 flex items-center gap-1">
                  <User className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">{situation.Utilisateur || "Non défini"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date de création</label>
                <div className="mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">{situation.Heure ? new Date(situation.Heure).toLocaleString('fr-FR') : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 