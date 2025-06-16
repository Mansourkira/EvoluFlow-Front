"use client"

import * as React from "react"
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
  BarChart3,
  BookOpen,
  Calendar,
  Database,
  Home
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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
      isActive: true,
    },
    gestion: {
      title: "Gestion",
      url: "#",
      icon: FolderOpen,
      items: [
        {
          title: 'Gestion des Candidats',
          url: "/dashboard/candidats",
          icon: Users,
        },
        {
          title: 'Gestion des Prospects',
          url: "/dashboard/prospects",
          icon: Eye,
        },
        {
          title: "Outils Langue",
          url: "/dashboard/outils-langue",
          icon: Languages,
        },
        {
          title: 'Traitement Dossier',
          url: "/dashboard/traitement-dossier",
          icon: FileText,
        },
        {
          title: 'Examens',
          url: "/dashboard/examens",
          icon: PenTool,
        },
        {
          title: 'Produits',
          url: "/dashboard/produits",
          icon: Package,
        },
      ],
    },
    parametrage: {
      title: "Paramétrage",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Configuration Générale",
          url: "/dashboard/parametrage/general",
          icon: Settings,
        },
        {
          title: "Paramètres Système",
          url: "/dashboard/parametrage/systeme",
          icon: Database,
        },
        {
          title: "Gestion des Rôles",
          url: "/dashboard/parametrage/roles",
          icon: Shield,
        },
        {
          title: "Configuration Entreprise",
          url: "/dashboard/parametrage/entreprise",
          icon: Building2,
        },
      ],
    },
    communication: {
      title: "Communication & Marketing",
      url: "#",
      icon: TrendingUp,
      items: [
        {
          title: "Marketing",
          url: "/dashboard/marketing",
          icon: TrendingUp,
        },
        {
          title: 'Réclamations',
          url: "/dashboard/reclamations",
          icon: MessageSquare,
        },
        {
          title: "Rapports",
          url: "/dashboard/rapports",
          icon: BarChart3,
        },
      ],
    },
    profils: {
      title: "Gestion des Profils",
      url: "#",
      icon: User,
      items: [
        {
          title: "Profil Administratif",
          url: "/dashboard/profil/administratif",
          icon: Shield,
        },
        {
          title: "Profil Consultant",
          url: "/dashboard/profil/consultant",
          icon: UserCheck,
        },
        {
          title: 'Profil Prospect',
          url: "/dashboard/profil/prospect",
          icon: Eye,
        },
        {
          title: 'Profil Candidat',
          url: "/dashboard/profil/candidat",
          icon: User,
        },
        {
          title: 'Profil Expert',
          url: "/dashboard/profil/professeur",
          icon: GraduationCap,
        },
        {
          title: "Profil Direction",
          url: "/dashboard/profil/direction",
          icon: Building2,
        },
        {
          title: "Profil Financier",
          url: "/dashboard/profil/financier",
          icon: CreditCard,
        },
        {
          title: "Profil Organisme",
          url: "/dashboard/profil/organisme",
          icon: Building,
        },
      ],
    },
  }

  // Filter navigation based on user role
  const getNavItems = () => {
    const items = []
    
    // Always include gestion
    items.push(baseNavigation.gestion)
    
    switch (role) {
      case 'admin':
        items.push(baseNavigation.parametrage)
        items.push(baseNavigation.communication)
        items.push(baseNavigation.profils)
        break
      case 'direction':
        items.push(baseNavigation.communication)
        items.push(baseNavigation.profils)
        break
      case 'consultant':
        items.push(baseNavigation.communication)
        break
      case 'financier':
        items.push(baseNavigation.profils)
        break
    }
    
    return items
  }

  return getNavItems()
}

// Team/Organization data
const getTeamData = (user: any) => {
  return [{
    name: "EvoluFlow",
    logo: Building2,
    plan: user?.role === 'admin' ? 'Admin' : 'Utilisateur',
  }]
}

// Projects based on user role
const getProjectsByRole = (role: UserRole) => {
  const allProjects = [
    {
      name: 'Candidatures en cours',
      url: "/dashboard/candidatures-cours",
      icon: Users,
    },
    {
      name: 'Examens à venir',
      url: "/dashboard/examens-venir", 
      icon: Calendar,
    },
    {
      name: "Rapports mensuels",
      url: "/dashboard/rapports-mensuels",
      icon: BarChart3,
    },
    {
      name: "Documentation",
      url: "/dashboard/documentation",
      icon: BookOpen,
    },
  ]

  // Filter projects based on role
  if (role === 'candidat' || role === 'prospect') {
    return allProjects.filter(p => p.name.includes('Candidatures') || p.name.includes('Documentation'))
  }
  
  return allProjects
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAuthenticated } = useAuthStatus()
  const { logout } = useLogout()
  const router = useRouter()
  const [navigationData, setNavigationData] = useState<any>(null)

  useEffect(() => {
    if (user && isAuthenticated) {
      const userRole = user.role as UserRole
      const navItems = getNavigationByRole(userRole, user)
      const teams = getTeamData(user)
      const projects = getProjectsByRole(userRole)

      setNavigationData({
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar || `/avatars/${user.name.split(' ')[0].toLowerCase()}.jpg`,
        },
        teams,
        navMain: navItems,
        projects,
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navigationData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        <NavProjects projects={navigationData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={navigationData.user}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
