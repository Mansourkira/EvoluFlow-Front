"use client"

import React, { useState } from 'react'
import { GenericDataTable } from '@/components/ui/GenericDataTable'
import { useSituations } from '@/hooks/useSituations'
import { AddSituationDialog } from '@/components/situations/AddSituationDialog'
import { ViewSituationDialog } from '@/components/situations/ViewSituationDialog'
import { UpdateSituationDialog } from '@/components/situations/UpdateSituationDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Calendar, Hash } from 'lucide-react'
import { toast } from 'sonner'

export default function SituationsPage() {
  const { situations, isLoading, error, refetch } = useSituations()
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [situationToView, setSituationToView] = useState<any>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [situationToUpdate, setSituationToUpdate] = useState<any>(null)

  // Define columns for the situations table
  const columns = [
    {
      key: 'Reference',
      label: 'Référence',
      sortable: true,
      filterable: true,
      render: (situation: any) => (
        <div className="flex items-center gap-2">
          <Hash className="h-3.5 w-3.5 text-gray-400" />
          <span className="font-medium">{situation.Reference}</span>
        </div>
      )
    },
    {
      key: 'Libelle',
      label: 'Libellé',
      sortable: true,
      filterable: true,
      render: (situation: any) => <span className="font-medium">{situation.Libelle}</span>
    },
    {
      key: 'Nom_Prenom',
      label: 'Utilisateur Assigné',
      sortable: true,
      filterable: true,
      render: (situation: any) => (
        <div className="flex items-center gap-2">
          {situation.Nom_Prenom ? (
            <>
              <User className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-600">{situation.Nom_Prenom}</span>
            </>
          ) : (
            <span className="text-gray-400 italic">Non assigné</span>
          )}
        </div>
      )
    },
    {
      key: 'E_mail',
      label: 'Email Utilisateur',
      sortable: true,
      filterable: true,
      render: (situation: any) => (
        <div className="flex items-center gap-2">
          {situation.E_mail ? (
            <span className="text-gray-600">{situation.E_mail}</span>
          ) : (
            <span className="text-gray-400 italic">-</span>
          )}
        </div>
      )
    },
    {
      key: 'Type_Utilisateur',
      label: 'Type Utilisateur',
      sortable: true,
      filterable: true,
      render: (situation: any) => (
        situation.Type_Utilisateur ? (
          <Badge
            variant={
              situation.Type_Utilisateur === "Administratif" 
                ? "default" 
                : situation.Type_Utilisateur === "Consultant" 
                ? "secondary" 
                : "outline"
            }
            className="font-medium"
          >
            {situation.Type_Utilisateur}
          </Badge>
        ) : (
          <span className="text-gray-400 italic">-</span>
        )
      )
    },
    {
      key: 'Site_Defaut',
      label: 'Site par Défaut',
      sortable: true,
      filterable: true,
      render: (situation: any) => (
        <span className="text-gray-600">{situation.Site_Defaut || '-'}</span>
      )
    },
    {
      key: 'Heure',
      label: 'Date de Création',
      sortable: true,
      filterable: true,
      render: (situation: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-gray-600">
            {situation.Heure ? new Date(situation.Heure).toLocaleDateString('fr-FR') : 'N/A'}
          </span>
        </div>
      )
    }
  ]

  // Convert situation data functions
  const convertToViewSituationData = (situation: any) => ({
    Reference: situation.Reference || 'N/A',
    Libelle: situation.Libelle || 'N/A',
    Utilisateur: situation.Utilisateur || 'N/A',
    Nom_Prenom: situation.Nom_Prenom || 'Non assigné',
    E_mail: situation.E_mail || 'N/A',
    Profil: situation.Profil || 'N/A',
    Type_Utilisateur: situation.Type_Utilisateur || 'N/A',
    Site_Defaut: situation.Site_Defaut || 'N/A',
    Heure: situation.Heure ? new Date(situation.Heure).toLocaleString('fr-FR') : 'N/A'
  })

  const convertToUpdateSituationData = (situation: any) => ({
    Reference: situation.Reference || '',
    Libelle: situation.Libelle || '',
    Utilisateur: situation.Utilisateur || ''
  })

  // Handle actions
  const handleView = (situation: any) => {
    setSituationToView(convertToViewSituationData(situation))
    setViewDialogOpen(true)
  }

  const handleEdit = (situation: any) => {
    setSituationToUpdate(convertToUpdateSituationData(situation))
    setUpdateDialogOpen(true)
  }

  const handleDelete = async (situationRef: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté')
        return
      }

      const response = await fetch('http://localhost:3000/api/v1/situations/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ Reference: situationRef }),
      })

      if (response.ok) {
        const deletedSituation = situations.find(situation => situation.Reference === situationRef)
        toast.success(`✅ Situation supprimée - ${deletedSituation?.Libelle || situationRef} a été supprimée avec succès`)
        refetch()
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(`❌ Erreur de suppression - ${errorData.error || errorData.message || 'Impossible de supprimer la situation'}`)
      }
    } catch (error) {
      console.error('Erreur suppression situation:', error)
      toast.error('❌ Erreur de connexion - Impossible de contacter le serveur')
    }
  }

  const handleBulkDelete = async (situationRefs: string[]) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté')
        return
      }

      let successCount = 0
      let failureCount = 0

      for (const situationRef of situationRefs) {
        try {
          const response = await fetch('http://localhost:3000/api/v1/situations/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ Reference: situationRef }),
          })

          if (response.ok) {
            successCount++
          } else {
            failureCount++
          }
        } catch (error) {
          failureCount++
        }
      }

      if (successCount > 0 && failureCount === 0) {
        toast.success(`✅ Suppression en lot réussie - ${successCount} situation(s) supprimée(s)`)
      } else if (successCount > 0 && failureCount > 0) {
        toast.warning(`⚠️ Suppression partielle - ${successCount} réussi(s), ${failureCount} échec(s)`)
      } else {
        toast.error(`❌ Échec de la suppression en lot`)
      }
      
      refetch()
    } catch (error) {
      console.error('Erreur suppression en lot:', error)
      toast.error('❌ Erreur de suppression en lot')
    }
  }

  const handleExport = async (format: string, selectedOnly = false) => {
    try {
      const { exportAllSituations } = await import('@/lib/exportUtils')
      const dataToExport = selectedOnly ? 
        situations.filter(situation => situation.Reference) : 
        situations
      
      await exportAllSituations(dataToExport, format as 'PDF' | 'Excel' | 'Word')
      toast.success(`📄 Export réussi - ${dataToExport.length} situation(s) exportée(s) en ${format}`)
    } catch (error) {
      console.error('Erreur export:', error)
      toast.error(`❌ Erreur d'export - ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  return (
    <>
      <GenericDataTable
        data={situations}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        title="Gestion des Situations"
        description="Gérez les situations et leurs assignations"
        entityName="situation"
        entityNamePlural="situations"
        columns={columns}
        idField="Reference"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
        addButton={<AddSituationDialog onSituationAdded={refetch} />}
      />

      {/* View Situation Dialog */}
      <ViewSituationDialog 
        situation={situationToView}
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open)
          if (!open) {
            setSituationToView(null)
          }
        }}
      />

      {/* Update Situation Dialog */}
      {situationToUpdate && (
        <UpdateSituationDialog
          situation={situationToUpdate}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onSituationUpdated={() => {
            refetch()
            setUpdateDialogOpen(false)
            setSituationToUpdate(null)
          }}
        />
      )}
    </>
  )
} 