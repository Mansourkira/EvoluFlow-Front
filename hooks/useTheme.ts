import { useState, useEffect, useCallback } from 'react'

export interface ThemeColors {
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: {
    primary: string
    secondary: string
    accent: string
  }
  sidebar: {
    background: string
    backgroundLight: string
    text: string
    textSecondary: string
    accent: string
    hover: string
    border: string
  }
  button: {
    primary: string
    primaryHover: string
    secondary: string
    secondaryHover: string
    success: string
    successHover: string
    danger: string
    dangerHover: string
  }
  table: {
    header: string
    headerText: string
    headerBorder: string
    row: string
    rowAlt: string
    rowHover: string
    border: string
  }
  form: {
    background: string
    border: string
    borderFocus: string
    text: string
    placeholder: string
  }
}

export interface ThemePreset {
  name: string
  colors: Partial<ThemeColors>
}

export interface ThemeConfig {
  colors: ThemeColors
  presets: ThemePreset[]
}

// Default theme fallback
const defaultTheme: ThemeColors = {
  primary: "#3A90DA",
  primaryLight: "#4A9FE7",
  primaryDark: "#2B75BD",
  secondary: "#6B7280",
  accent: "#10B981",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: {
    primary: "#1F2937",
    secondary: "#6B7280",
    accent: "#3A90DA"
  },
  sidebar: {
    background: "#1E293B",
    backgroundLight: "#334155",
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    accent: "#3A90DA",
    hover: "#334155",
    border: "#475569"
  },
  button: {
    primary: "#3A90DA",
    primaryHover: "#2B75BD",
    secondary: "#6B7280",
    secondaryHover: "#4B5563",
    success: "#10B981",
    successHover: "#059669",
    danger: "#EF4444",
    dangerHover: "#DC2626"
  },
  table: {
    header: "#F8FAFC",
    headerText: "#374151",
    headerBorder: "#E5E7EB",
    row: "#FFFFFF",
    rowAlt: "#F9FAFB",
    rowHover: "#F3F4F6",
    border: "#E5E7EB"
  },
  form: {
    background: "#FFFFFF",
    border: "#D1D5DB",
    borderFocus: "#3A90DA",
    text: "#1F2937",
    placeholder: "#9CA3AF"
  }
}

export function useTheme() {
  const [colors, setColors] = useState<ThemeColors>(defaultTheme)
  const [presets, setPresets] = useState<ThemePreset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load theme configuration
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // First try to load from localStorage (user customization)
        const savedTheme = localStorage.getItem('theme-colors')
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme)
          setColors(parsedTheme)
        }

        // Load available presets from JSON file
        const response = await fetch('/theme-config.json')
        if (response.ok) {
          const config: ThemeConfig = await response.json()
          setPresets(config.presets)
          
          // If no saved theme, use the default from config
          if (!savedTheme) {
            setColors(config.colors)
          }
        }
      } catch (error) {
        console.warn('Failed to load theme config, using default theme:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [])

  // Apply theme colors to CSS custom properties
  useEffect(() => {
    const root = document.documentElement
    
    // Apply all colors as CSS custom properties
    root.style.setProperty('--theme-primary', colors.primary)
    root.style.setProperty('--theme-primary-light', colors.primaryLight)
    root.style.setProperty('--theme-primary-dark', colors.primaryDark)
    root.style.setProperty('--theme-secondary', colors.secondary)
    root.style.setProperty('--theme-accent', colors.accent)
    root.style.setProperty('--theme-background', colors.background)
    root.style.setProperty('--theme-surface', colors.surface)
    
    // Text colors
    root.style.setProperty('--theme-text-primary', colors.text.primary)
    root.style.setProperty('--theme-text-secondary', colors.text.secondary)
    root.style.setProperty('--theme-text-accent', colors.text.accent)
    
    // Sidebar colors
    root.style.setProperty('--theme-sidebar-bg', colors.sidebar.background)
    root.style.setProperty('--theme-sidebar-bg-light', colors.sidebar.backgroundLight)
    root.style.setProperty('--theme-sidebar-text', colors.sidebar.text)
    root.style.setProperty('--theme-sidebar-text-secondary', colors.sidebar.textSecondary)
    root.style.setProperty('--theme-sidebar-accent', colors.sidebar.accent)
    root.style.setProperty('--theme-sidebar-hover', colors.sidebar.hover)
    root.style.setProperty('--theme-sidebar-border', colors.sidebar.border)
    
    // Button colors
    root.style.setProperty('--theme-button-primary', colors.button.primary)
    root.style.setProperty('--theme-button-primary-hover', colors.button.primaryHover)
    root.style.setProperty('--theme-button-secondary', colors.button.secondary)
    root.style.setProperty('--theme-button-secondary-hover', colors.button.secondaryHover)
    root.style.setProperty('--theme-button-success', colors.button.success)
    root.style.setProperty('--theme-button-success-hover', colors.button.successHover)
    root.style.setProperty('--theme-button-danger', colors.button.danger)
    root.style.setProperty('--theme-button-danger-hover', colors.button.dangerHover)
    
    // Table colors
    root.style.setProperty('--theme-table-header', colors.table.header)
    root.style.setProperty('--theme-table-header-text', colors.table.headerText)
    root.style.setProperty('--theme-table-header-border', colors.table.headerBorder)
    root.style.setProperty('--theme-table-row', colors.table.row)
    root.style.setProperty('--theme-table-row-alt', colors.table.rowAlt)
    root.style.setProperty('--theme-table-row-hover', colors.table.rowHover)
    root.style.setProperty('--theme-table-border', colors.table.border)
    
    // Form colors
    root.style.setProperty('--theme-form-bg', colors.form.background)
    root.style.setProperty('--theme-form-border', colors.form.border)
    root.style.setProperty('--theme-form-border-focus', colors.form.borderFocus)
    root.style.setProperty('--theme-form-text', colors.form.text)
    root.style.setProperty('--theme-form-placeholder', colors.form.placeholder)
  }, [colors])

  // Update theme colors
  const updateColors = useCallback((newColors: Partial<ThemeColors>) => {
    const updatedColors = { ...colors, ...newColors }
    setColors(updatedColors)
    localStorage.setItem('theme-colors', JSON.stringify(updatedColors))
  }, [colors])

  // Apply preset
  const applyPreset = useCallback((preset: ThemePreset) => {
    const updatedColors = { ...colors, ...preset.colors }
    setColors(updatedColors)
    localStorage.setItem('theme-colors', JSON.stringify(updatedColors))
  }, [colors])

  // Reset to default theme
  const resetToDefault = useCallback(() => {
    setColors(defaultTheme)
    localStorage.removeItem('theme-colors')
  }, [])

  // Get CSS custom property name for a color
  const getCSSVar = useCallback((colorPath: string) => {
    return `var(--theme-${colorPath.replace(/\./g, '-')})`
  }, [])

  return {
    colors,
    presets,
    isLoading,
    updateColors,
    applyPreset,
    resetToDefault,
    getCSSVar
  }
} 