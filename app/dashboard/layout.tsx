"use client"

import { AppSidebar } from "@/components/app-sidebar"
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
import { useAuthStatus } from "@/hooks/useAuth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuthStatus()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Generate breadcrumb based on current path
  const generateBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length <= 1) return "Tableau de bord"
    
    const breadcrumbMap: { [key: string]: string } = {
      'candidats': 'Gestion des Candidats',
      'prospects': 'Gestion des Prospects',
      'outils-langue': 'Outils Langue',
      'traitement-dossier': 'Traitement Dossier',
      'examens': 'Examens',
      'produits': 'Produits',
      'parametrage': 'Paramétrage',
      'marketing': 'Marketing',
      'reclamations': 'Réclamations',
      'rapports': 'Rapports',
      'profil': 'Gestion des Profils',
      'administration': 'Administration',
      'notifications': 'Notifications',
      'aide': "Centre d'Aide",
      'parametres': 'Paramètres'
    }
    
    return breadcrumbMap[segments[segments.length - 1]] || segments[segments.length - 1]
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">
                  Tableau de bord
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathname !== '/dashboard' && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{generateBreadcrumb()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <main className="flex flex-1 flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
} 