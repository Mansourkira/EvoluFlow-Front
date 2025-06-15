import { useState, useEffect, useCallback } from 'react'

// Types
interface User {
  id: number
  email: string
  role: string
  name: string
  avatar?: string
}

interface LoginResponse {
  success: boolean
  message: string
  user: User
  token: string
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        
        return data as LoginResponse
      } else {
        setError(data.error || 'Erreur de connexion')
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