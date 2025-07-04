import React, { useState } from 'react'
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
  Plus,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Filter,
  RefreshCw,
  X,
  Send,
  Columns,
  Trash2,
} from "lucide-react"
import { DataTableConfig } from './DataTableConfig'
import { useDataTable } from '@/hooks/useDataTable'

interface GenericDataTableProps<T> {
  config: DataTableConfig<T>
  addDialog?: React.ReactNode
}

export function GenericDataTable<T>({ config, addDialog }: GenericDataTableProps<T>) {
  const {
    data,
    filteredData,
    paginatedData,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    fieldFilters,
    updateFieldFilter,
    clearAllFilters,
    getActiveFiltersCount,
    showAdvancedFilters,
    setShowAdvancedFilters,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    itemsPerPage,
    handleItemsPerPageChange,
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    isAllSelected,
    isIndeterminate,
    clearSelection,
    selectAllRef,
    columnVisibility,
    toggleColumnVisibility,
    handleDelete,
    handleBulkDelete,
    handleExport,
  } = useDataTable({ config })
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  // Render sort icon
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

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    try {
      await handleDelete(itemToDelete)
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
    setIsBulkDeleting(true)
    try {
      await handleBulkDelete(selectedItems)
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
            <h1 className="text-3xl font-bold">{config.title || `Gestion des ${config.entityNamePlural}`}</h1>
            <p className="text-muted-foreground">{config.description || `Gérez vos ${config.entityNamePlural.toLowerCase()}`}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Refresh Button */}
            {config.enableRefresh && (
              <Button 
                variant="outline"
                size="sm" 
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            )}

            {/* Export Menu */}
            {config.enableExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {config.exportConfig?.formats.map(format => (
                    <DropdownMenuItem key={format} onClick={() => handleExport(format)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Exporter en {format}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Add Dialog */}
            {addDialog}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {config.enableBulkSelect && selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedItems.length} {config.entityName.toLowerCase()}{selectedItems.length > 1 ? 's' : ''} sélectionné{selectedItems.length > 1 ? 's' : ''}
                </span>
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
                {config.enableExport && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter la sélection
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {config.exportConfig?.formats.map(format => (
                        <DropdownMenuItem key={format} onClick={() => handleExport(format, true)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Exporter en {format}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Bulk Actions */}
                {config.bulkActions?.map(action => (
                  <Button
                    key={action.key}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={() => action.onClick(selectedItems, data)}
                    className={action.className}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}

                {/* Bulk Delete */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDeleteClick}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4 mb-6 p-4 bg-muted/50 rounded-lg">
          {/* Basic Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Global Search */}
            {config.enableSearch && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Recherche dans ${config.entityNamePlural.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {/* Advanced Filters Toggle */}
              {config.enableAdvancedFilters && (
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
              {config.enableColumnToggle && (
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
                        {config.columns.map(column => (
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
          {config.enableAdvancedFilters && showAdvancedFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Filtres par champ</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.columns.filter(col => col.filterable).map(column => (
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
                onClick={() => refetch()}
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
            <span className="ml-2 text-gray-600">Chargement des {config.entityNamePlural.toLowerCase()}...</span>
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
                    {config.enableBulkSelect && (
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
                    {config.columns.map(column => 
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
                    {config.actions.length > 0 && (
                      <ThemedTableHead className="text-center font-semibold text-white">Actions</ThemedTableHead>
                    )}
                  </ThemedTableRow>
                </ThemedTableHeader>
                <ThemedTableBody>
                  {paginatedData.map((item:any) => {
                    const itemId = config.getItemId(item)
                    return (
                      <ThemedTableRow 
                        key={itemId}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedItems.includes(itemId) ? 'bg-blue-50' : ''
                        }`}
                      >
                        {/* Select Checkbox */}
                        {config.enableBulkSelect && (
                          <ThemedTableCell>
                            <Checkbox
                              checked={selectedItems.includes(itemId)}
                              onCheckedChange={(checked) => handleSelectItem(itemId, !!checked)}
                              className="ml-2"
                            />
                          </ThemedTableCell>
                        )}
                        
                        {/* Data Columns */}
                        {config.columns.map(column => 
                          columnVisibility[column.key] && (
                            <ThemedTableCell key={column.key} className={`py-4 ${column.className || ''}`}>
                              {column.render ? 
                                column.render(item, (item as any)[column.key]) : 
                                String((item as any)[column.key] || 'N/A')
                              }
                            </ThemedTableCell>
                          )
                        )}
                        
                        {/* Actions */}
                        {config.actions.length > 0 && (
                          <ThemedTableCell className="py-4">
                            <div className="flex justify-center gap-1">
                              {config.actions.map(action => 
                                (!action.condition || action.condition(item)) && (
                                  <Button
                                    key={action.key}
                                    variant={action.variant || "ghost"}
                                    size="sm"
                                    className={`h-8 w-8 p-0 transition-colors ${action.className || ''}`}
                                    onClick={() => action.onClick(item)}
                                    title={action.label}
                                  >
                                    <action.icon className="h-4 w-4" />
                                  </Button>
                                )
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                                onClick={() => handleDeleteClick(itemId)}
                                title={`Supprimer ${config.entityName.toLowerCase()}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </ThemedTableCell>
                        )}
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
                {filteredData.length} {config.entityNamePlural.toLowerCase()}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Afficher:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(config.itemsPerPageOptions || [5, 10, 25, 50, 100]).map(option => (
                      <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                    ))}
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce {config.entityName.toLowerCase()} ? Cette action est irréversible.
                <br />
                <span className="font-medium text-gray-900 mt-2 block">
                  {config.getItemDisplayName && itemToDelete ? 
                    config.getItemDisplayName(data.find((item:any) => config.getItemId(item) === itemToDelete)!) :
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
                Êtes-vous sûr de vouloir supprimer {selectedItems.length} {config.entityName.toLowerCase()}{selectedItems.length > 1 ? 's' : ''} ? Cette action est irréversible.
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
                    Supprimer {selectedItems.length} {config.entityName.toLowerCase()}{selectedItems.length > 1 ? 's' : ''}
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