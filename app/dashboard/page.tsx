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
          <Badge variant="outline" className="text-gray-600">
            Profil: {user.profil}
          </Badge>
          <Badge variant="secondary" className="bg-[#3A90DA] text-white">
            {user.profilLabel || user.role}
          </Badge>
          <span className="text-gray-600">{user.email}</span>
        </div>
        <div className="text-sm text-gray-500">
          Type: {user.typeUtilisateur}
        </div>
      </div>
    </div>
  )
}
