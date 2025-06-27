"use client"

import React, { useState } from 'react'
import { GenericDataTable } from '@/components/ui/GenericDataTable'
import { useUsers } from '@/hooks/useAuth'
import { AddUserDialog } from '@/components/users/AddUserDialog'
import { ViewUserDialog } from '@/components/users/ViewUserDialog'
import { UpdateUserDialog } from '@/components/users/UpdateUserDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function UsersPage() {
  const { users, isLoading, error, refetch } = useUsers()
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [userToView, setUserToView] = useState<any>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState<any>(null)

  // Define columns for the users table
  const columns = [
    {
      key: 'avatar',
      label: 'Avatar',
      sortable: false,
      render: (user: any) => (
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image || "/placeholder.jpg"} alt={user.name || "User"} />
          <AvatarFallback>{user.name?.substring(0, 2) || "U"}</AvatarFallback>
        </Avatar>
      )
    },
    {
      key: 'name',
      label: 'Nom',
      sortable: true,
      filterable: true,
      render: (user: any) => <span className="font-medium">{user.name}</span>
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
      render: (user: any) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{user.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = `mailto:${user.email}`}
            className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Envoyer un email"
          >
            <Mail className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    },
    {
      key: 'telephone',
      label: 'Téléphone',
      sortable: true,
      filterable: true,
      render: (user: any) => (
        <div className="flex items-center gap-2">
          {user.telephone ? (
            <>
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-600">{user.telephone}</span>
            </>
          ) : (
            <span className="text-gray-400 italic">Non renseigné</span>
          )}
        </div>
      )
    },
    {
      key: 'adresse',
      label: 'Adresse',
      sortable: true,
      filterable: true,
      render: (user: any) => (
        <div className="flex items-center gap-2">
          {user.adresse ? (
            <>
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-600 truncate max-w-[200px]" title={user.adresse}>
                {user.adresse}
              </span>
            </>
          ) : (
            <span className="text-gray-400 italic">Non renseignée</span>
          )}
        </div>
      )
    },
    {
      key: 'profilLabel',
      label: 'Rôle',
      sortable: true,
      filterable: true,
      render: (user: any) => (
        <Badge
          variant={
            user.profilLabel === "Administratif" 
              ? "default" 
              : user.profilLabel === "Consultant" 
              ? "secondary" 
              : "outline"
          }
          className="font-medium"
        >
          {user.profilLabel}
        </Badge>
      )
    },
    {
      key: 'joinDate',
      label: 'Date d\'Inscription',
      sortable: true,
      filterable: true,
      render: (user: any) => <span className="text-gray-600">{user.joinDate}</span>
    }
  ]

  // Convert user data functions
  const convertToViewUserData = (user: any) => ({
    Reference: user.reference || 'N/A',
    E_mail: user.email,
    Nom_Prenom: user.name,
    Adresse: user.adresse || 'N/A',
    Complement_adresse: user.complement_adresse || '',
    Code_Postal: user.code_postal || 'N/A', 
    Ville: user.ville || 'N/A',
    Gouvernorat: user.gouvernorat || 'N/A',
    Pays: user.pays || 'Tunisie',
    Telephone: user.telephone || 'N/A',
    Type_Utilisateur: user.profilLabel || 'N/A',
    Mot_de_passe: '123456',
    Site_Defaut: user.site_defaut || 'N/A',
    Profil: user.profil || 'N/A',
    Profil_Libelle: user.profilLabel || '',
    Heure: user.heure || '',
    Temp_Raffraichissement: user.temp_raffraichissement || '',
    Couleur: user.couleur || '',
    Image: user.image || null
  })

  const convertToUpdateUserData = (user: any) => ({
    Reference: user.reference || '',
    E_mail: user.email,
    Nom_Prenom: user.name,
    Adresse: user.adresse || '',
    Complement_adresse: user.complement_adresse || '',
    Code_Postal: user.code_postal || '',
    Ville: user.ville || '',
    Gouvernorat: user.gouvernorat || '',
    Pays: user.pays || 'Tunisie',
    Telephone: user.telephone || '',
    Type_Utilisateur: user.profilLabel || '',
    Site_Defaut: user.site_defaut || '',
    Profil: user.profil || '',
    Profil_Libelle: user.profilLabel || '',
    Image: user.image || null
  })

  // Handle actions
  const handleView = (user: any) => {
    setUserToView(convertToViewUserData(user))
    setViewDialogOpen(true)
  }

  const handleEdit = (user: any) => {
    setUserToUpdate(convertToUpdateUserData(user))
    setUpdateDialogOpen(true)
  }

  const handleDelete = async (userEmail: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté')
        return
      }

      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ E_mail: userEmail }),
      })

      if (response.ok) {
        const deletedUser = users.find(user => user.email === userEmail)
        toast.success(`✅ Utilisateur supprimé - ${deletedUser?.name || userEmail} a été supprimé avec succès`)
        refetch()
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(`❌ Erreur de suppression - ${errorData.error || errorData.message || 'Impossible de supprimer l\'utilisateur'}`)
      }
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error)
      toast.error('❌ Erreur de connexion - Impossible de contacter le serveur')
    }
  }

  const handleBulkDelete = async (userEmails: string[]) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté')
        return
      }

      let successCount = 0
      let failureCount = 0

      for (const userEmail of userEmails) {
        try {
          const response = await fetch('/api/users/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ E_mail: userEmail }),
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
        toast.success(`✅ Suppression en lot réussie - ${successCount} utilisateur(s) supprimé(s)`)
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
    // TODO: Implement export functionality
    try {
      const { exportAllUsers } = await import('@/lib/exportUtils')
      const dataToExport = selectedOnly ? 
        users.filter(user => user.email) : // This would need to be filtered by selected items
        users
      
      await exportAllUsers(dataToExport, format as 'PDF' | 'Excel' | 'Word')
      toast.success(`📄 Export réussi - ${dataToExport.length} utilisateur(s) exporté(s) en ${format}`)
    } catch (error) {
      console.error('Erreur export:', error)
      toast.error(`❌ Erreur d'export - ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  return (
    <>
      <GenericDataTable
        data={users}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        title="Gestion des Utilisateurs"
        description="Gérez vos utilisateurs et leurs permissions"
        entityName="utilisateur"
        entityNamePlural="utilisateurs"
        columns={columns}
        idField="email"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
        addButton={<AddUserDialog onUserAdded={refetch} />}
      />

      {/* View User Dialog */}
      <ViewUserDialog 
        user={userToView}
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open)
          if (!open) {
            setUserToView(null)
          }
        }}
      />

      {/* Update User Dialog */}
      {userToUpdate && (
        <UpdateUserDialog
          user={userToUpdate}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onUserUpdated={() => {
            refetch()
            setUpdateDialogOpen(false)
            setUserToUpdate(null)
          }}
        />
      )}
    </>
  )
} 