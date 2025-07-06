"use client"

import React, { useState } from 'react'
import { GenericDataTable } from '@/components/ui/data-table/GenericDataTable'
import { AlertTriangle, CheckCircle, CalendarDays, User } from 'lucide-react'
import { toast } from 'sonner'
import { useObjetReclamation } from '@/hooks/useObjetReclamation'
import { ObjetReclamationFormValues } from '@/schemas/objetReclamationSchema'
import { AddObjetReclamationDialog } from '@/components/object-de-reclamation/AddObjetReclamationDialog'
import { UpdateObjetReclamationDialog } from '@/components/object-de-reclamation/UpdateObjetReclamationDialog'
import { ViewObjetReclamationDialog } from '@/components/object-de-reclamation/ViewObjetReclamationDialog'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { createObjetReclamationExportConfig, exportGenericData } from '@/lib/exportUtils'
import { DataTableConfig } from '@/components/ui/data-table/DataTableConfig'
import { Button } from '@/components/ui/button'

interface ObjetReclamation {
  Reference: string;
  Libelle: string;
  Utilisateur: string;
  Heure: string;
}

export default function ObjectDeReclamationPage() {
  const { 
    objetReclamations, 
    loading,
    createObjetReclamation,
    updateObjetReclamation,
    deleteObjetReclamation,
    fetchObjetReclamations
  } = useObjetReclamation()
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [objetReclamationToView, setObjetReclamationToView] = useState<ObjetReclamation | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [objetReclamationToUpdate, setObjetReclamationToUpdate] = useState<ObjetReclamation | null>(null)

  // Define columns for the table
  const columns = [
    {
      key: 'Reference',
      label: 'Référence',
      sortable: true,
      filterable: true,
      render: (item: ObjetReclamation) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">{item.Reference}</span>
        </div>
      )
    },
    {
      key: 'Libelle',
      label: 'Libellé',
      sortable: true,
      filterable: true,
      render: (item: ObjetReclamation) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.Libelle}</span>
        </div>
      )
    },
 
    {
      key: 'Heure',
      label: 'Date et heure',
      sortable: true,
      filterable: true,
      render: (item: ObjetReclamation) => (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <span className="font-medium">
            {format(new Date(item.Heure), "PPpp", { locale: fr })}
          </span>
        </div>
      )
    }
  ]

  const handleExport = async (format: string, selectedData?: ObjetReclamation[]) => {
    try {
      const dataToExport = selectedData || objetReclamations;
      const exportConfig = createObjetReclamationExportConfig(dataToExport);
      
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

      toast.success(`✅ Export en ${format.toUpperCase()} réussi`);
    } catch (error) {
      console.error('Erreur export:', error);
      let errorMessage = "Impossible d'exporter les données";
      
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

  // Handle actions
  const handleView = (objetReclamation: ObjetReclamation) => {
    setObjetReclamationToView(objetReclamation)
    setViewDialogOpen(true)
  }

  const handleEdit = (objetReclamation: ObjetReclamation) => {
    setObjetReclamationToUpdate(objetReclamation)
    setUpdateDialogOpen(true)
  }

  const handleDelete = async (reference: string) => {
    try {
      await deleteObjetReclamation(reference)
      toast.success('Objet de réclamation supprimé avec succès')
      fetchObjetReclamations()
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'objet de réclamation")
      console.error("Error deleting objet de reclamation:", error)
    }
  }

  const handleBulkDelete = async (references: string[]) => {
    try {
      const promises = references.map(ref => deleteObjetReclamation(ref));
      await Promise.all(promises);
      toast.success('Objets de réclamation supprimés avec succès');
      fetchObjetReclamations();
    } catch (error) {
      toast.error("Erreur lors de la suppression des objets de réclamation");
      console.error("Error deleting objets de reclamation:", error);
    }
  }

  const tableConfig: DataTableConfig<ObjetReclamation> = {
    data: objetReclamations,
    columns: columns,
    isLoading: loading,
    title: "Objets de Réclamation",
    description: "Gérez et suivez vos objets de réclamation efficacement",
    entityName: "Objet de Réclamation",
    entityNamePlural: "Objets de Réclamation",
    getItemId: (item: ObjetReclamation) => item.Reference,
    getItemDisplayName: (item: ObjetReclamation) => `${item.Reference} - ${item.Libelle}`,
    enableSearch: true,
    enableAdvancedFilters: true,
    enableBulkSelect: true,
    enableColumnToggle: true,
    enableRefresh: true,
    enableExport: true,
    exportConfig: {
      formats: ['PDF', 'Excel', 'Word']
    },
    onDelete: handleDelete,
    onBulkDelete: handleBulkDelete,
    onExport: handleExport,
    refetch: fetchObjetReclamations,
    actions: [
      {
        key: 'view',
        label: 'Voir les détails',
        icon: CheckCircle,
        onClick: (item: ObjetReclamation) => handleView(item),
        variant: 'ghost'
      },
      {
        key: 'edit',
        label: 'Modifier',
        icon: AlertTriangle,
        onClick: (item: ObjetReclamation) => handleEdit(item),
        variant: 'ghost'
      }
    ]
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <GenericDataTable<ObjetReclamation>
        config={tableConfig}
        addDialog={
          <AddObjetReclamationDialog 
            onObjetReclamationAdded={() => {
              fetchObjetReclamations()
              setViewDialogOpen(false)
              setObjetReclamationToView(null)
            }} 
          />
        }
      />

      {objetReclamationToView && (
        <ViewObjetReclamationDialog
          objetReclamation={objetReclamationToView}
          open={viewDialogOpen}
          onClose={() => {
            setViewDialogOpen(false)
            setObjetReclamationToView(null)
          }}
        />
      )}

      {objetReclamationToUpdate && (
        <UpdateObjetReclamationDialog
          objetReclamation={objetReclamationToUpdate}
          open={updateDialogOpen}
          onClose={() => {
            setUpdateDialogOpen(false)
            setObjetReclamationToUpdate(null)
          }}
          onSubmit={updateObjetReclamation}
          onObjetReclamationUpdated={() => {
            fetchObjetReclamations()
            setUpdateDialogOpen(false)
            setObjetReclamationToUpdate(null)
          }}
        />
      )}
    </div>
  )
} 