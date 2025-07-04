import { useState, useRef, useCallback, useMemo } from 'react'
import { DataTableConfig } from '@/components/ui/data-table/DataTableConfig'

export function useDataTable<T>({ config }: { config: DataTableConfig<T> }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [fieldFilters, setFieldFilters] = useState<Record<string, string>>({})
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortField, setSortField] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    return config.columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  })
  const selectAllRef = useRef<HTMLButtonElement>(null)

  const data = config.data || []
  const isLoading = config.isLoading || false
  const error = config.error || null
  const refetch = config.refetch || (() => {})

  // Filter data based on search term and field filters
  const filteredData = useMemo(() => {
    return data.filter((item: T) => {
      // Global search
      if (searchTerm) {
        const searchFields = config.columns.filter(col => col.searchable !== false).map(col => col.key)
        const matchesSearch = searchFields.some(field => 
          String((item as any)[field]).toLowerCase().includes(searchTerm.toLowerCase())
        )
        if (!matchesSearch) return false
      }

      // Field filters
      for (const [field, value] of Object.entries(fieldFilters)) {
        if (!value) continue
        if (!String((item as any)[field]).toLowerCase().includes(value.toLowerCase())) {
          return false
        }
      }

      return true
    })
  }, [data, searchTerm, fieldFilters])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData
    
    return [...filteredData].sort((a: T, b: T) => {
      const aVal = (a as any)[sortField]
      const bVal = (b as any)[sortField]
      
      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      
      const comparison = aVal > bVal ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortField, sortDirection])

  // Paginate data
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  // Handlers
  const updateFieldFilter = (field: string, value: string) => {
    setFieldFilters(prev => ({ ...prev, [field]: value }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setFieldFilters({})
    setCurrentPage(1)
  }

  const getActiveFiltersCount = () => {
    return Object.values(fieldFilters).filter(Boolean).length + (searchTerm ? 1 : 0)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? sortedData.map(item => config.getItemId(item)) : [])
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev => 
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    )
  }

  const isAllSelected = sortedData.length > 0 && selectedItems.length === sortedData.length
  const isIndeterminate = selectedItems.length > 0 && !isAllSelected

  const clearSelection = () => setSelectedItems([])

  const toggleColumnVisibility = (columnKey: string) => {
    setColumnVisibility(prev => ({ ...prev, [columnKey]: !prev[columnKey] }))
  }

  const handleDelete = async (itemId: string) => {
    if (config.onDelete) {
      await config.onDelete(itemId)
      clearSelection()
      refetch()
    }
  }

  const handleBulkDelete = async (itemIds: string[]) => {
    if (config.onBulkDelete) {
      await config.onBulkDelete(itemIds)
      clearSelection()
      refetch()
    }
  }

  const handleExport = (format: string, selectedOnly: boolean = false) => {
    if (config.onExport) {
      const dataToExport = selectedOnly ? 
        sortedData.filter(item => selectedItems.includes(config.getItemId(item))) :
        sortedData
      config.onExport(format, dataToExport)
    }
  }

  return {
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
  }
} 