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
import { getCompanyConfig, isFeatureEnabled } from "@/config/company"

// Types for user roles
type UserRole = 'admin' | 'consultant' | 'prospect' | 'candidat' | 'professeur' | 'direction' | 'financier' | 'organisme' | 'administratif'

// Navigation structure based on company configuration
const getNavigationByRole = (role: UserRole, user: any) => {
  const config = getCompanyConfig()
  
  const baseNavigation = {
    dashboard: {
      title: config.dashboardTitle,
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    gestion: {
      title: "Gestion",
      url: "#",
      icon: FolderOpen,
      items: [
        // Conditionally include features based on configuration
        ...(isFeatureEnabled('candidatesManagement') ? [{
          title: config.industry === 'Santé' ? 'Gestion des Patients' : 
                config.industry === 'Ressources Humaines' ? 'Candidats Emploi' :
                'Gestion des Candidats',
          url: "/dashboard/candidats",
          icon: Users,
        }] : []),
        ...(isFeatureEnabled('prospectsManagement') ? [{
          title: config.industry === 'Immobilier' ? 'Prospects Immobiliers' :
                config.industry === 'Ressources Humaines' ? 'Entreprises Clientes' :
                'Gestion des Prospects',
          url: "/dashboard/prospects",
          icon: Eye,
        }] : []),
        ...(isFeatureEnabled('languageTools') ? [{
          title: "Outils Langue",
          url: "/dashboard/outils-langue",
          icon: Languages,
        }] : []),
        ...(isFeatureEnabled('fileProcessing') ? [{
          title: config.industry === 'Santé' ? 'Dossiers Médicaux' :
                config.industry === 'Immobilier' ? 'Documents Propriétés' :
                config.industry === 'Ressources Humaines' ? 'Traitement CV' :
                'Traitement Dossier',
          url: "/dashboard/traitement-dossier",
          icon: FileText,
        }] : []),
        ...(isFeatureEnabled('examinations') ? [{
          title: config.industry === 'Santé' ? 'Examens Médicaux' :
                config.industry === 'Ressources Humaines' ? 'Tests de Compétences' :
                'Examens',
          url: "/dashboard/examens",
          icon: PenTool,
        }] : []),
        ...(isFeatureEnabled('products') ? [{
          title: config.industry === 'Immobilier' ? 'Propriétés' :
                config.industry === 'Éducation et Formation' ? 'Formations' :
                'Produits',
          url: "/dashboard/produits",
          icon: Package,
        }] : []),
      ].filter(item => item), // Remove empty items
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
        ...(isFeatureEnabled('marketing') ? [{
          title: "Marketing",
          url: "/dashboard/marketing",
          icon: TrendingUp,
        }] : []),
        ...(isFeatureEnabled('complaints') ? [{
          title: config.industry === 'Santé' ? 'Réclamations Patients' : 'Réclamations',
          url: "/dashboard/reclamations",
          icon: MessageSquare,
        }] : []),
        ...(isFeatureEnabled('reports') ? [{
          title: "Rapports",
          url: "/dashboard/rapports",
          icon: BarChart3,
        }] : []),
      ].filter(item => item),
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
          title: config.industry === 'Santé' ? 'Profil Patient' : 'Profil Prospect',
          url: "/dashboard/profil/prospect",
          icon: Eye,
        },
        {
          title: config.industry === 'Santé' ? 'Profil Médecin' :
                config.industry === 'Ressources Humaines' ? 'Profil Candidat' :
                'Profil Candidat',
          url: "/dashboard/profil/candidat",
          icon: User,
        },
        {
          title: config.industry === 'Éducation et Formation' ? 'Profil Professeur' :
                config.industry === 'Santé' ? 'Profil Spécialiste' :
                'Profil Expert',
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

  // Filter navigation based on user role and enabled features
  const getNavItems = () => {
    const items = []
    
    // Always include gestion if it has items
    if (baseNavigation.gestion.items.length > 0) {
      items.push(baseNavigation.gestion)
    }
    
    switch (role) {
      case 'admin':
        items.push(baseNavigation.parametrage)
        if (baseNavigation.communication.items.length > 0) {
          items.push(baseNavigation.communication)
        }
        if (isFeatureEnabled('profileManagement')) {
          items.push(baseNavigation.profils)
        }
        break
      case 'direction':
        if (baseNavigation.communication.items.length > 0) {
          items.push(baseNavigation.communication)
        }
        if (isFeatureEnabled('profileManagement')) {
          items.push(baseNavigation.profils)
        }
        break
      case 'consultant':
        if (baseNavigation.communication.items.length > 0) {
          items.push(baseNavigation.communication)
        }
        break
      case 'financier':
        if (isFeatureEnabled('profileManagement')) {
          items.push(baseNavigation.profils)
        }
        break
    }
    
    return items
  }

  return getNavItems()
}

// Team/Organization data based on configuration
const getTeamData = (user: any) => {
  const config = getCompanyConfig()
  
  return [{
    name: config.name,
    logo: Building2,
    plan: user?.role === 'admin' ? 'Admin' : 'Utilisateur',
  }]
}

// Projects based on user role and configuration
const getProjectsByRole = (role: UserRole) => {
  const config = getCompanyConfig()
  
  const allProjects = [
    ...(isFeatureEnabled('candidatesManagement') ? [{
      name: config.industry === 'Santé' ? 'Patients en traitement' :
            config.industry === 'Ressources Humaines' ? 'Candidatures actives' :
            'Candidatures en cours',
      url: "/dashboard/candidatures-cours",
      icon: Users,
    }] : []),
    ...(isFeatureEnabled('examinations') ? [{
      name: config.industry === 'Santé' ? 'Examens programmés' :
            config.industry === 'Ressources Humaines' ? 'Tests à venir' :
            'Examens à venir',
      url: "/dashboard/examens-venir", 
      icon: Calendar,
    }] : []),
    ...(isFeatureEnabled('reports') ? [{
      name: "Rapports mensuels",
      url: "/dashboard/rapports-mensuels",
      icon: BarChart3,
    }] : []),
    {
      name: "Documentation",
      url: "/dashboard/documentation",
      icon: BookOpen,
    },
  ].filter(item => item)

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
