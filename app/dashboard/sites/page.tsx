"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
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
  Building2,
  Send,
  Columns,
  Phone,
  MapPin,
  Building,
  Globe,
  MoreHorizontal,
} from "lucide-react"
import { useSites } from "@/hooks/useSites"
import { AddSiteDialog } from "@/components/sites/AddSiteDialog"
import { ViewSiteDialog } from "@/components/sites/ViewSiteDialog"
import { UpdateSiteDialog } from "@/components/sites/UpdateSiteDialog"
import { createSiteExportConfig, exportGenericData } from "@/lib/exportUtils"
import type { Site } from "@/hooks/useSites"

// Types de tri
type SortField = 'reference' | 'raison_sociale' | 'ville' | 'telephone' | 'email_commercial' | 'activite'
type SortDirection = 'asc' | 'desc' | null

// Types pour la visibilité des colonnes
interface ColumnVisibility {
  logo: boolean
  reference: boolean
  raison_sociale: boolean
  ville: boolean
  telephone: boolean
  email_commercial: boolean
  activite: boolean
}

// Types pour les filtres par champ
interface FieldFilters {
  reference: string
  raison_sociale: string
  ville: string
  telephone: string
  email_commercial: string
  activite: string
}

export default function SitesPage() {
  // Utilisation du hook personnalisé pour récupérer les sites depuis l'API
  const { sites, isLoading, error, refetch } = useSites()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Update dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [siteToUpdate, setSiteToUpdate] = useState<Site | null>(null)
  
  // View dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [siteToView, setSiteToView] = useState<Site | null>(null)
  
  // État du tri
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  
  // État de sélection en lot
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const selectAllRef = useRef<HTMLButtonElement>(null)
  
  // État de visibilité des colonnes
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    logo: true,
    reference: true,
    raison_sociale: true,
    ville: true,
    telephone: true,
    email_commercial: true,
    activite: true,
  })
  
  // État des filtres par champ
  const [fieldFilters, setFieldFilters] = useState<FieldFilters>({
    reference: '',
    raison_sociale: '',
    ville: '',
    telephone: '',
    email_commercial: '',
    activite: ''
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
    setFieldFilters({
      reference: '',
      raison_sociale: '',
      ville: '',
      telephone: '',
      email_commercial: '',
      activite: ''
    })
    setCurrentPage(1)
  }

  // Fonction pour compter les filtres actifs
  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm) count++
    if (fieldFilters.reference) count++
    if (fieldFilters.raison_sociale) count++
    if (fieldFilters.ville) count++
    if (fieldFilters.telephone) count++
    if (fieldFilters.email_commercial) count++
    if (fieldFilters.activite) count++
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
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filtrage et tri des sites
  const filteredAndSortedSites = sites
    .filter(site => {
      // Filtre de recherche globale
      const matchesSearch = searchTerm === '' || 
        site.Reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.Raison_Sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (site.Ville && site.Ville.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (site.Telephone && site.Telephone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (site.E_Mail_Commercial && site.E_Mail_Commercial.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (site.Activite && site.Activite.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filtres par champ
      const matchesFieldFilters = 
        site.Reference.toLowerCase().includes(fieldFilters.reference.toLowerCase()) &&
        site.Raison_Sociale.toLowerCase().includes(fieldFilters.raison_sociale.toLowerCase()) &&
        (site.Ville || '').toLowerCase().includes(fieldFilters.ville.toLowerCase()) &&
        (site.Telephone || '').toLowerCase().includes(fieldFilters.telephone.toLowerCase()) &&
        (site.E_Mail_Commercial || '').toLowerCase().includes(fieldFilters.email_commercial.toLowerCase()) &&
        (site.Activite || '').toLowerCase().includes(fieldFilters.activite.toLowerCase())

      return matchesSearch && matchesFieldFilters
    })
    .sort((a, b) => {
      if (!sortField || !sortDirection) return 0
      
      let aValue = ''
      let bValue = ''
      
      switch (sortField) {
        case 'reference':
          aValue = a.Reference
          bValue = b.Reference
          break
        case 'raison_sociale':
          aValue = a.Raison_Sociale
          bValue = b.Raison_Sociale
          break
        case 'ville':
          aValue = a.Ville || ''
          bValue = b.Ville || ''
          break
        case 'telephone':
          aValue = a.Telephone || ''
          bValue = b.Telephone || ''
          break
        case 'email_commercial':
          aValue = a.E_Mail_Commercial || ''
          bValue = b.E_Mail_Commercial || ''
          break
        case 'activite':
          aValue = a.Activite || ''
          bValue = b.Activite || ''
          break
      }
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSites.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSites = filteredAndSortedSites.slice(startIndex, endIndex)

  // Fonctions de sélection en lot
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSites(paginatedSites.map(site => site.Reference))
    } else {
      setSelectedSites([])
    }
  }

  const handleSelectSite = (siteReference: string, checked: boolean) => {
    if (checked) {
      setSelectedSites(prev => [...prev, siteReference])
    } else {
      setSelectedSites(prev => prev.filter(ref => ref !== siteReference))
    }
  }

  const isAllSelected = paginatedSites.length > 0 && selectedSites.length === paginatedSites.length
  const isIndeterminate = selectedSites.length > 0 && selectedSites.length < paginatedSites.length

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
    setSelectedSites([])
  }

  // Fonctions d'actions en lot
  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    setIsBulkDeleting(true)
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté pour supprimer des sites')
        return
      }

      let successCount = 0
      let failureCount = 0
      const failedSites: string[] = []

      // Delete sites one by one (since backend doesn't have bulk delete)
      for (const siteReference of selectedSites) {
        try {
          const response = await fetch('http://localhost:3000/api/v1/sites/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ Reference: siteReference }),
          })

          if (response.ok) {
            successCount++
          } else {
            failureCount++
            failedSites.push(siteReference)
          }
        } catch (error) {
          failureCount++
          failedSites.push(siteReference)
        }
      }

      // Show appropriate toast message based on results
      if (successCount > 0 && failureCount === 0) {
        toast.success(`✅ Suppression en lot réussie - ${successCount} site(s) supprimé(s) avec succès`)
      } else if (successCount > 0 && failureCount > 0) {
        toast.warning(`⚠️ Suppression partielle - ${successCount} site(s) supprimé(s), ${failureCount} échec(s)`)
      } else {
        toast.error(`❌ Échec de la suppression - Impossible de supprimer les ${failureCount} site(s) sélectionné(s)`)
      }
      
      setSelectedSites([])
      refetch() // Actualiser la liste
    } catch (error) {
      console.error('Erreur suppression en lot:', error)
      toast.error('❌ Erreur inattendue lors de la suppression en lot')
    } finally {
      setIsBulkDeleting(false)
      setBulkDeleteDialogOpen(false)
    }
  }

  const handleBulkExport = async (format: 'PDF' | 'Excel' | 'Word') => {
    try {
      const selectedSitesData = sites.filter(site => selectedSites.includes(site.Reference))
      
      const config = createSiteExportConfig(selectedSitesData)
      config.filename = 'sites_selectionnes'
      const success = await exportGenericData(config, format)
      
      if (success) {
        toast.success(`📁 Export ${format} réalisé avec succès - ${selectedSites.length} site(s) exporté(s)`)
      } else {
        toast.error(`❌ Erreur lors de l'export ${format}`)
      }
    } catch (error) {
      console.error('Erreur export sites sélectionnés:', error)
      toast.error('❌ Erreur lors de l\'export des sites')
    }
  }

  const handleBulkEmailSend = () => {
    const selectedSitesData = sites.filter(site => selectedSites.includes(site.Reference))
    const emailAddresses = selectedSitesData
      .map(site => site.E_Mail_Commercial)
      .filter(email => email)
      .join(';')
    
    if (emailAddresses) {
      window.location.href = `mailto:${emailAddresses}`
      toast.success(`📧 Client de messagerie ouvert avec ${emailAddresses.split(';').length} destinataire(s)`)
    } else {
      toast.warning('⚠️ Aucune adresse email trouvée pour les sites sélectionnés')
    }
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 opacity-0 group-hover:opacity-50" />
    }
    
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4" />
    } else if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4" />
    }
    
    return <ChevronUp className="h-4 w-4 opacity-0 group-hover:opacity-50" />
  }

  const handleDeleteClick = (reference: string) => {
    setSiteToDelete(reference)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!siteToDelete) return
    
    setIsDeleting(true)
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté pour supprimer un site')
        return
      }

      const response = await fetch('http://localhost:3000/api/v1/sites/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ Reference: siteToDelete }),
      })

      if (response.ok) {
        const siteData = sites.find(s => s.Reference === siteToDelete)
        toast.success(`🗑️ Site supprimé avec succès - ${siteData?.Raison_Sociale} a été supprimé`)
        refetch() // Actualiser la liste
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(`❌ Erreur de suppression - ${errorData.error || 'Impossible de supprimer le site'}`)
      }
    } catch (error) {
      console.error('Erreur suppression site:', error)
      toast.error('❌ Erreur de connexion - Impossible de contacter le serveur')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSiteToDelete(null)
    }
  }

  const handleExport = async (format: 'PDF' | 'Excel' | 'Word') => {
    try {
      const config = createSiteExportConfig(filteredAndSortedSites)
      const success = await exportGenericData(config, format)
      
      if (success) {
        toast.success(`📁 Export ${format} réalisé avec succès - ${filteredAndSortedSites.length} site(s) exporté(s)`)
      } else {
        toast.error(`❌ Erreur lors de l'export ${format}`)
      }
    } catch (error) {
      console.error('Erreur export sites:', error)
      toast.error('❌ Erreur lors de l\'export des sites')
    }
  }

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const handleEditClick = (site: Site) => {
    setSiteToUpdate(site)
    setUpdateDialogOpen(true)
  }

  const handleViewClick = (site: Site) => {
    setSiteToView(site)
    setViewDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Building2 className="h-8 w-8 text-[#3A90DA]" />
              Sites
            </h1>
            <p className="text-gray-600">
              Gérez les sites et leurs informations
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <AddSiteDialog onSiteAdded={refetch} />
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par référence, raison sociale, ville, téléphone, email ou activité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Actions Toolbar */}
            <div className="flex flex-wrap gap-2">
              {/* Filtres avancés */}
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>

              {/* Réinitialiser filtres */}
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Effacer
                </Button>
              )}

              {/* Refresh */}
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>
              
              {/* Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('PDF')}>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('Excel')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('Word')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Colonnes visibles */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Columns className="h-4 w-4" />
                    Colonnes
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(columnVisibility).map(([key, visible]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => toggleColumnVisibility(key as keyof ColumnVisibility)}
                    >
                      <Checkbox
                        checked={visible}
                        className="mr-2"
                      />
                      {key === 'logo' && 'Logo'}
                      {key === 'reference' && 'Référence'}
                      {key === 'raison_sociale' && 'Raison Sociale'}
                      {key === 'ville' && 'Ville'}
                      {key === 'telephone' && 'Téléphone'}
                      {key === 'email_commercial' && 'Email Commercial'}
                      {key === 'activite' && 'Activité'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filtres avancés */}
          {showAdvancedFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                  <Input
                    placeholder="Filtrer par référence"
                    value={fieldFilters.reference}
                    onChange={(e) => updateFieldFilter('reference', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raison Sociale</label>
                  <Input
                    placeholder="Filtrer par raison sociale"
                    value={fieldFilters.raison_sociale}
                    onChange={(e) => updateFieldFilter('raison_sociale', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <Input
                    placeholder="Filtrer par ville"
                    value={fieldFilters.ville}
                    onChange={(e) => updateFieldFilter('ville', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <Input
                    placeholder="Filtrer par téléphone"
                    value={fieldFilters.telephone}
                    onChange={(e) => updateFieldFilter('telephone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Commercial</label>
                  <Input
                    placeholder="Filtrer par email"
                    value={fieldFilters.email_commercial}
                    onChange={(e) => updateFieldFilter('email_commercial', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activité</label>
                  <Input
                    placeholder="Filtrer par activité"
                    value={fieldFilters.activite}
                    onChange={(e) => updateFieldFilter('activite', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions en lot */}
        {selectedSites.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedSites.length} site(s) sélectionné(s)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkEmailSend}
                  className="flex items-center gap-1"
                >
                  <Send className="h-4 w-4" />
                  Envoyer Email
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Exporter sélection
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkExport('PDF')}>
                      <FileText className="mr-2 h-4 w-4" />
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkExport('Excel')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkExport('Word')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Word
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Erreur */}
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

        {/* État de chargement */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A90DA]"></div>
            <span className="ml-2 text-gray-600">Chargement des sites...</span>
          </div>
        )}

        {/* Tableau des Sites */}
        {!isLoading && (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        ref={selectAllRef}
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    {columnVisibility.logo && (
                      <TableHead className="w-16">Logo</TableHead>
                    )}
                    {columnVisibility.reference && (
                      <TableHead 
                        className="cursor-pointer select-none group"
                        onClick={() => handleSort('reference')}
                      >
                        <div className="flex items-center gap-1">
                          Référence
                          {renderSortIcon('reference')}
                        </div>
                      </TableHead>
                    )}
                    {columnVisibility.raison_sociale && (
                      <TableHead 
                        className="cursor-pointer select-none group"
                        onClick={() => handleSort('raison_sociale')}
                      >
                        <div className="flex items-center gap-1">
                          Raison Sociale
                          {renderSortIcon('raison_sociale')}
                        </div>
                      </TableHead>
                    )}
                    {columnVisibility.ville && (
                      <TableHead 
                        className="cursor-pointer select-none group"
                        onClick={() => handleSort('ville')}
                      >
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Ville
                          {renderSortIcon('ville')}
                        </div>
                      </TableHead>
                    )}
                    {columnVisibility.telephone && (
                      <TableHead 
                        className="cursor-pointer select-none group"
                        onClick={() => handleSort('telephone')}
                      >
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Téléphone
                          {renderSortIcon('telephone')}
                        </div>
                      </TableHead>
                    )}
                    {columnVisibility.email_commercial && (
                      <TableHead 
                        className="cursor-pointer select-none group"
                        onClick={() => handleSort('email_commercial')}
                      >
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          Email Commercial
                          {renderSortIcon('email_commercial')}
                        </div>
                      </TableHead>
                    )}
                    {columnVisibility.activite && (
                      <TableHead 
                        className="cursor-pointer select-none group"
                        onClick={() => handleSort('activite')}
                      >
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Activité
                          {renderSortIcon('activite')}
                        </div>
                      </TableHead>
                    )}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSites.map((site) => (
                    <TableRow key={site.Reference} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedSites.includes(site.Reference)}
                          onCheckedChange={(checked) => handleSelectSite(site.Reference, checked as boolean)}
                        />
                      </TableCell>
                      {columnVisibility.logo && (
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            {site.Sigle && typeof site.Sigle === 'string' ? (
                              <AvatarImage 
                                src={site.Sigle.startsWith('data:') ? site.Sigle : `data:image/jpeg;base64,${site.Sigle}`} 
                                alt={site.Raison_Sociale}
                                onError={(e) => {
                                  // Hide the image and show fallback on error
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : null}
                            <AvatarFallback>
                              <Building className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                      )}
                      {columnVisibility.reference && (
                        <TableCell className="font-medium">{site.Reference}</TableCell>
                      )}
                      {columnVisibility.raison_sociale && (
                        <TableCell className="font-medium">{site.Raison_Sociale}</TableCell>
                      )}
                      {columnVisibility.ville && (
                        <TableCell>{site.Ville || '-'}</TableCell>
                      )}
                      {columnVisibility.telephone && (
                        <TableCell>{site.Telephone || '-'}</TableCell>
                      )}
                      {columnVisibility.email_commercial && (
                        <TableCell>
                          {site.E_Mail_Commercial ? (
                            <a 
                              href={`mailto:${site.E_Mail_Commercial}`}
                              className="text-blue-600 hover:underline"
                            >
                              {site.E_Mail_Commercial}
                            </a>
                          ) : '-'}
                        </TableCell>
                      )}
                      {columnVisibility.activite && (
                        <TableCell>
                          {site.Activite ? (
                            <span className="text-sm truncate max-w-32 block" title={site.Activite}>
                              {site.Activite}
                            </span>
                          ) : '-'}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewClick(site)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(site)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            {site.Site_Web && (
                              <DropdownMenuItem onClick={() => window.open(site.Site_Web, '_blank')}>
                                <Globe className="mr-2 h-4 w-4" />
                                Site Web
                              </DropdownMenuItem>
                            )}
                            {site.E_Mail_Commercial && (
                              <DropdownMenuItem onClick={() => handleSendEmail(site.E_Mail_Commercial!)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(site.Reference)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Aucun résultat */}
              {paginatedSites.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Aucun site trouvé
                  </p>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || getActiveFiltersCount() > 0
                      ? "Essayez de modifier vos critères de recherche"
                      : "Commencez par ajouter un nouveau site"}
                  </p>
                  {(!searchTerm && getActiveFiltersCount() === 0) && (
                    <AddSiteDialog onSiteAdded={refetch} />
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      Affichage {startIndex + 1} à {Math.min(endIndex, filteredAndSortedSites.length)} sur {filteredAndSortedSites.length} sites
                    </span>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-700">par page</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm font-medium">
                      Page {currentPage} sur {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Dialog de suppression individuelle */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce site ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog de suppression en lot */}
        <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression en lot</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer {selectedSites.length} site(s) ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmBulkDelete}
                disabled={isBulkDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isBulkDeleting ? 'Suppression...' : 'Supprimer tout'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Update Dialog */}
        {siteToUpdate && (
          <UpdateSiteDialog
            site={siteToUpdate}
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
            onSiteUpdated={() => {
              refetch()
              setSiteToUpdate(null)
            }}
          />
        )}

        {/* View Dialog */}
        <ViewSiteDialog
          site={siteToView}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      </div>
    </div>
  )
} 