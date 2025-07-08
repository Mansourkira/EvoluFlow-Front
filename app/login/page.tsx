"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Lock, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLogin, useAuthStatus } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  // Use custom hook for login
  const { login, isLoading, error } = useLogin()
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus()

  // Check if user is already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await login(email, password)
    
    if (result) {
      // Check if password reset is required
      if (result.requiresPasswordReset) {
        // Redirect to password reset page with user email and message
        const params = new URLSearchParams({
          email: email,
          message: result.message || 'Veuillez changer votre mot de passe'
        })
        router.push(`/reset-password?${params.toString()}`)
        return
      }
      
      // Login successful - redirect to dashboard
      // Force a small delay to ensure localStorage is updated
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } else {
      // Check if it's an expired reset password request
      if (error && error.includes('expiré')) {
        toast({
          title: "⚠️ Demande expirée",
          description: error,
          variant: "destructive",
          duration: 6000
        })
      }
    }
    // Error handling is done by the hook and displayed in the UI
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A90DA]"></div>
      </div>
    )
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6]" style={{ fontFamily: "Cairo, sans-serif" }}>
      {/* Navigation */}
     <Navbar activeLink="login" />

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">
                      {/* Login Card */}
            <Card className="border-2 shadow-2xl bg-white backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center items-center  pt-4">
                  <Image 
                    src="/logo1.png" 
                    alt="EvoluFlow Logo" 
                    width={150} 
                    height={150} 
                    className="rounded-lg"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Connexion</CardTitle>
                <CardDescription className="text-gray-600">
                  Accédez à votre espace EvoluFlow
                </CardDescription>
              </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-[#3A90DA] focus:ring-[#3A90DA]"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-[#3A90DA] focus:ring-[#3A90DA]"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                
                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#3A90DA] to-[#62ace1] hover:from-[#2980c9] hover:to-[#5a9bd4] text-white font-semibold py-2.5 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </Button>

             
              </form>

         
            </CardContent>
          </Card>

    
        </div>
      </main>
    </div>
  )
}
