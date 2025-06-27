import { useState, useEffect, useCallback } from 'react'

// Profile mapping
const PROFILE_MAPPING = {
  '01': 'Administratif',
  '02': 'Consultant', 
  '03': 'Prospect ou visiteur',
  '04': 'Candidat',
  '05': 'Professeur',
  '06': 'Direction',
  '07': 'Financier',
  '08': 'Organisme',
  '09': 'Admin'
} as const

// Types
interface User {
  id?: number | string
  email: string
  role: string
  name: string
  avatar?: string
  profil: string
  profilLabel: string
  typeUtilisateur: string
  status?: string
  joinDate?: string
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
  image?: string | null
  reinitialisation?: boolean
}

interface LoginApiResponse {
  token: string
  user: {
    Nom_Prenom: string
    E_mail: string
    Type_Utilisateur: string
    Profil: string
    Profil_Libelle: string
    Reinitialisation_mot_de_passe?: boolean
  }
  message?: string
}

interface UserApiResponse {
  Reference: string
  Nom_Prenom: string
  E_mail: string
  Type_Utilisateur: string
  Profil: string
  Profil_Libelle?: string
  Telephone?: string
  Adresse?: string
  Complement_adresse?: string
  Code_Postal?: string
  Ville?: string
  Gouvernorat?: string
  Pays?: string
  Site_Defaut?: string
  Heure?: string
  Temp_Raffraichissement?: string
  Couleur?: string
  Image?: string | null
}

interface LoginResponse {
  success: boolean
  message: string
  user: User
  token?: string
  requiresPasswordReset?: boolean
}

interface ApiError {
  error: string
}

// Custom hook for login
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string): Promise<LoginResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3000/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ E_mail: email, Mot_de_passe: password }),
      })

      if (response.ok) {
        const data: LoginApiResponse = await response.json()
        
        console.log('Login response:', data)
        
        // Check if password reset is required
        if (data.user.Reinitialisation_mot_de_passe === true) {
          // Store temporary user data and token for password reset
          const tempUser = {
            email: data.user.E_mail,
            name: data.user.Nom_Prenom,
            role: data.user.Type_Utilisateur,
            profil: data.user.Profil,
            profilLabel: data.user.Profil_Libelle || PROFILE_MAPPING[data.user.Profil as keyof typeof PROFILE_MAPPING] || data.user.Profil,
            typeUtilisateur: data.user.Type_Utilisateur,
            reinitialisation: true
          }
          
          // Store token for password reset process
          localStorage.setItem('token', data.token)
          localStorage.setItem('tempUser', JSON.stringify(tempUser))
          
          return {
            success: true,
            message: data.message || 'Réinitialisation du mot de passe requise',
            user: tempUser,
            token: data.token,
            requiresPasswordReset: true
          }
        }
        
        // Transform API response to our User format
        const user: User = {
          email: data.user.E_mail,
          name: data.user.Nom_Prenom,
          role: data.user.Type_Utilisateur,
          profil: data.user.Profil,
          profilLabel: data.user.Profil_Libelle || PROFILE_MAPPING[data.user.Profil as keyof typeof PROFILE_MAPPING] || data.user.Profil,
          typeUtilisateur: data.user.Type_Utilisateur,
          reinitialisation: data.user.Reinitialisation_mot_de_passe || false
        }

        const loginResponse: LoginResponse = {
          success: true,
          message: 'Connexion réussie',
          user: user,
          token: data.token // Use the actual token from API response
        }

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user))
        if (loginResponse.token) {
          localStorage.setItem('token', loginResponse.token)
        }
        
        return loginResponse
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Email ou mot de passe incorrect')
        return null
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.')
      console.error('Login error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}

// Custom hook for logout
export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logout = async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Clear local storage
        localStorage.removeItem('user')
        localStorage.removeItem('token')
          
        return true
      } else {
        setError(data.error || 'Erreur lors de la déconnexion')
        return false
      }
    } catch (err) {
      setError('Erreur de déconnexion. Veuillez réessayer.')
      console.error('Logout error:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { logout, isLoading, error }
}

// Custom hook for getting current user
export const useCurrentUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const getCurrentUser = async (): Promise<User | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('Token d\'authentification manquant')
        return null
      }

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        return data.user
      } else {
        setError(data.error || 'Erreur lors de la récupération des données utilisateur')
        // If token is invalid, clear storage
        if (response.status === 401) {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
        return null
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
      console.error('Get current user error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { getCurrentUser, user, isLoading, error }
}

// Custom hook for checking if user is authenticated
export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount only - no dependencies to avoid infinite loops
  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        console.log('User data:', parsedUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, []) // Empty dependency array - runs only once on mount

  return { 
    isAuthenticated, 
    user, 
    isLoading
  }
}

// Custom hook for fetching users
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async (): Promise<User[]> => {
    setIsLoading(true)
    setError(null)
    const token = localStorage.getItem('token')
    console.log('Fetching users with token:', token)  
    
    if (!token) {
      setError('Token d\'authentification manquant')
      setIsLoading(false)
      return []
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/UsersList', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Users API response status:', response.status)

      if (response.ok) {
        const data: UserApiResponse[] = await response.json()
        
        // Transform API response to our User format
        const transformedUsers: User[] = data.map((apiUser, index) => ({
          id: index + 1, // Generate an ID since API doesn't provide one
          email: apiUser.E_mail,
          name: apiUser.Nom_Prenom,
          role: apiUser.Type_Utilisateur || 'User',
          profil: apiUser.Profil,
          profilLabel: PROFILE_MAPPING[apiUser.Profil as keyof typeof PROFILE_MAPPING] || apiUser.Profil,
          typeUtilisateur: apiUser.Type_Utilisateur || 'User',
          status: 'Active', // Default status since API doesn't provide this
          joinDate: new Date().toISOString().split('T')[0], // Default to today
          telephone: apiUser.Telephone,
          adresse: apiUser.Adresse,
          image: apiUser.Image
        }))

        setUsers(transformedUsers)
        return transformedUsers
      } else if (response.status === 401 || response.status === 403) {
        // Token is invalid, clear storage and redirect to login
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setError('Session expirée. Veuillez vous reconnecter.')
        return []
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Erreur lors de la récupération des utilisateurs')
        return []
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
      console.error('Fetch users error:', err)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  return { 
    users, 
    isLoading, 
    error, 
    refetch: fetchUsers 
  }
}

// Custom hook for fetching societe data
export const useSociete = () => {
  const [societe, setSociete] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSociete = async (utilisateur: string): Promise<any> => {
    setIsLoading(true)
    setError(null)
    const token = localStorage.getItem('token')
    
    if (!token) {
      setError('Token d\'authentification manquant')
      setIsLoading(false)
      return null
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/societe/by-utilisateur', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Utilisateur: utilisateur }),
      })

      console.log('Societe API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        setSociete(data.societe)
        return data.societe
      } else if (response.status === 401 || response.status === 403) {
        // Token is invalid, clear storage and redirect to login
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setError('Session expirée. Veuillez vous reconnecter.')
        return null
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Erreur lors de la récupération de la société')
        return null
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
      console.error('Fetch societe error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { 
    societe, 
    isLoading, 
    error, 
    fetchSociete 
  }
}

// Custom hook for password reset
export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetPassword = async (newPassword: string, confirmPassword: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      if (newPassword !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas')
        return false
      }

      if (newPassword.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères')
        return false
      }

      // Get user email from temporary user data or URL params
      let userEmail = ''
      const tempUser = localStorage.getItem('tempUser')
      if (tempUser) {
        const parsedTempUser = JSON.parse(tempUser)
        userEmail = parsedTempUser.email
      } else {
        // Fallback to URL params if tempUser is not available
        const urlParams = new URLSearchParams(window.location.search)
        userEmail = urlParams.get('email') || ''
      }

      if (!userEmail) {
        setError('Email utilisateur non trouvé')
        return false
      }

      // Call the backend reset-and-login endpoint
      const response = await fetch('http://localhost:3000/api/v1/users/reset-and-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          E_mail: userEmail,
          New_Password: newPassword
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // The backend returns token and user info for auto-login
        console.log('Password reset and login response:', data)
        
        // Transform API response to our User format
        const user: User = {
          email: data.user.E_mail,
          name: data.user.Nom_Prenom,
          role: data.user.Type_Utilisateur,
          profil: data.user.Profil,
          profilLabel: data.user.Profil_Libelle || PROFILE_MAPPING[data.user.Profil as keyof typeof PROFILE_MAPPING] || data.user.Profil,
          typeUtilisateur: data.user.Type_Utilisateur,
          reinitialisation: false // Password has been reset
        }

        // Store user data and token for successful login
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', data.token)
        
        // Clean up temporary data
        localStorage.removeItem('tempUser')
        
        return true
      } else {
        setError(data.error || 'Erreur lors de la réinitialisation du mot de passe')
        return false
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
      console.error('Password reset error:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { resetPassword, isLoading, error }
}

// Custom hook for changing password (with current password validation)
export const usePasswordChange = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError('Tous les champs sont requis')
        return false
      }

      if (newPassword !== confirmPassword) {
        setError('Les nouveaux mots de passe ne correspondent pas')
        return false
      }

      if (newPassword.length < 8) {
        setError('Le nouveau mot de passe doit contenir au moins 8 caractères')
        return false
      }

      const token = localStorage.getItem('token')
      if (!token) {
        setError('Token d\'authentification manquant')
        return false
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return true
      } else {
        setError(data.error || 'Erreur lors du changement de mot de passe')
        return false
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
      console.error('Password change error:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { changePassword, isLoading, error }
} 