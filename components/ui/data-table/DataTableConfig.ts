import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

export interface TableColumn<T = any> {
  key: string
  label: string
  icon?: LucideIcon
  sortable?: boolean
  searchable?: boolean
  filterable?: boolean
  width?: string
  className?: string
  render?: (item: T, value: any) => ReactNode
  defaultVisible?: boolean
}

export interface TableAction<T = any> {
  key: string
  label: string
  icon: LucideIcon
  onClick: (item: T) => void
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  condition?: (item: T) => boolean
}

export interface BulkAction<T = any> {
  key: string
  label: string
  icon: LucideIcon
  onClick: (selectedItems: string[], items: T[]) => void
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  condition?: (selectedItems: string[]) => boolean
}

export interface ExportConfig {
  enabled: boolean
  formats: ('PDF' | 'Excel' | 'Word')[]
  fileName: string
}

export interface DataTableConfig<T = any> {
  // Basic configuration
  entityName: string
  entityNamePlural: string
  apiEndpoint: string
  
  // Table configuration
  columns: TableColumn<T>[]
  actions: TableAction<T>[]
  bulkActions?: BulkAction<T>[]
  
  // Features
  enableSearch?: boolean
  enableAdvancedFilters?: boolean
  enableBulkSelect?: boolean
  enableColumnToggle?: boolean
  enableExport?: boolean
  exportConfig?: ExportConfig
  enableRefresh?: boolean
  
  // Pagination
  defaultItemsPerPage?: number
  itemsPerPageOptions?: number[]
  
  // Styling
  title?: string
  description?: string
  
  // Data processing
  getItemId: (item: T) => string
  getItemDisplayName?: (item: T) => string
  
  // Custom hooks
  useDataHook: () => {
    data: T[]
    isLoading: boolean
    error: string | null
    refetch: () => void
  }
} 