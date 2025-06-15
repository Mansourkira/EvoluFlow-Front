"use client"

import { useEffect } from 'react'
import { useCurrentUser } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Shield } from 'lucide-react'

export default function UserProfile() {
  const { getCurrentUser, user, isLoading, error } = useCurrentUser()

  useEffect(() => {
    // Fetch current user data when component mounts
    getCurrentUser()
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A90DA]"></div>
          <span className="ml-2">Chargement du profil...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-red-600 text-center">
            <p>{error}</p>
            <Button 
              onClick={getCurrentUser} 
              className="mt-4"
              variant="outline"
            >
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Aucun utilisateur connecté</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#3A90DA] to-[#62ace1] rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          {user.name}
        </CardTitle>
        <CardDescription className="text-gray-600">
          Profil utilisateur
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Email</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">Rôle</p>
            <p className="text-sm text-gray-600 capitalize">{user.role}</p>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={getCurrentUser}
            variant="outline" 
            className="w-full"
          >
            Actualiser le profil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 