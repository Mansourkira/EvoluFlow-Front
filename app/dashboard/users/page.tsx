"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Mail,
  FileText,
  FileSpreadsheet,
  Filter,
  RefreshCw,
  X,
  Users2,
  Send,
  Columns,
  Phone,
  MapPin,
} from "lucide-react"
import { useUsers } from "@/hooks/useAuth"
import { AddUserDialog } from "@/components/AddUserDialog"
import { ViewUserDialog } from "@/components/ViewUserDialog"
import { UpdateUserDialog } from "@/components/UpdateUserDialog"
import { ViewUserData } from "@/schemas/userSchema"

// Types de tri
type SortField = 'name' | 'email' | 'role' | 'joinDate' | 'telephone' | 'adresse'
type SortDirection = 'asc' | 'desc' | null

// Types pour la visibilité des colonnes
interface ColumnVisibility {
  avatar: boolean
  name: boolean
  email: boolean
  role: boolean
  joinDate: boolean
  telephone: boolean
  adresse: boolean
}

// Types pour les filtres par champ
interface FieldFilters {
  name: string
  email: string
  telephone: string
  adresse: string
  role: string
  joinDate: string
}

export default function UsersPage() {
  // Utilisation du hook personnalisé pour récupérer les utilisateurs depuis l'API
  const { users, isLoading, error, refetch } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Update dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState<any>(null)
  
  // État du tri
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  
  // État de sélection en lot
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const selectAllRef = useRef<HTMLButtonElement>(null)
  
  // État de visibilité des colonnes
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    avatar: true,
    name: true,
    email: true,
    role: true,
    joinDate: true,
    telephone: true,
    adresse: true,
  })
  
  // État des filtres par champ
  const [fieldFilters, setFieldFilters] = useState<FieldFilters>({
    name: '',
    email: '',
    telephone: '',
    adresse: '',
    role: 'all',
    joinDate: ''
  })
  
  // État pour afficher/masquer les filtres avancés
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Fonction pour mettre à jour un filtre de champ spécifique
  const updateFieldFilter = (field: keyof FieldFilters, value: string) => {
    setFieldFilters(prev => ({
      ...prev,
      [field]: value
    }))
    // Reset to page 1 when filter changes
    setCurrentPage(1)
  }

  // Fonction pour effacer tous les filtres
  const clearAllFilters = () => {
    setSearchTerm('')
    setRoleFilter('all')
    setFieldFilters({
      name: '',
      email: '',
      telephone: '',
      adresse: '',
      role: 'all',
      joinDate: ''
    })
    setCurrentPage(1)
  }

  // Fonction pour compter les filtres actifs
  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm) count++
    if (roleFilter !== 'all') count++
    if (fieldFilters.name) count++
    if (fieldFilters.email) count++
    if (fieldFilters.telephone) count++
    if (fieldFilters.adresse) count++
    if (fieldFilters.role !== 'all' && fieldFilters.role !== roleFilter) count++
    if (fieldFilters.joinDate) count++
    return count
  }

  // Fonction pour basculer la visibilité d'une colonne
  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  // Fonction pour changer le nombre d'éléments par page
  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value)
    setItemsPerPage(newItemsPerPage)
    // Reset to page 1 when changing items per page
    setCurrentPage(1)
  }

  // Fonction de tri
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle : asc -> desc -> null -> asc
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection(null)
        setSortField(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Trier les utilisateurs selon le champ et la direction actuels
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField || !sortDirection) return 0

    let aValue = ''
    let bValue = ''

    switch (sortField) {
      case 'name':
        aValue = (a.name || '').toLowerCase()
        bValue = (b.name || '').toLowerCase()
        break
      case 'email':
        aValue = (a.email || '').toLowerCase()
        bValue = (b.email || '').toLowerCase()
        break
      case 'role':
        aValue = (a.profilLabel || '').toLowerCase()
        bValue = (b.profilLabel || '').toLowerCase()
        break
      case 'joinDate':
        aValue = a.joinDate || ''
        bValue = b.joinDate || ''
        break
      case 'telephone':
        aValue = (a.telephone || '').toLowerCase()
        bValue = (b.telephone || '').toLowerCase()
        break
      case 'adresse':
        aValue = (a.adresse || '').toLowerCase()
        bValue = (b.adresse || '').toLowerCase()
        break
      default:
        return 0
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  // Filtrer les utilisateurs triés selon le terme de recherche, le rôle et les filtres de champs
  const filteredUsers = sortedUsers.filter((user) => {
    // Filtre de recherche global
    const matchesSearch = !searchTerm || (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.telephone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.adresse || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // Filtre de rôle global
    const matchesRole = roleFilter === "all" || user.profilLabel === roleFilter

    // Filtres par champs spécifiques
    const matchesNameFilter = !fieldFilters.name || 
      user.name.toLowerCase().includes(fieldFilters.name.toLowerCase())
    
    const matchesEmailFilter = !fieldFilters.email || 
      user.email.toLowerCase().includes(fieldFilters.email.toLowerCase())
    
    const matchesTelephoneFilter = !fieldFilters.telephone || 
      (user.telephone || '').toLowerCase().includes(fieldFilters.telephone.toLowerCase())
    
    const matchesAdresseFilter = !fieldFilters.adresse || 
      (user.adresse || '').toLowerCase().includes(fieldFilters.adresse.toLowerCase())
    
    const matchesRoleFieldFilter = fieldFilters.role === 'all' || 
      user.profilLabel === fieldFilters.role
    
    const matchesJoinDateFilter = !fieldFilters.joinDate || 
      (user.joinDate || '').includes(fieldFilters.joinDate)

    return matchesSearch && matchesRole && matchesNameFilter && 
           matchesEmailFilter && matchesTelephoneFilter && matchesAdresseFilter && 
           matchesRoleFieldFilter && matchesJoinDateFilter
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  // Fonctions de sélection en lot
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map(user => user.email))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userEmail: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userEmail])
    } else {
      setSelectedUsers(prev => prev.filter(email => email !== userEmail))
    }
  }

  const isAllSelected = paginatedUsers.length > 0 && selectedUsers.length === paginatedUsers.length
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < paginatedUsers.length

  // Effect to handle indeterminate state
  useEffect(() => {
    if (selectAllRef.current) {
      const checkbox = selectAllRef.current.querySelector('input[type="checkbox"]') as HTMLInputElement
      if (checkbox) {
        checkbox.indeterminate = isIndeterminate
      }
    }
  }, [isIndeterminate])

  // Fonction pour effacer la sélection
  const clearSelection = () => {
    setSelectedUsers([])
  }

  // Fonctions d'actions en lot (préparées sans API)
  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    setIsBulkDeleting(true)
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté pour supprimer des utilisateurs')
        return
      }

      let successCount = 0
      let failureCount = 0
      const failedUsers: string[] = []

      // Delete users one by one (since backend doesn't have bulk delete)
      for (const userEmail of selectedUsers) {
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
            failedUsers.push(userEmail)
          }
        } catch (error) {
          failureCount++
          failedUsers.push(userEmail)
        }
      }

      // Show appropriate toast message based on results
      if (successCount > 0 && failureCount === 0) {
        toast.success(`✅ Suppression en lot réussie - ${successCount} utilisateur(s) supprimé(s) avec succès`)
      } else if (successCount > 0 && failureCount > 0) {
        toast.warning(`⚠️ Suppression partielle - ${successCount} utilisateur(s) supprimé(s), ${failureCount} échec(s)`)
      } else {
        toast.error(`❌ Échec de la suppression - Impossible de supprimer les ${failureCount} utilisateur(s) sélectionné(s)`)
      }
      
      setSelectedUsers([])
      refetch() // Actualiser la liste
    } catch (error) {
      console.error('Erreur suppression en lot:', error)
      toast.error('❌ Erreur de suppression en lot - Erreur inattendue lors de la suppression en lot')
    } finally {
      setIsBulkDeleting(false)
      setBulkDeleteDialogOpen(false)
    }
  }

  const handleBulkExport = async (format: string) => {
    if (selectedUsers.length === 0) {
      toast.warning('⚠️ Sélection vide - Veuillez sélectionner au moins un utilisateur à exporter')
      return
    }

    try {
      const { exportBulkUsers } = await import('@/lib/exportUtils')
      await exportBulkUsers(users, selectedUsers, format as 'PDF' | 'Excel' | 'Word')
      
      toast.success(`📄 Export en lot réussi - ${selectedUsers.length} utilisateur(s) sélectionné(s) exporté(s) en ${format}`)
    } catch (error) {
      console.error('Erreur export en lot:', error)
      toast.error(`❌ Erreur d'export en lot - Impossible d'exporter la sélection en ${format}. ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  const handleBulkEmailSend = () => {
    // TODO: Implémenter l'envoi d'email en lot
    console.log('Envoi d\'email aux utilisateurs sélectionnés:', selectedUsers)
    const emailList = selectedUsers.join(',')
    window.location.href = `mailto:${emailList}`
  }

  // Rendu de l'icône de tri pour les en-têtes de tableau
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400 opacity-50" />
    }
    
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 text-blue-600" />
    } else if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4 text-blue-600" />
    }
    
    return <ChevronUp className="h-4 w-4 text-gray-400 opacity-50" />
  }

  const handleDeleteClick = (email: string) => {
    setUserToDelete(email)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté pour supprimer un utilisateur')
        return
      }

              const response = await fetch('/api/users/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ E_mail: userToDelete }),
        })

      if (response.ok) {
        // Find the user name for better toast message
        const deletedUser = users.find(user => user.email === userToDelete)
        toast.success(`✅ Utilisateur supprimé - ${deletedUser?.name || userToDelete} a été supprimé avec succès`)
        refetch() // Actualiser la liste des utilisateurs
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(`❌ Erreur de suppression - ${errorData.error || errorData.message || 'Impossible de supprimer l\'utilisateur'}`)
      }
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error)
      toast.error('❌ Erreur de connexion - Impossible de contacter le serveur. Vérifiez votre connexion.')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleExport = async (format: string) => {
    if (users.length === 0) {
      toast.warning('⚠️ Liste vide - Aucun utilisateur à exporter')
      return
    }

    try {
      const { exportAllUsers } = await import('@/lib/exportUtils')
      await exportAllUsers(filteredUsers, format as 'PDF' | 'Excel' | 'Word')
      
      toast.success(`📄 Export réussi - ${filteredUsers.length} utilisateur(s) exporté(s) en ${format}`)
    } catch (error) {
      console.error('Erreur export:', error)
      toast.error(`❌ Erreur d'export - Impossible d'exporter en ${format}. ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  // Handle edit user click
  const handleEditClick = (user: any) => {
    setUserToUpdate(convertToUpdateUserData(user))
    setUpdateDialogOpen(true)
  }

  // Convert user data to ViewUserData format
  const convertToViewUserData = (user: any): ViewUserData => {
    return {
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
      Mot_de_passe: '123456', // Fixed password
      Site_Defaut: user.site_defaut || 'N/A',
      Profil: user.profil || 'N/A',
      Profil_Libelle: user.profilLabel || '',
      Heure: user.heure || '',
      Temp_Raffraichissement: user.temp_raffraichissement || '',
      Couleur: user.couleur || '',
      Image: user.image || null
    }
  }

  // Convert user data to UpdateUserData format
  const convertToUpdateUserData = (user: any) => {
    return {
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
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground">Gérez vos utilisateurs et leurs permissions</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Bouton Actualiser */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>

            {/* Menu Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("PDF")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exporter en PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("Excel")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exporter en Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("Word")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exporter en Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bouton Ajouter Utilisateur */}
            <AddUserDialog onUserAdded={() => refetch()} />
          </div>
        </div>

        {/* Barre d'Actions en Lot */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {selectedUsers.length} utilisateur{selectedUsers.length > 1 ? 's' : ''} sélectionné{selectedUsers.length > 1 ? 's' : ''}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  <X className="h-4 w-4 mr-1" />
                  Désélectionner tout
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Export en lot */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter la sélection
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkExport("PDF")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Exporter en PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkExport("Excel")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Exporter en Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkExport("Word")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Exporter en Word
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Email en lot */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkEmailSend}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer Email
                </Button>

                {/* Suppression en lot */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="space-y-4 mb-6 p-4 bg-muted/50 rounded-lg">
          {/* Filtres de base */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Recherche globale (nom, email, téléphone, adresse)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {/* Filtre par rôle global */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tous les Rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Rôles</SelectItem>
                  <SelectItem value="Administratif">Administratif</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                  <SelectItem value="Prospect ou visiteur">Prospect ou visiteur</SelectItem>
                  <SelectItem value="Candidat">Candidat</SelectItem>
                  <SelectItem value="Professeur">Professeur</SelectItem>
                  <SelectItem value="Direction">Direction</SelectItem>
                  <SelectItem value="Financier">Financier</SelectItem>
                  <SelectItem value="Organisme">Organisme</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              {/* Bouton pour filtres avancés */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`${showAdvancedFilters ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres avancés
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>

              {/* Bouton pour effacer tous les filtres */}
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Effacer filtres
                </Button>
              )}

              {/* Sélecteur de colonnes */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Columns className="h-4 w-4 mr-2" />
                    Colonnes
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <div className="p-2">
                    <div className="text-sm font-medium mb-2 text-gray-700">Afficher les colonnes</div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="col-avatar"
                          checked={columnVisibility.avatar}
                          onCheckedChange={() => toggleColumnVisibility('avatar')}
                        />
                        <label htmlFor="col-avatar" className="text-sm">Avatar</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="col-name"
                          checked={columnVisibility.name}
                          onCheckedChange={() => toggleColumnVisibility('name')}
                        />
                        <label htmlFor="col-name" className="text-sm">Nom</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="col-email"
                          checked={columnVisibility.email}
                          onCheckedChange={() => toggleColumnVisibility('email')}
                        />
                        <label htmlFor="col-email" className="text-sm">Email</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="col-telephone"
                          checked={columnVisibility.telephone}
                          onCheckedChange={() => toggleColumnVisibility('telephone')}
                        />
                        <label htmlFor="col-telephone" className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Téléphone
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="col-adresse"
                          checked={columnVisibility.adresse}
                          onCheckedChange={() => toggleColumnVisibility('adresse')}
                        />
                        <label htmlFor="col-adresse" className="text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Adresse
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="col-role"
                          checked={columnVisibility.role}
                          onCheckedChange={() => toggleColumnVisibility('role')}
                        />
                        <label htmlFor="col-role" className="text-sm">Rôle</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="col-joinDate"
                          checked={columnVisibility.joinDate}
                          onCheckedChange={() => toggleColumnVisibility('joinDate')}
                        />
                        <label htmlFor="col-joinDate" className="text-sm">Date d'Inscription</label>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filtres avancés */}
          {showAdvancedFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Filtres par champ</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Filtre Nom */}
                <div>
                  <Label htmlFor="filter-name" className="text-xs font-medium text-gray-700 mb-1 block">
                    Nom
                  </Label>
                  <Input
                    id="filter-name"
                    placeholder="Filtrer par nom..."
                    value={fieldFilters.name}
                    onChange={(e) => updateFieldFilter('name', e.target.value)}
                    className="h-8"
                  />
                </div>

                {/* Filtre Email */}
                <div>
                  <Label htmlFor="filter-email" className="text-xs font-medium text-gray-700 mb-1 block">
                    Email
                  </Label>
                  <Input
                    id="filter-email"
                    placeholder="Filtrer par email..."
                    value={fieldFilters.email}
                    onChange={(e) => updateFieldFilter('email', e.target.value)}
                    className="h-8"
                  />
                </div>

                {/* Filtre Téléphone */}
                <div>
                  <Label htmlFor="filter-telephone" className="text-xs font-medium text-gray-700 mb-1 block">
                    Téléphone
                  </Label>
                  <Input
                    id="filter-telephone"
                    placeholder="Filtrer par téléphone..."
                    value={fieldFilters.telephone}
                    onChange={(e) => updateFieldFilter('telephone', e.target.value)}
                    className="h-8"
                  />
                </div>

                {/* Filtre Adresse */}
                <div>
                  <Label htmlFor="filter-adresse" className="text-xs font-medium text-gray-700 mb-1 block">
                    Adresse
                  </Label>
                  <Input
                    id="filter-adresse"
                    placeholder="Filtrer par adresse..."
                    value={fieldFilters.adresse}
                    onChange={(e) => updateFieldFilter('adresse', e.target.value)}
                    className="h-8"
                  />
                </div>

                {/* Filtre Rôle spécifique */}
                <div>
                  <Label htmlFor="filter-role-field" className="text-xs font-medium text-gray-700 mb-1 block">
                    Rôle (spécifique)
                  </Label>
                  <Select value={fieldFilters.role} onValueChange={(value) => updateFieldFilter('role', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Tous les rôles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="Administratif">Administratif</SelectItem>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                      <SelectItem value="Prospect ou visiteur">Prospect ou visiteur</SelectItem>
                      <SelectItem value="Candidat">Candidat</SelectItem>
                      <SelectItem value="Professeur">Professeur</SelectItem>
                      <SelectItem value="Direction">Direction</SelectItem>
                      <SelectItem value="Financier">Financier</SelectItem>
                      <SelectItem value="Organisme">Organisme</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre Date d'inscription */}
                <div>
                  <Label htmlFor="filter-joindate" className="text-xs font-medium text-gray-700 mb-1 block">
                    Date d'inscription
                  </Label>
                  <Input
                    id="filter-joindate"
                    placeholder="YYYY-MM-DD"
                    value={fieldFilters.joinDate}
                    onChange={(e) => updateFieldFilter('joinDate', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              {/* Résumé des filtres actifs */}
              {getActiveFiltersCount() > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {getActiveFiltersCount()} filtre{getActiveFiltersCount() > 1 ? 's' : ''} actif{getActiveFiltersCount() > 1 ? 's' : ''}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 h-7"
                    >
                      Tout effacer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* État d'Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                className="ml-auto"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* État de Chargement */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A90DA]"></div>
            <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
          </div>
        )}

        {/* Tableau des Utilisateurs */}
        {!isLoading && !error && (
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        className="ml-2"
                        ref={selectAllRef}
                      />
                    </TableHead>
                    
                    {columnVisibility.avatar && (
                      <TableHead 
                        className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Avatar
                          {renderSortIcon('name')}
                        </div>
                      </TableHead>
                    )}
                    
                    {columnVisibility.name && (
                      <TableHead 
                        className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Nom
                          {renderSortIcon('name')}
                        </div>
                      </TableHead>
                    )}
                    
                    {columnVisibility.email && (
                      <TableHead 
                        className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-2">
                          Email
                          {renderSortIcon('email')}
                        </div>
                      </TableHead>
                    )}
                    
                    {columnVisibility.telephone && (
                      <TableHead 
                        className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort('telephone')}
                      >
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Téléphone
                          {renderSortIcon('telephone')}
                        </div>
                      </TableHead>
                    )}
                    
                    {columnVisibility.adresse && (
                      <TableHead 
                        className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort('adresse')}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Adresse
                          {renderSortIcon('adresse')}
                        </div>
                      </TableHead>
                    )}
                    
                    {columnVisibility.role && (
                      <TableHead 
                        className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort('role')}
                      >
                        <div className="flex items-center gap-2">
                          Rôle
                          {renderSortIcon('role')}
                        </div>
                      </TableHead>
                    )}
                    
                    {columnVisibility.joinDate && (
                      <TableHead 
                        className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort('joinDate')}
                      >
                        <div className="flex items-center gap-2">
                          Date d'Inscription
                          {renderSortIcon('joinDate')}
                        </div>
                      </TableHead>
                    )}
                    
                    <TableHead className="text-center font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedUsers.includes(user.email) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.email)}
                          onCheckedChange={(checked) => handleSelectUser(user.email, !!checked)}
                          className="ml-2"
                        />
                      </TableCell>
                      
                      {columnVisibility.avatar && (
                        <TableCell className="py-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image || "/placeholder.jpg"} alt={user.name || "User"} />
                            <AvatarFallback>{user.name?.substring(0, 2) || "U"}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                      )}
                      
                      {columnVisibility.name && (
                        <TableCell className="font-medium py-4">{user.name}</TableCell>
                      )}
                      
                      {columnVisibility.email && (
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{user.email}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendEmail(user.email)}
                              className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                              title="Envoyer un email"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                      
                      {columnVisibility.telephone && (
                        <TableCell className="py-4">
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
                        </TableCell>
                      )}
                      
                      {columnVisibility.adresse && (
                        <TableCell className="py-4">
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
                        </TableCell>
                      )}
                      
                      {columnVisibility.role && (
                        <TableCell className="py-4">
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
                        </TableCell>
                      )}
                      
                      {columnVisibility.joinDate && (
                        <TableCell className="py-4 text-gray-600">{user.joinDate}</TableCell>
                      )}
                      
                      <TableCell className="py-4">
                        <div className="flex justify-center gap-1">
                          <ViewUserDialog 
                            user={convertToViewUserData(user)}
                            trigger={
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                title="Voir l'utilisateur"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 transition-colors"
                            onClick={() => handleEditClick(user)}
                            title="Modifier l'utilisateur"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                            onClick={() => handleDeleteClick(user.email)}
                            title="Supprimer l'utilisateur"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && (
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Affichage {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredUsers.length)} sur{" "}
                {filteredUsers.length} utilisateurs
              </div>
              
              {/* Dropdown pour le nombre d'éléments par page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Afficher:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  let page;
                  if (totalPages <= 10) {
                    page = i + 1;
                  } else {
                    const start = Math.max(1, currentPage - 4);
                    const end = Math.min(totalPages, start + 9);
                    page = start + i;
                    if (page > end) return null;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                }).filter(Boolean)}
                
                {totalPages > 10 && currentPage < totalPages - 5 && (
                  <>
                    <span className="px-2 text-sm text-muted-foreground">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Dialogue de Confirmation de Suppression */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                <br />
                <span className="font-medium text-gray-900 mt-2 block">
                  Email: {userToDelete}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialogue de Confirmation de Suppression en Lot */}
        <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression en lot</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer {selectedUsers.length} utilisateur{selectedUsers.length > 1 ? 's' : ''} ? Cette action est irréversible.
                <br />
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  <strong>Utilisateurs sélectionnés :</strong>
                  <ul className="mt-1 space-y-1">
                    {selectedUsers.slice(0, 5).map(email => (
                      <li key={email} className="text-gray-700">• {email}</li>
                    ))}
                    {selectedUsers.length > 5 && (
                      <li className="text-gray-500">... et {selectedUsers.length - 5} autres</li>
                    )}
                  </ul>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setBulkDeleteDialogOpen(false)}
                disabled={isBulkDeleting}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmBulkDelete}
                disabled={isBulkDeleting}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isBulkDeleting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Suppression en cours...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer {selectedUsers.length} utilisateur{selectedUsers.length > 1 ? 's' : ''}
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Update User Dialog */}
        {userToUpdate && (
          <UpdateUserDialog
            user={userToUpdate}
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
            onUserUpdated={() => {
              refetch();
              setUpdateDialogOpen(false);
              setUserToUpdate(null);
            }}
          />
        )}
      </div>
    </div>
  )
}
