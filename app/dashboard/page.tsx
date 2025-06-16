"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStatus, useLogout } from "@/hooks/useAuth"
import { Users, FileText, TrendingUp, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuthStatus()
  const { logout } = useLogout()

  const router = useRouter()

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      router.push('/login')
    }
  }
  if (!user) {
    return null
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, <span 
            className="cursor-pointer hover:text-[#3A90DA] transition-colors"
            onClick={() => {
            handleLogout()
            }}
          >
            {user.name}
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-[#3A90DA] text-white">
            {user.profilLabel || user.role}
          </Badge>
          <Badge variant="outline" className="text-gray-600">
            Profil: {user.profil}
          </Badge>
          <span className="text-gray-600">{user.email}</span>
        </div>
        <div className="text-sm text-gray-500">
          Type: {user.typeUtilisateur}
        </div>
      </div>

      {/* Dashboard Cards */}
   {/*    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Candidats Actifs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dossiers en cours
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">
              +15% depuis la semaine dernière
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Examens planifiés
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              Pour ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de réussite
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.4% depuis le trimestre dernier
            </p>
          </CardContent>
        </Card>
      </div> */}

      {/* Recent Activity */}
     {/*  <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Aperçu des dernières actions sur votre plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Nouveau candidat inscrit",
                details: "Jean Dupont - Candidature pour Formation Web",
                time: "Il y a 2 heures"
              },
              {
                action: "Dossier validé",
                details: "Marie Martin - Dossier complet validé",
                time: "Il y a 4 heures"
              },
              {
                action: "Examen programmé",
                details: "Examen de niveau - 25 candidats inscrits",
                time: "Il y a 1 jour"
              },
              {
                action: "Rapport généré",
                details: "Rapport mensuel des admissions",
                time: "Il y a 2 jours"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-[#3A90DA] rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.details}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
