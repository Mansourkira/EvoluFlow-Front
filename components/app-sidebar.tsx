"use client"

import * as React from "react"
import { useTheme } from "@/hooks/useTheme"
import {
  Users,
  FileText,
  Settings,
  Languages,
  FolderOpen,
  PenTool,
  Package,
  TrendingUp,
  MessageSquare,
  Shield,
  UserCheck,
  Eye,
  GraduationCap,
  Building2,
  UserCog,
  CreditCard,
  Building,
  User,
  LogOut,
  Database,
  Home,
  BookOpen
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStatus, useLogout } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Types for user roles
type UserRole = 'admin' | 'consultant' | 'prospect' | 'candidat' | 'professeur' | 'direction' | 'financier' | 'organisme' | 'administratif'

// Navigation structure
const getNavigationByRole = (role: UserRole, user: any) => {
  const baseNavigation = {
    dashboard: {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: Home,
    },
    fichierBase: {
      title: "Fichier de base",
      url: "#",
      icon: Database,
      items: [
        // Direct items under Fichier de base
        {
          title: "Organisme concerné",
          url: "/dashboard/organisme",
          icon: Building,
        },
        {
          title: "Professeur",
          url: "/dashboard/professeur",
          icon: GraduationCap,
        },
        {
          title: "Client",
          url: "/dashboard/client",
          icon: User,
        },
        // Subcategories under Fichier de base
        {
          title: "Sécurité",
          url: "#",
          icon: Shield,
          items: [
            {
              title: "Utilisateurs",
              url: "/dashboard/users",
              icon: Users,
            },
          ],
        },
        {
          title: "Paramétrage Divers",
          url: "#",
          icon: Settings,
          items: [
            {
              title: "Société",
              url: "/dashboard/societe",
              icon: Building2,
            },
            {
              title: "Site",
              url: "/dashboard/sites",
              icon: Building,
            },
            {
              title: "Filière",
              url: "/dashboard/filieres",
              icon: FolderOpen,
            },
            {
              title: "Types de Facturation",
              url: "/dashboard/type-facturation",
              icon: CreditCard,
            },
          ],
        },
        {
          title: "Traitement Dossier",
          url: "#",
          icon: FileText,
          items: [
            {
              title: "Liste des Documents",
              url: "/dashboard/documents",
              icon: FileText,
            },
          ],
        },
        {
          title: "Cours-Examens",
          url: "#",
          icon: PenTool,
          items: [
            {
              title: "Types de Cours",
              url: "/dashboard/course-types",
              icon: BookOpen,
            },
            {
              title: "Salle",
              url: "/dashboard/salle",
              icon: Building,
            },
            {
              title: "Modules",
              url: "/dashboard/modules",
              icon: Package,
            },
          ],
        },
        {
          title: "Prospect-Candidat",
          url: "#",
          icon: User,
          items: [
            {
              title: "opérations Prospect",
              url: "/dashboard/prospect",
              icon: User,
            },
            {
              title: "Candidat",
              url: "/dashboard/candidat",
              icon: User,
            },
            {
              title: "Situation Actuelle",
              url: "/dashboard/situations",
              icon: User,
            },
          ],
        },
      ],
    },
    
  }

  // Filter navigation based on user role
  const getNavItems = () => {
    const items = []
    
    // Always include dashboard as the first item
    items.push(baseNavigation.dashboard)
    
    // Always include fichier de base as main category
    items.push(baseNavigation.fichierBase)
    
    // Always include paramètres
    
    switch (role) {
      case 'admin':
        break
      case 'direction':
        break
      case 'consultant':
        break
      case 'professeur':
        // Professeur has access to specific parts of Fichier de base
        break
      case 'financier':
        break
    }
    
    return items
  }

  return getNavItems()
}

// Logo component for the organization
const EvoluFlowLogo = () => (
  <img 
    src="/sigle1.png"  
    alt="EvoluFlow" 
    className="h-6 w-6 object-contain"
  />
)

// Team/Organization data
const getTeamData = (user: any) => {
  return [{
    name: "EvoluFlow",
    logo: EvoluFlowLogo,
  }]
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAuthenticated } = useAuthStatus()
  const { logout } = useLogout()
  const { colors } = useTheme()
  const router = useRouter()
  const [navigationData, setNavigationData] = useState<any>(null)

  useEffect(() => {
    if (user && isAuthenticated) {
      const userRole = user.role as UserRole
      const navItems = getNavigationByRole(userRole, user)
      const teams = getTeamData(user)

      setNavigationData({
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar || `/avatars/${user.name.split(' ')[0].toLowerCase()}.jpg`,
        },
        teams,
        navMain: navItems,
      })
    }
  }, [user, isAuthenticated])

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      router.push('/login')
    }
  }



  if (!isAuthenticated || !user || !navigationData) {
    return null
  }

  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
      style={{
        '--sidebar-background': colors.sidebar.background,
        '--sidebar-foreground': colors.sidebar.text,
        '--sidebar-primary': colors.sidebar.accent,
        '--sidebar-accent': colors.sidebar.backgroundLight,
        '--sidebar-border': colors.sidebar.border
      } as React.CSSProperties}
    >
      <SidebarHeader>
        <TeamSwitcher teams={navigationData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
      </SidebarContent>
     {/*  <SidebarFooter>
        <NavUser 
          user={navigationData.user}
        />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}

