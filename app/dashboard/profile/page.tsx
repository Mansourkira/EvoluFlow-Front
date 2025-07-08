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
import { toast } from 'sonner'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Clock,
  Palette,
  Shield,
  Edit,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Key,
  AlertCircle,
  Heart,
  Camera,
  Loader2,
  CheckCircle,
  Info
} from 'lucide-react'
import { profileUpdateSchema, type ProfileUpdateFormData, EtatCivilOptions, SexeOptions } from '@/schemas/userSchema'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

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
  sexe?: 'Homme' | 'Femme'
  etatCivil?: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)'
  Derniere_connexion?: string
}

export default function ProfilePage() {
  const { getCurrentUser, user, isLoading, error } = useCurrentUser()
  const { changePassword, isLoading: isPasswordLoading, error: passwordError } = usePasswordChange()
  const [isEditing, setIsEditing] = useState(false)
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
    console.log("user", user)
    // Profile form
  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      Nom_Prenom: "",
      E_mail: "",
      Telephone: "",
      Adresse: "",
      Complement_adresse: "",
      Code_Postal: "",
      Ville: "",
      Gouvernorat: "",
      Pays: "Tunisie",
      Couleur: "",
      Temp_Raffraichissement: "",
      Image: null,
      Etat_Civil: undefined,
    },
  })

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (user) {
      form.reset({
        Nom_Prenom: user.name || "",
        E_mail: user.email || "",
        Telephone: user.telephone || "",
        Adresse: user.adresse || "",
        Complement_adresse: user.complementAdresse || "",
        Code_Postal: user.codePostal || "",
        Ville: user.ville || "",
        Gouvernorat: user.gouvernorat || "",
        Pays: user.pays || "Tunisie",
        Couleur: user.couleur || "",
        Derniere_connexion: user.Derniere_connexion || "",
        Heure: user.heure || "",
        Temp_Raffraichissement: user.tempRaffraichissement || "",
        Image: user.image || null,
        Etat_Civil: (user as any).etatCivil || undefined,
      })
    }
  }, [user, form])

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

  const onSubmit = async (data: ProfileUpdateFormData) => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté')
        return
      }

      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success('✅ Profil mis à jour avec succès')
        setIsEditing(false)
        getCurrentUser() // Refresh user data
      } else {
        const errorData = await response.json()
        toast.error(`❌ Erreur de mise à jour - ${errorData.error || 'Impossible de mettre à jour le profil'}`)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('❌ Erreur de connexion - Impossible de contacter le serveur')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    setIsEditing(false)
  }

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('⚠️ Veuillez remplir tous les champs')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('⚠️ Les mots de passe ne correspondent pas')
      return
    }

    if (newPassword.length < 8) {
      toast.error('⚠️ Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    try {
      await changePassword(currentPassword, newPassword, confirmPassword)
      toast.success('✅ Mot de passe modifié avec succès')
      handleCancelPasswordChange()
    } catch (error) {
      toast.error('❌ Erreur lors du changement de mot de passe')
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
      default: return 'Aucun'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4" />
          <p className="text-lg font-medium">Erreur de chargement du profil</p>
          <p className="text-sm text-gray-600 mt-2">Veuillez rafraîchir la page ou vous reconnecter</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Rafraîchir la page
          </Button>
        </div>
      </div>
    )
  }

  console.log("Dernieur connextion " , user)
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="gap-2">
            <Shield className="h-4 w-4" />
            {user.profilLabel}
          </Badge>
          <Badge variant="secondary" className="gap-2">
            <User className="h-4 w-4" />
            {user.typeUtilisateur}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Informations Personnelles</TabsTrigger>
          <TabsTrigger value="system">Informations Système</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle className="text-xl">Informations Personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations de base et de contact
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Modifier
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                    {(user as any).sexe && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Heart className="h-3 w-3" />
                        {(user as any).sexe}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Upload */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name="Image"
                        render={({ field: { value, onChange } }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Camera className="h-4 w-4" />
                              Photo de profil
                            </FormLabel>
                            <FormControl>
                              <ImageUpload
                                label="Choisir une nouvelle photo"
                                value={value}
                                onChange={onChange}
                                onError={(error) => toast.error(`❌ ${error}`)}
                                size="lg"
                                shape="circle"
                              />
                            </FormControl>
                            <FormDescription>
                              JPG, PNG ou GIF. Maximum 5MB.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informations de base
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Nom_Prenom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Votre nom complet" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="E_mail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input {...field} disabled className="bg-gray-100" />
                              </FormControl>
                              <FormDescription>
                                L'email ne peut pas être modifié
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="Telephone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Numéro de téléphone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="Etat_Civil"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>État Civil</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner l'état civil" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={EtatCivilOptions.CELIBATAIRE}>{EtatCivilOptions.CELIBATAIRE}</SelectItem>
                                  <SelectItem value={EtatCivilOptions.MARIE}>{EtatCivilOptions.MARIE}</SelectItem>
                                  <SelectItem value={EtatCivilOptions.DIVORCE}>{EtatCivilOptions.DIVORCE}</SelectItem>
                                  <SelectItem value={EtatCivilOptions.VEUF}>{EtatCivilOptions.VEUF}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Address Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Adresse
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="Adresse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse principale</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="Votre adresse" rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="Complement_adresse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complément d'adresse</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Appartement, étage, etc." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="Code_Postal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Code postal</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Code postal" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="Ville"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ville</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Ville" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="Gouvernorat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gouvernorat</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Gouvernorat" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="Pays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pays</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Pays" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Preferences */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Préférences
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Couleur"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Couleur de thème</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Couleur préférée" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="Temp_Raffraichissement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Temps de rafraîchissement</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Temps en secondes" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Enregistrer les modifications
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  {/* Display Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                      
                      {user.telephone && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{user.telephone}</span>
                          </div>
                        </div>
                      )}

                      {(user as any).etatCivil && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">État Civil</Label>
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <span>{(user as any).etatCivil}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {user.adresse && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Adresse</Label>
                          <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <div>{user.adresse}</div>
                              {user.complementAdresse && <div className="text-sm text-muted-foreground">{user.complementAdresse}</div>}
                              <div className="text-sm text-muted-foreground">
                                {user.codePostal} {user.ville}
                                {user.gouvernorat && `, ${user.gouvernorat}`}
                                {user.pays && `, ${user.pays}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Information Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informations Système
              </CardTitle>
              <CardDescription>
                Détails de votre compte et accès
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Site par défaut</span>
                    </div>
                    <span className="text-sm font-medium">{user.siteDefaut || 'Non défini'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Dernière connexion</span>
                    </div>
                    <span className="text-sm font-medium">
                      {user.Derniere_connexion 
                        ? new Date(user.Derniere_connexion).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Inconnue'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Thème</span>
                    </div>
                    <span className="text-sm font-medium">{user.couleur || 'Par défaut'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Rafraîchissement</span>
                    </div>
                    <span className="text-sm font-medium">{user.tempRaffraichissement || 'Automatique'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Gérez votre mot de passe et la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sécurité du compte</h3>
                  <p className="text-muted-foreground mb-6">
                    Maintenez votre compte sécurisé en changeant régulièrement votre mot de passe
                  </p>
                  <Button
                    onClick={() => setIsChangingPassword(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Conseils pour un mot de passe sécurisé
                      </span>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Au moins 8 caractères</li>
                      <li>• Mélange de lettres majuscules et minuscules</li>
                      <li>• Au moins un chiffre</li>
                      <li>• Caractères spéciaux recommandés</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Mot de passe actuel *</Label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Entrez votre mot de passe actuel"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Nouveau mot de passe *</Label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Entrez votre nouveau mot de passe"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {newPassword && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                                style={{ width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%' }}
                              />
                            </div>
                            <span className="text-sm font-medium">{getPasswordStrengthText()}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Confirmer le mot de passe *</Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmez votre nouveau mot de passe"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleCancelPasswordChange}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handlePasswordChange}
                        disabled={isPasswordLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {isPasswordLoading ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Changement...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmer le changement
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 