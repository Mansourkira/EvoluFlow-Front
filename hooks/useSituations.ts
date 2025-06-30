import { useState, useEffect } from 'react'

interface Situation {
  Reference: string
  Libelle: string
}

export function useSituations() {
  const [situations, setSituations] = useState<Situation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSituations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Token d\'authentification manquant')
      }

      const response = await fetch('/api/situations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des situations')
      }

      const data = await response.json()
      setSituations(data)
    } catch (err) {
      console.error('Erreur lors de la récupération des situations:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    fetchSituations()
  }

  useEffect(() => {
    fetchSituations()
  }, [])

  return {
    situations,
    isLoading,
    error,
    refetch
  }
} 