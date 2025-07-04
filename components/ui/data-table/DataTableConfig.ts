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

export interface DataTableConfig<T> {
  title?: string
  description?: string
  entityName: string
  entityNamePlural: string
  data: T[]
  isLoading?: boolean
  error?: string | null
  refetch?: () => void
  columns: {
    key: string
    label: string
    icon?: LucideIcon
    width?: string
    className?: string
    sortable?: boolean
    filterable?: boolean
    searchable?: boolean
    render?: (item: T, value: any) => React.ReactNode
  }[]
  getItemId: (item: T) => string
  getItemDisplayName?: (item: T) => string
  enableSearch?: boolean
  enableAdvancedFilters?: boolean
  enableBulkSelect?: boolean
  enableColumnToggle?: boolean
  enableRefresh?: boolean
  enableExport?: boolean
  itemsPerPageOptions?: number[]
  exportConfig?: {
    formats: string[]
  }
  onDelete?: (itemId: string) => Promise<void>
  onBulkDelete?: (itemIds: string[]) => Promise<void>
  onExport?: (format: string, data: T[]) => void
  actions: {
    key: string
    label: string
    icon: LucideIcon
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    className?: string
    condition?: (item: T) => boolean
    onClick: (item: T) => void
  }[]
  bulkActions?: {
    key: string
    label: string
    icon: LucideIcon
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    className?: string
    onClick: (selectedItems: string[], data: T[]) => void
  }[]
} 