"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useTheme } from "@/hooks/useTheme"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStatus, useLogout } from "@/hooks/useAuth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useSocieteDialog } from "@/hooks/useSocieteDialog"
import { ViewSocieteDialog } from "@/components/societes/ViewSocieteDialog"
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  FileText,
  ChevronDown,
  Users,
  Eye,
  GraduationCap,
  Building,
  Building2,
  Shield,
  Package,
  FolderOpen,
  UserCog,
  UserCheck,
  CreditCard,
  Home,
  Database
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Search options extracted from sidebar navigation
const getSearchOptions = (userRole: string) => {
  const baseOptions = [
    { title: "Tableau de bord", url: "/dashboard", icon: Home, category: "Navigation" },
    { title: "Mon Profil", url: "/dashboard/profile", icon: User, category: "Navigation" },
    { title: "Utilisateurs", url: "/dashboard/users", icon: Users, category: "Sécurité" },
    { title: "Prospect", url: "/dashboard/prospect", icon: Eye, category: "Fichier de base" },
    { title: "Candidat", url: "/dashboard/candidat", icon: User, category: "Fichier de base" },
    { title: "Professeur", url: "/dashboard/professeur", icon: GraduationCap, category: "Fichier de base" },
    { title: "Client", url: "/dashboard/client", icon: User, category: "Fichier de base" },
    { title: "Organisme concerné", url: "/dashboard/organisme", icon: Building, category: "Fichier de base" },
    { title: "Société", url: "/dashboard/societe", icon: Building2, category: "Paramétrage" },
    { title: "Site", url: "/dashboard/sites", icon: Building, category: "Paramétrage" },
    { title: "Filière", url: "/dashboard/filiere", icon: FolderOpen, category: "Paramétrage" },
    { title: "Salle", url: "/dashboard/salle", icon: Building, category: "Cours-Examens" },
    { title: "Modules", url: "/dashboard/modules", icon: Package, category: "Cours-Examens" },
    { title: "Documents", url: "/dashboard/documents", icon: FileText, category: "Traitement Dossier" },
  ]

  // Add profile options based on role
  if (userRole === 'admin' || userRole === 'direction' || userRole === 'financier') {
    baseOptions.push(
      { title: "Profil Administratif", url: "/dashboard/profil/administratif", icon: Shield, category: "Profils" },
      { title: "Profil Consultant", url: "/dashboard/profil/consultant", icon: UserCheck, category: "Profils" },
      { title: "Profil Prospect", url: "/dashboard/profil/prospect", icon: Eye, category: "Profils" },
      { title: "Profil Candidat", url: "/dashboard/profil/candidat", icon: User, category: "Profils" },
      { title: "Profil Expert", url: "/dashboard/profil/professeur", icon: GraduationCap, category: "Profils" },
      { title: "Profil Direction", url: "/dashboard/profil/direction", icon: Building2, category: "Profils" },
      { title: "Profil Financier", url: "/dashboard/profil/financier", icon: CreditCard, category: "Profils" },
      { title: "Profil Organisme", url: "/dashboard/profil/organisme", icon: Building, category: "Profils" }
    )
  }

  return baseOptions
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuthStatus()
  const { logout } = useLogout()
  const { colors } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<any[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const { isOpen, societe, isLoading: societeLoading, error, openDialog, closeDialog } = useSocieteDialog()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Filter search options based on query
  useEffect(() => {
    if (searchQuery.length > 0 && user) {
      const options = getSearchOptions(user.role)
      const filtered = options.filter(option =>
        option.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredOptions(filtered)
      setShowSearchResults(filtered.length > 0)
      setHighlightedIndex(-1) // Reset highlighted index when search changes
    } else {
      setShowSearchResults(false)
      setFilteredOptions([])
      setHighlightedIndex(-1)
    }
  }, [searchQuery, user])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      router.push('/login')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // If there's a highlighted option, navigate to it, otherwise use first result
    const targetIndex = highlightedIndex >= 0 ? highlightedIndex : 0
    if (filteredOptions.length > targetIndex) {
      router.push(filteredOptions[targetIndex].url)
      setSearchQuery("")
      setShowSearchResults(false)
      setHighlightedIndex(-1)
    }
  }

  const handleOptionClick = (url: string) => {
    router.push(url)
    setSearchQuery("")
    setShowSearchResults(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || filteredOptions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex].url)
        } else if (filteredOptions.length > 0) {
          handleOptionClick(filteredOptions[0].url)
        }
        break
      case 'Escape':
        setShowSearchResults(false)
        setHighlightedIndex(-1)
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A90DA]"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Get page title based on pathname
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 1) return "Tableau de bord"
    if (segments[1] === "users") return "Gestion des utilisateurs"
    return segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Enhanced Professional Header */}
        <header className="bg-white/95 backdrop-blur-sm sticky top-0 flex h-20 shrink-0 items-center gap-4 border-b border-gray-200/60 px-6 z-50 shadow-sm">
          {/* Left Section: Sidebar Toggle + Logo */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1 h-8 w-8 hover:bg-gray-100 rounded-md transition-colors" />
            <Separator orientation="vertical" className="h-6 bg-gray-300" />
            <img 
              src="/admission1.png" 
              alt="Logo" 
              className="w-48 h-16 object-contain"
            />
          </div>
          
          {/* Center Section: Search Bar */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md" ref={searchRef}>
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    type="search"
                    placeholder="Rechercher une page..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white rounded-lg"
                    style={{
                      '--tw-ring-color': `${colors.primary}20`,
                      borderColor: searchQuery ? colors.form.borderFocus : colors.form.border
                    } as React.CSSProperties}
                  />
                </form>
                
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {filteredOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleOptionClick(option.url)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                          index === highlightedIndex 
                            ? 'hover:bg-gray-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: index === highlightedIndex ? `${colors.primary}10` : undefined,
                          borderColor: index === highlightedIndex ? `${colors.primary}20` : undefined
                        }}
                      >
                        <div 
                          className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0`}
                          style={{
                            backgroundColor: index === highlightedIndex ? `${colors.primary}20` : `${colors.primary}10`
                          }}
                        >
                          <option.icon 
                            className="h-4 w-4"
                            style={{ color: colors.primary }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p 
                            className="text-sm font-medium"
                            style={{
                              color: index === highlightedIndex ? colors.primary : colors.text.primary
                            }}
                          >
                            {option.title}
                          </p>
                          <p 
                            className="text-xs"
                            style={{
                              color: index === highlightedIndex ? `${colors.primary}70` : colors.text.secondary
                            }}
                          >
                            {option.category}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filteredOptions.length === 0 && searchQuery.length > 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        Aucun résultat trouvé
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section: Société, Notifications & User Menu */}
          <div className="flex items-center gap-3">
            {/* Société Info */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-gray-100"
              onClick={openDialog}
              title="Informations de la société"
            >
              <Building2 className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 w-9 p-0 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">3</span>
              </span>
            </Button>

            <Separator orientation="vertical" className="h-6 bg-gray-300" />

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 px-3 hover:bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                      <AvatarImage 
                        src={user.image || '/placeholder-user.jpg'} 
                        alt={user.name} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#3A90DA] to-[#2B75BD] text-white font-semibold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start min-w-0">
                      <span className="text-sm font-semibold text-gray-900 truncate max-w-24">
                        {user.name}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-[#3A90DA]/10 text-[#3A90DA] border-[#3A90DA]/20 font-medium"
                      >
                        {user.profilLabel || user.role}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 ml-1" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 p-2" 
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="p-3 pb-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {user.profil}
                      </Badge>
                      <Badge className="text-xs bg-[#3A90DA] text-white">
                        {user.typeUtilisateur}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    className="p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>Mon profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50">
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50">
                    <FileText className="mr-3 h-4 w-4" />
                    <span>Documentation</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="p-3 cursor-pointer hover:bg-red-50 text-red-600 focus:bg-red-50 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex flex-1 flex-col bg-gray-50/30">
          {children}
        </main>
      </SidebarInset>
      
      {/* Société Dialog */}
      <ViewSocieteDialog 
        societe={societe}
        open={isOpen}
        onOpenChange={closeDialog}
      />
    </SidebarProvider>
  )
} 