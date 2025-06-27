import React from 'react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface ThemedTableProps {
  children: React.ReactNode
  className?: string
}

interface ThemedTableHeaderProps {
  children: React.ReactNode
  className?: string
}

interface ThemedTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  className?: string
  isAlt?: boolean
}

interface ThemedTableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  className?: string
  isHeader?: boolean
}

export function ThemedTable({ children, className }: ThemedTableProps) {
  const { colors } = useTheme()
  
  return (
    <div className="rounded-md border overflow-hidden">
      <table 
        className={cn("w-full caption-bottom text-sm", className)}
        style={{
          borderColor: colors.table.border
        }}
      >
        {children}
      </table>
    </div>
  )
}

export function ThemedTableHeader({ children, className }: ThemedTableHeaderProps) {
  const { colors } = useTheme()
  
  return (
    <thead 
      className={cn("[&_tr]:border-b", className)}
      style={{
        backgroundColor: colors.table.header,
        borderColor: colors.table.headerBorder
      }}
    >
      {children}
    </thead>
  )
}

export function ThemedTableBody({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)}>
      {children}
    </tbody>
  )
}

export function ThemedTableRow({ children, className, isAlt = false, style, onMouseEnter, onMouseLeave, ...props }: ThemedTableRowProps) {
  const { colors } = useTheme()
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = colors.table.rowHover
    if (onMouseEnter) onMouseEnter(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = isAlt ? colors.table.rowAlt : colors.table.row
    if (onMouseLeave) onMouseLeave(e)
  }

  return (
    <tr 
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      style={{
        backgroundColor: isAlt ? colors.table.rowAlt : colors.table.row,
        borderColor: colors.table.border,
        '--hover-bg': colors.table.rowHover,
        ...style
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </tr>
  )
}

export function ThemedTableCell({ children, className, isHeader = false, style, ...props }: ThemedTableCellProps) {
  const { colors } = useTheme()
  
  const Tag = isHeader ? 'th' : 'td'
  
  return (
    <Tag 
      className={cn(
        "p-4 align-middle",
        isHeader ? "h-12 px-4 text-left align-middle font-medium text-muted-foreground" : "[&:has([role=checkbox])]:pr-0",
        className
      )}
      style={{
        color: isHeader ? colors.table.headerText : colors.text.primary,
        borderColor: colors.table.border,
        ...style
      }}
      {...props}
    >
      {children}
    </Tag>
  )
}

interface ThemedTableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  className?: string
}

export function ThemedTableHead({ children, className, ...props }: ThemedTableHeadProps) {
  return (
    <ThemedTableCell isHeader={true} className={className} {...props}>
      {children}
    </ThemedTableCell>
  )
} 