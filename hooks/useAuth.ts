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
  id?: number
  email: string
  role: string
  name: string
  avatar?: string
  profil: string
  profilLabel: string
  typeUtilisateur: string
  status?: string
  joinDate?: string
}

interface LoginApiResponse {
  token: string
  user: {
    Nom_Prenom: string
    E_mail: string
    Type_Utilisateur: string
    Profil: string
    Profil_Libelle: string
  }
}

interface UserApiResponse {
  Nom_Prenom: string
  E_mail: string
  Type_Utilisateur: string
  Profil: string
}

interface LoginResponse {
  success: boolean
  message: string
  user: User
  token?: string
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
        
        // Transform API response to our User format
        const user: User = {
          email: data.user.E_mail,
          name: data.user.Nom_Prenom,
          role: data.user.Type_Utilisateur,
          profil: data.user.Profil,
          profilLabel: data.user.Profil_Libelle || PROFILE_MAPPING[data.user.Profil as keyof typeof PROFILE_MAPPING] || data.user.Profil,
          typeUtilisateur: data.user.Type_Utilisateur
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

    try {
      const response = await fetch('http://localhost:3000/api/v1/UsersList', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

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
          joinDate: new Date().toISOString().split('T')[0] // Default to today
        }))

        setUsers(transformedUsers)
        return transformedUsers
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