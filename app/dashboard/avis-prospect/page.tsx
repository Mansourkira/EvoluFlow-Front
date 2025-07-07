"use client"

import React, { useState, useEffect } from 'react'
import { GenericDataTable } from '@/components/ui/GenericDataTable'
import { useAvisProspect } from '@/hooks/useAvisProspect'
import { AddAvisProspectDialog } from '@/components/avis-prospect/AddAvisProspectDialog'
import { ViewAvisProspectDialog } from '@/components/avis-prospect/ViewAvisProspectDialog'
import { UpdateAvisProspectDialog } from '@/components/avis-prospect/UpdateAvisProspectDialog'
import { Button } from '@/components/ui/button'
import { CalendarDays, User, PlusCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { AvisProspect, UpdateAvisProspectFormData } from '@/schemas/avisProspectSchema'

export default function AvisProspectPage() {
  const { 
    avisProspects, 
    isLoading, 
    error, 
    fetchAvisProspects,
    deleteAvisProspect,
  } = useAvisProspect()
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [documentToView, setDocumentToView] = useState<AvisProspect | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [documentToUpdate, setDocumentToUpdate] = useState<UpdateAvisProspectFormData | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedAvisProspects, setSelectedAvisProspects] = useState<string[]>([])

  // Fetch data when component mounts
  useEffect(() => {
    fetchAvisProspects()
  }, [fetchAvisProspects])

  // Define columns for the type document identity table
  const columns = [
    {
      key: 'Reference',
      label: 'Référence',
      sortable: true,
      filterable: true,
          render: (document: AvisProspect) => (
        <span className="font-mono text-sm font-medium">{document.Reference}</span>
      )
    },
    {
      key: 'Libelle',
      label: 'Libellé',
      sortable: true,
      filterable: true,
        render: (document: AvisProspect) => (
        <span className="font-medium">{document.Libelle}</span>
      )
    },
    
    {
      key: 'Heure',
      label: 'Date de Creation',
      sortable: true,
      filterable: true,
      icon: CalendarDays,
      render: (document: AvisProspect) => (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <span>
            {document.Heure 
              ? new Date(document.Heure).toLocaleString('fr-FR', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })
              : 'N/A'
            }
          </span>
        </div>
      )
    }
  ]

  // Handle actions
  const handleView = (document: AvisProspect) => {
    setDocumentToView(document)
    setViewDialogOpen(true)
  }

  const handleEdit = (document: AvisProspect) => {
    setDocumentToUpdate({
      Reference: document.Reference,
      Libelle: document.Libelle
    })
    setUpdateDialogOpen(true)
  }

  const handleDelete = async (reference: string) => {
    try {
      const document = avisProspects.find(doc => doc.Reference === reference)
      if (!document) return
      
      await deleteAvisProspect(reference)
      fetchAvisProspects()
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error("Erreur lors de la suppression du document")
    }
  }

  const handleExport = async (format: string, selectedOnly = false) => {
    try {
      const { exportGenericData, createAvisProspectExportConfig } = await import('@/lib/exportUtils')
      const dataToExport = selectedOnly ? 
        avisProspects.filter(avis => selectedAvisProspects.includes(avis.Reference)) : 
        avisProspects
      
      const config = createAvisProspectExportConfig(dataToExport)
      await exportGenericData(config, format as 'PDF' | 'Excel' | 'Word')
      toast.success(`📄 Export réussi - ${dataToExport.length} avis prospect(s) exporté(s) en ${format}`)
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error(`❌ Erreur d'export - ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <Button 
            onClick={() => fetchAvisProspects()} 
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
// 
             
  return (
    <div className="container mx-auto p-6 space-y-6">
      <GenericDataTable
        data={avisProspects}
        columns={columns}
        isLoading={isLoading}
        title="Avis Prospects"
        description="Gérez les Avis Prospects"
        entityName="Avis Prospect"
        entityNamePlural="Avis Prospects"
        idField="Reference"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        selectedItems={selectedAvisProspects}
        onSelectedItemsChange={setSelectedAvisProspects}
        addButton={
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter Avis Prospect
          </Button>
        }
        refreshButton={
            <Button onClick={() => fetchAvisProspects()} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        }
        />

      <AddAvisProspectDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAvisProspectAdded={fetchAvisProspects}
      />

      <ViewAvisProspectDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        avisProspect={documentToView}
        onAvisProspectUpdated={fetchAvisProspects}
        onAvisProspectDeleted={fetchAvisProspects}
      />

      <UpdateAvisProspectDialog
        open={updateDialogOpen}
        avisProspectData={documentToUpdate}
        onOpenChange={setUpdateDialogOpen}
        onAvisProspectUpdated={fetchAvisProspects}
      />
    </div>
  )
}