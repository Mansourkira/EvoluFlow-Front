import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  ThemedTable, 
  ThemedTableHeader, 
  ThemedTableBody, 
  ThemedTableRow, 
  ThemedTableHead, 
  ThemedTableCell 
} from "@/components/ui/themed-table"
import {
  ThemedButton,
  PrimaryButton,
  SecondaryButton,
  SuccessButton,
  DangerButton,
  OutlineButton
} from "@/components/ui/themed-button"
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
} from "lucide-react"
import { toast } from "sonner"

interface Column {
  key: string
  label: string
  sortable?: boolean
  searchable?: boolean
  filterable?: boolean
  render?: (item: any) => React.ReactNode
  width?: string
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface GenericDataTableProps {
  // Data
  data: any[]
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => void
  
  // Configuration
  title: string
  description?: string
  entityName: string // "utilisateur", "site", etc.
  entityNamePlural: string // "utilisateurs", "sites", etc.
  
  // Columns
  columns: Column[]
  idField: string // which field to use as ID (e.g., "email", "reference", "id")
  
  // Actions
  onView?: (item: any) => void
  onEdit?: (item: any) => void
  onDelete?: (itemId: string) => Promise<void>
  onBulkDelete?: (itemIds: string[]) => Promise<void>
  onExport?: (format: string, selectedOnly?: boolean) => Promise<void>
  
  // Features
  enableSearch?: boolean
  enableAdvancedFilters?: boolean
  enableBulkSelect?: boolean
  enableColumnToggle?: boolean
  enableExport?: boolean
  enableRefresh?: boolean
  
  // Custom elements
  addButton?: React.ReactNode
  customActions?: Array<{
    key: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: (item: any) => void
    className?: string
  }>
  
  // Pagination
  defaultItemsPerPage?: number
  itemsPerPageOptions?: number[]
}

export function GenericDataTable({
  data = [],
  isLoading = false,
  error = null,
  onRefresh,
  title,
  description,
  entityName,
  entityNamePlural,
  columns,
  idField,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onExport,
  enableSearch = true,
  enableAdvancedFilters = true,
  enableBulkSelect = true,
  enableColumnToggle = true,
  enableExport = true,
  enableRefresh = true,
  addButton,
  customActions = [],
  defaultItemsPerPage = 10,
  itemsPerPageOptions = [5, 10, 25, 50, 100]
}: GenericDataTableProps) {
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [fieldFilters, setFieldFilters] = useState<Record<string, string>>({})
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  // Sorting
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)
  
  // Selection
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const selectAllRef = useRef<HTMLButtonElement>(null)
  
  // Column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const visibility: Record<string, boolean> = {}
    columns.forEach(col => {
      visibility[col.key] = true
    })
    return visibility
  })
  
  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  // Initialize field filters
  useEffect(() => {
    const filters: Record<string, string> = {}
    columns.forEach(col => {
      if (col.filterable) {
        filters[col.key] = ''
      }
    })
    setFieldFilters(filters)
  }, [columns])

  // Helper functions
  const getItemId = (item: any) => item[idField]
  const getItemDisplayName = (item: any) => item.name || item.raison_sociale || getItemId(item)

  const updateFieldFilter = (field: string, value: string) => {
    setFieldFilters(prev => ({ ...prev, [field]: value }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    const clearedFilters: Record<string, string> = {}
    Object.keys(fieldFilters).forEach(key => {
      clearedFilters[key] = ''
    })
    setFieldFilters(clearedFilters)
    setCurrentPage(1)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm) count++
    Object.values(fieldFilters).forEach(value => {
      if (value) count++
    })
    return count
  }

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value)
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  // Sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
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

  const renderSortIcon = (field: string) => {
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

  // Get nested value from object
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = [...data]
    
    // Apply search filter
    if (searchTerm && enableSearch) {
      const searchableColumns = columns.filter(col => col.searchable !== false)
      filtered = filtered.filter(item => {
        return searchableColumns.some(col => {
          const value = getNestedValue(item, col.key)
          return String(value || '').toLowerCase().includes(searchTerm.toLowerCase())
        })
      })
    }
    
    // Apply field filters
    Object.entries(fieldFilters).forEach(([field, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter(item => {
          const value = getNestedValue(item, field)
          return String(value || '').toLowerCase().includes(filterValue.toLowerCase())
        })
      }
    })
    
    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = String(getNestedValue(a, sortField) || '').toLowerCase()
        const bValue = String(getNestedValue(b, sortField) || '').toLowerCase()
        
        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    }
    
    return filtered
  }, [data, searchTerm, fieldFilters, sortField, sortDirection, columns, enableSearch])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Selection functions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map(item => getItemId(item)))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId])
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    }
  }

  const isAllSelected = paginatedData.length > 0 && selectedItems.length === paginatedData.length
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < paginatedData.length

  const clearSelection = () => {
    setSelectedItems([])
  }

  // Handle indeterminate state
  useEffect(() => {
    if (selectAllRef.current) {
      const checkbox = selectAllRef.current.querySelector('input[type="checkbox"]') as HTMLInputElement
      if (checkbox) {
        checkbox.indeterminate = isIndeterminate
      }
    }
  }, [isIndeterminate])

  // Delete handlers
  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(itemToDelete)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    if (!onBulkDelete) return
    setIsBulkDeleting(true)
    try {
      await onBulkDelete(selectedItems)
      setSelectedItems([])
    } finally {
      setIsBulkDeleting(false)
      setBulkDeleteDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Refresh Button */}
            {enableRefresh && onRefresh && (
              <OutlineButton 
                size="sm" 
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </OutlineButton>
            )}

            {/* Export Menu */}
            {enableExport && onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onExport("PDF")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exporter en PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport("Excel")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exporter en Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport("Word")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exporter en Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Add Button */}
            {addButton}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {enableBulkSelect && selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {selectedItems.length} {entityName}{selectedItems.length > 1 ? 's' : ''} sélectionné{selectedItems.length > 1 ? 's' : ''}
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
                {/* Bulk Export */}
                {enableExport && onExport && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter la sélection
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onExport("PDF", true)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Exporter en PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onExport("Excel", true)}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Exporter en Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onExport("Word", true)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Exporter en Word
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Bulk Delete */}
                {onBulkDelete && (
                  <DangerButton
                    size="sm"
                    onClick={handleBulkDeleteClick}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DangerButton>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4 mb-6 p-4 bg-muted/50 rounded-lg">
          {/* Basic Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Global Search */}
            {enableSearch && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Recherche dans ${entityNamePlural.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {/* Advanced Filters Toggle */}
              {enableAdvancedFilters && (
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
              )}

              {/* Clear Filters */}
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

              {/* Column Toggle */}
              {enableColumnToggle && (
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
                        {columns.map(column => (
                          <div key={column.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={`col-${column.key}`}
                              checked={columnVisibility[column.key]}
                              onCheckedChange={() => toggleColumnVisibility(column.key)}
                            />
                            <label htmlFor={`col-${column.key}`} className="text-sm flex items-center gap-1">
                              {column.icon && <column.icon className="h-3 w-3" />}
                              {column.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {enableAdvancedFilters && showAdvancedFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Filtres par champ</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {columns.filter(col => col.filterable).map(column => (
                  <div key={column.key}>
                    <Label htmlFor={`filter-${column.key}`} className="text-xs font-medium text-gray-700 mb-1 block">
                      {column.label}
                    </Label>
                    <Input
                      id={`filter-${column.key}`}
                      placeholder={`Filtrer par ${column.label.toLowerCase()}...`}
                      value={fieldFilters[column.key] || ''}
                      onChange={(e) => updateFieldFilter(column.key, e.target.value)}
                      className="h-8"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onRefresh && onRefresh()}
                className="ml-auto"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A90DA]"></div>
            <span className="ml-2 text-gray-600">Chargement des {entityNamePlural.toLowerCase()}...</span>
          </div>
        )}

        {/* Data Table */}
        {!isLoading && !error && (
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <ThemedTable>
                <ThemedTableHeader>
                  <ThemedTableRow>
                    {/* Select All Checkbox */}
                    {enableBulkSelect && (
                      <ThemedTableHead className="w-12">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          className="ml-2"
                          ref={selectAllRef}
                        />
                      </ThemedTableHead>
                    )}
                    
                    {/* Column Headers */}
                    {columns.map(column => 
                      columnVisibility[column.key] && (
                        <ThemedTableHead
                          key={column.key}
                          className={`font-semibold text-white ${column.sortable ? 'cursor-pointer hover:bg-blue-700 transition-colors select-none' : ''} ${column.className || ''}`}
                          onClick={column.sortable ? () => handleSort(column.key) : undefined}
                          style={{ width: column.width }}
                        >
                          <div className="flex items-center gap-2">
                            {column.icon && <column.icon className="h-4 w-4" />}
                            {column.label}
                            {column.sortable && renderSortIcon(column.key)}
                          </div>
                        </ThemedTableHead>
                      )
                    )}
                    
                    {/* Actions Column */}
                    <ThemedTableHead className="text-center font-semibold text-white">Actions</ThemedTableHead>
                  </ThemedTableRow>
                </ThemedTableHeader>
                <ThemedTableBody>
                  {paginatedData.map((item) => {
                    const itemId = getItemId(item)
                    return (
                      <ThemedTableRow 
                        key={itemId}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedItems.includes(itemId) ? 'bg-blue-50' : ''
                        }`}
                      >
                        {/* Select Checkbox */}
                        {enableBulkSelect && (
                          <ThemedTableCell>
                            <Checkbox
                              checked={selectedItems.includes(itemId)}
                              onCheckedChange={(checked) => handleSelectItem(itemId, !!checked)}
                              className="ml-2"
                            />
                          </ThemedTableCell>
                        )}
                        
                        {/* Data Columns */}
                        {columns.map(column => 
                          columnVisibility[column.key] && (
                            <ThemedTableCell key={column.key} className={`py-4 ${column.className || ''}`}>
                              {column.render ? 
                                column.render(item) : 
                                String(getNestedValue(item, column.key) || 'N/A')
                              }
                            </ThemedTableCell>
                          )
                        )}
                        
                        {/* Actions */}
                        <ThemedTableCell className="py-4">
                          <div className="flex justify-center gap-1">
                            {/* View Action */}
                            {onView && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                onClick={() => onView(item)}
                                title={`Voir ${entityName}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Edit Action */}
                            {onEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 transition-colors"
                                onClick={() => onEdit(item)}
                                title={`Modifier ${entityName}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Custom Actions */}
                            {customActions.map(action => (
                              <Button
                                key={action.key}
                                variant="ghost"
                                size="sm"
                                className={`h-8 w-8 p-0 transition-colors ${action.className || ''}`}
                                onClick={() => action.onClick(item)}
                                title={action.label}
                              >
                                <action.icon className="h-4 w-4" />
                              </Button>
                            ))}

                            {/* Delete Action */}
                            {onDelete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                                onClick={() => handleDeleteClick(itemId)}
                                title={`Supprimer ${entityName}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </ThemedTableCell>
                      </ThemedTableRow>
                    )
                  })}
                </ThemedTableBody>
              </ThemedTable>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && (
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Affichage {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredData.length)} sur{" "}
                {filteredData.length} {entityNamePlural.toLowerCase()}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Afficher:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {itemsPerPageOptions.map(option => (
                      <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemedButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </ThemedButton>

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
                    <ThemedButton
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </ThemedButton>
                  );
                }).filter(Boolean)}
              </div>

              <ThemedButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </ThemedButton>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce {entityName} ? Cette action est irréversible.
                <br />
                <span className="font-medium text-gray-900 mt-2 block">
                  {itemToDelete ? 
                    getItemDisplayName(data.find((item:any) => getItemId(item) === itemToDelete)!) :
                    itemToDelete
                  }
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

        {/* Bulk Delete Confirmation Dialog */}
        <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression en lot</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer {selectedItems.length} {entityName}{selectedItems.length > 1 ? 's' : ''} ? Cette action est irréversible.
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
                    Supprimer {selectedItems.length} {entityName}{selectedItems.length > 1 ? 's' : ''}
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
} 