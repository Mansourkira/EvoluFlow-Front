"use client"

import { useEffect, useState } from 'react'
import { useCurrentUser, usePasswordChange } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Clock,
  Palette,
  Shield,
  Edit,
  Save,
  X,
  Upload,
  UserCog,
  Lock,
  Eye,
  EyeOff,
  Key,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { ThemeCustomizer } from '@/components/ThemeCustomizer'

interface ExtendedUser {
  id?: string
  email: string
  name: string
  role: string
  profil: string
  profilLabel: string
  typeUtilisateur: string
  telephone?: string
  adresse?: string
  complementAdresse?: string
  codePostal?: string
  ville?: string
  gouvernorat?: string
  pays?: string
  siteDefaut?: string
  heure?: string
  tempRaffraichissement?: string
  couleur?: string
  image?: string
  reinitialisation?: boolean
}

export default function ProfilePage() {
  const { getCurrentUser, user, isLoading, error } = useCurrentUser()
  const { changePassword, isLoading: isPasswordLoading, error: passwordError } = usePasswordChange()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ExtendedUser | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak')

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData(user as ExtendedUser)
    }
  }, [user])

  // Password strength validation
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength('weak')
    } else if (newPassword.length < 8) {
      setPasswordStrength('weak')
    } else if (newPassword.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setPasswordStrength('strong')
    } else {
      setPasswordStrength('medium')
    }
  }, [newPassword])

  const handleInputChange = (field: keyof ExtendedUser, value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      })
    }
  }

  const handleSave = async () => {
    if (!formData) return

    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Erreur",
          description: "Token d'authentification manquant",
          variant: "destructive"
        })
        return
      }

      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nom_Prenom: formData.name,
          E_mail: formData.email,
          Telephone: formData.telephone,
          Adresse: formData.adresse,
          Complement_adresse: formData.complementAdresse,
          Code_Postal: formData.codePostal,
          Ville: formData.ville,
          Gouvernorat: formData.gouvernorat,
          Pays: formData.pays,
          Couleur: formData.couleur,
          Temp_Raffraichissement: formData.tempRaffraichissement
        })
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès"
        })
        setIsEditing(false)
        getCurrentUser() // Refresh user data
      } else {
        const errorData = await response.json()
        toast({
          title: "Erreur",
          description: errorData.error || "Erreur lors de la mise à jour",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(user as ExtendedUser)
    setIsEditing(false)
  }

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive"
      })
      return
    }

    const success = await changePassword(currentPassword, newPassword, confirmPassword)
    
    if (success) {
      toast({
        title: "Succès",
        description: "Mot de passe modifié avec succès"
      })
      // Reset password form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setIsChangingPassword(false)
    }
  }

  const handleCancelPasswordChange = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setIsChangingPassword(false)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A90DA]"></div>
        <span className="ml-2">Chargement du profil...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
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
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Aucun utilisateur connecté</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-1">Gérez vos informations personnelles</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-[#3A90DA] hover:bg-[#2B75BD]">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
                <Button 
                  onClick={handleCancel} 
                  variant="outline"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={formData.image || '/placeholder-user.jpg'} 
                    alt={formData.name} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#3A90DA] to-[#2B75BD] text-white text-2xl font-bold">
                    {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-[#3A90DA] hover:bg-[#2B75BD]"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                  <Badge className="bg-[#3A90DA] text-white">
                    {formData.profilLabel}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{formData.email}</p>
                <div className="flex gap-2">
                  <Badge variant="outline">{formData.typeUtilisateur}</Badge>
                  <Badge variant="secondary">{formData.role}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Vos informations personnelles et de contact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.name || 'Non spécifié'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {formData.email || 'Non spécifié'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                {isEditing ? (
                  <Input
                    id="telephone"
                    value={formData.telephone || ''}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {formData.telephone || 'Non spécifié'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="pays">Pays</Label>
                {isEditing ? (
                  <Input
                    id="pays"
                    value={formData.pays || ''}
                    onChange={(e) => handleInputChange('pays', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    {formData.pays || 'Non spécifié'}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="adresse">Adresse</Label>
              {isEditing ? (
                <Textarea
                  id="adresse"
                  value={formData.adresse || ''}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              ) : (
                <p className="mt-1 text-gray-900 flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  {formData.adresse || 'Non spécifié'}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="codePostal">Code Postal</Label>
                {isEditing ? (
                  <Input
                    id="codePostal"
                    value={formData.codePostal || ''}
                    onChange={(e) => handleInputChange('codePostal', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.codePostal || 'Non spécifié'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ville">Ville</Label>
                {isEditing ? (
                  <Input
                    id="ville"
                    value={formData.ville || ''}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.ville || 'Non spécifié'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gouvernorat">Gouvernorat</Label>
                {isEditing ? (
                  <Input
                    id="gouvernorat"
                    value={formData.gouvernorat || ''}
                    onChange={(e) => handleInputChange('gouvernorat', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{formData.gouvernorat || 'Non spécifié'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Préférences système
            </CardTitle>
            <CardDescription>
              Vos préférences d'utilisation de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="couleur">Couleur préférée</Label>
                {isEditing ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="couleur"
                      type="color"
                      value={formData.couleur || '#3A90DA'}
                      onChange={(e) => handleInputChange('couleur', e.target.value)}
                      className="w-16 h-10 p-1 border rounded-md"
                    />
                    <Input
                      value={formData.couleur || '#3A90DA'}
                      onChange={(e) => handleInputChange('couleur', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-2">
                    <Palette className="h-4 w-4 text-gray-400" />
                    <span 
                      className="inline-block w-4 h-4 rounded border"
                      style={{ backgroundColor: formData.couleur || '#3A90DA' }}
                    ></span>
                    {formData.couleur || '#3A90DA'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tempRaffraichissement">Temps de rafraîchissement (secondes)</Label>
                {isEditing ? (
                  <Input
                    id="tempRaffraichissement"
                    type="number"
                    value={formData.tempRaffraichissement || ''}
                    onChange={(e) => handleInputChange('tempRaffraichissement', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formData.tempRaffraichissement || 'Non spécifié'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Site par défaut</Label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                {formData.siteDefaut || 'Non spécifié'}
              </p>
            </div>

            <div>
              <Label>Profil système</Label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                {formData.profilLabel} ({formData.profil})
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Modifiez votre mot de passe pour sécuriser votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isChangingPassword ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#3A90DA]/10 rounded-full">
                    <Lock className="h-4 w-4 text-[#3A90DA]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mot de passe</p>
                    <p className="text-sm text-gray-500">Dernière modification: il y a quelques jours</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsChangingPassword(true)}
                  variant="outline"
                  className="border-[#3A90DA] text-[#3A90DA] hover:bg-[#3A90DA] hover:text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                    Mot de passe actuel
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-[#3A90DA] focus:ring-[#3A90DA]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-[#3A90DA] focus:ring-[#3A90DA]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword.length > 0 && (
                    <div className="space-y-2 mt-2">
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

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-[#3A90DA] focus:ring-[#3A90DA]"
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
                    <div className="flex items-center space-x-2 mt-2">
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
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">Exigences du mot de passe:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li className={`flex items-center gap-2 ${newPassword.length >= 8 ? 'text-green-600' : 'text-blue-700'}`}>
                      {newPassword.length >= 8 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      Au moins 8 caractères
                    </li>
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-blue-700'}`}>
                      {/[A-Z]/.test(newPassword) ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      Une lettre majuscule
                    </li>
                    <li className={`flex items-center gap-2 ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-blue-700'}`}>
                      {/[a-z]/.test(newPassword) ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      Une lettre minuscule
                    </li>
                    <li className={`flex items-center gap-2 ${/\d/.test(newPassword) ? 'text-green-600' : 'text-blue-700'}`}>
                      {/\d/.test(newPassword) ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      Un chiffre
                    </li>
                  </ul>
                </div>

                {/* Error Display */}
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {passwordError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={isPasswordLoading || newPassword !== confirmPassword || newPassword.length < 8}
                    className="flex-1 bg-[#3A90DA] hover:bg-[#2B75BD]"
                  >
                    {isPasswordLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Modification en cours...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancelPasswordChange}
                    variant="outline"
                    disabled={isPasswordLoading}
                    className="border-gray-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theme Customization Section */}
        <ThemeCustomizer />
      </div>
    </div>
  )
} 