"use client"

import React, { useState } from 'react'
import { GenericDataTable } from '@/components/ui/GenericDataTable'
import { useSuiviProspects } from '@/hooks/useSuiviProspects'
import { AddSuiviProspectDialog } from '@/components/suivi-prospects/AddSuiviProspectDialog'
import { ViewSuiviProspectDialog } from '@/components/suivi-prospects/ViewSuiviProspectDialog'
import { UpdateSuiviProspectDialog } from '@/components/suivi-prospects/UpdateSuiviProspectDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, User, AlertTriangle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { SuiviProspect } from '@/schemas/suiviProspectSchema'
import { createProspectExportConfig, exportGenericData } from '@/lib/exportUtils'

export default function ProspectsPage() {
  const { 
    suiviProspects, 
    isLoading, 
    error, 
    refetch,
    deleteProspect,
    bulkDeleteProspects 
  } = useSuiviProspects()
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [prospectToView, setProspectToView] = useState<SuiviProspect | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [prospectToUpdate, setProspectToUpdate] = useState<SuiviProspect | null>(null)

  // Define columns for the prospects table
  const columns = [
    {
      key: 'Reference',
      label: 'Référence',
      sortable: true,
      filterable: true,
      render: (prospect: SuiviProspect) => (
        <span className="font-mono text-sm font-medium">{prospect.Reference}</span>
      )
    },
    {
      key: 'Libelle',
      label: 'Libellé',
      sortable: true,
      filterable: true,
      render: (prospect: SuiviProspect) => (
        <span className="font-medium">{prospect.Libelle}</span>
      )
    },
    {
      key: 'Relance',
      label: 'Relance',
      sortable: true,
      filterable: true,
      render: (prospect: SuiviProspect) => (
        <div className="flex items-center gap-2">
          {prospect.Relance ? (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Nécessaire
            </Badge>
          ) : (
            <Badge variant="default" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Pas nécessaire    
            </Badge>
          )}
        </div>
      )
    },
  ]

  // Handle actions
  const handleView = (prospect: SuiviProspect) => {
    setProspectToView(prospect)
    setViewDialogOpen(true)
  }

  const handleEdit = (prospect: SuiviProspect) => {
    setProspectToUpdate(prospect)
    setUpdateDialogOpen(true)
  }

  const handleExport = async (format: string, selectedOnly = false) => {
    try {
      const dataToExport = selectedOnly ? suiviProspects : suiviProspects;
      const exportConfig = createProspectExportConfig(dataToExport);
      
      // Map the format to the supported formats
      let exportFormat: 'PDF' | 'Excel' | 'Word';
      switch (format.toLowerCase()) {
        case 'excel':
          exportFormat = 'Excel';
          break;
        case 'word':
          exportFormat = 'Word';
          break;
        case 'pdf':
        default:
          exportFormat = 'PDF';
          break;
      }

      const success = await exportGenericData(
        exportConfig,
        exportFormat
      );

      if (!success) {
        throw new Error(`Échec de l'export en ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Erreur export:', error);
      let errorMessage = "Impossible d'exporter les données";
      
      // Check for specific error messages
      if (error instanceof Error) {
        if (error.message.includes('utilisé par un autre utilisateur') || 
            error.message.includes('being used by another')) {
          errorMessage = "Le fichier est actuellement utilisé par une autre application. Veuillez fermer toute application qui pourrait utiliser ce fichier et réessayer.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`❌ Erreur d'export - ${errorMessage}`, {
        duration: 5000,
        description: "Si le problème persiste, essayez de fermer et rouvrir l'application."
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            size="sm" 
            className="mt-3"
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <GenericDataTable
        data={suiviProspects}
        columns={columns}
        isLoading={isLoading}
        title="Suivi des Operations des Prospects"
        description="Gérez et suivez vos prospects efficacement"
        entityName="Suivi des Operations des Prospects"
        entityNamePlural="Suivi des Operations des Prospects"
        idField="Reference"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={deleteProspect}
        onBulkDelete={bulkDeleteProspects}
        onExport={handleExport}
        addButton={<AddSuiviProspectDialog onSuiviProspectAdded={refetch} />}
      />

      <ViewSuiviProspectDialog
        suiviProspect={prospectToView}
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false)
          setProspectToView(null)
        }}
      />

      <UpdateSuiviProspectDialog
        suiviProspect={prospectToUpdate}
        open={updateDialogOpen}
        onClose={() => {
          setUpdateDialogOpen(false)
          setProspectToUpdate(null)
        }}
        onSuiviProspectUpdated={() => {
          refetch()
          setUpdateDialogOpen(false)
          setProspectToUpdate(null)
        }}
      />
    </div>
  )
} 