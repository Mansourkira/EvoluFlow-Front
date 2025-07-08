"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { usePasswordReset } from "@/hooks/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const userEmail = searchParams.get('email') || ''
  const backendMessage = searchParams.get('message') || ''
  
  // Use custom hook for password reset
  const { resetPassword, isLoading, error } = usePasswordReset()

  // Check if user has valid token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  // Password strength validation
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength('weak')
    } else if (newPassword.length < 6) {
      setPasswordStrength('weak')
    } else if (newPassword.length >= 6 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setPasswordStrength('strong')
    } else {
      setPasswordStrength('medium')
    }
  }, [newPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      })
      return
    }

    const result = await resetPassword(newPassword, confirmPassword)
    
    if (result?.expired) {
      toast({
        title: "Action expirée",
        description: "Le lien de réinitialisation a expiré (délai de 1 heure dépassé)",
        variant: "destructive"
      })
      
      // Clear token and redirect to login after a short delay
      setTimeout(() => {
        localStorage.removeItem('token')
        router.push('/login')
      }, 2000)
      return
    }
    
    if (result?.success) {
      toast({
        title: "✅ Succès",
        description: "Mot de passe réinitialisé avec succès. Connexion automatique en cours...",
        variant: "default"
      })
      
      // Redirect to dashboard after successful reset
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else {
      // If there's an error but not expired
      toast({
        title: "❌ Erreur",
        description: error || "Une erreur est survenue lors de la réinitialisation du mot de passe",
        variant: "destructive"
      })
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Faible'
      case 'medium': return 'Moyen'
      case 'strong': return 'Fort'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4" style={{ fontFamily: "Cairo, sans-serif" }}>
      <div className="w-full max-w-md">
        <Card className="border-2 shadow-2xl bg-white backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center items-center pt-4 mb-4">
              <div className="relative">
                <Image 
                  src="/logo1.png" 
                  alt="EvoluFlow Logo" 
                  width={120} 
                  height={120} 
                  className="rounded-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-2">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Réinitialisation du mot de passe
            </CardTitle>
                         <CardDescription className="text-gray-600">
               {backendMessage || 'Votre mot de passe doit être réinitialisé pour des raisons de sécurité'}
             </CardDescription>
             {userEmail && (
               <div className="mt-3 p-2 bg-blue-50 rounded-md">
                 <p className="text-sm text-blue-700">
                   Compte: {userEmail}
                 </p>
               </div>
             )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Security Notice */}
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  Pour votre sécurité, vous devez définir un nouveau mot de passe avant de continuer.
                </AlertDescription>
              </Alert>

              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                
                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Force du mot de passe:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength === 'weak' ? 'text-red-600' : 
                        passwordStrength === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ 
                          width: passwordStrength === 'weak' ? '33%' : 
                                 passwordStrength === 'medium' ? '66%' : '100%' 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 focus:border-[#3A90DA] focus:ring-[#3A90DA]"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                
                {/* Password Match Indicator */}
                {confirmPassword.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {newPassword === confirmPassword ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">Les mots de passe correspondent</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-600">Les mots de passe ne correspondent pas</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-medium">Exigences du mot de passe:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                    Au moins 8 caractères
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                    Une lettre majuscule
                  </li>
                  <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                    Une lettre minuscule
                  </li>
                  <li className={/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                    Un chiffre
                  </li>
                </ul>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3A90DA] to-[#62ace1] hover:from-[#2980c9] hover:to-[#5a9bd4] text-white font-semibold py-2.5 transition-all duration-200"
                disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 6}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Réinitialisation en cours...
                  </div>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 