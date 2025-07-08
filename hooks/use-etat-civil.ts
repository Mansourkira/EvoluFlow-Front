import { useState, useEffect, useCallback } from 'react'
import { EtatCivil } from '@/schemas/etatCivilSchema'
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';      


export function useEtatCivil() {
    const [etatCivils, setEtatCivils] = useState<EtatCivil[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchEtatCivils = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Token d\'authentification manquant')
            }

            const response = await fetch(`${baseUrl}/etat-civil/list`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la récupération des états civils')
            }

            const data = await response.json()
            setEtatCivils(data)
        } catch (err) {
            console.error('Erreur lors de la récupération des états civils:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const addEtatCivil = async (etatCivil: EtatCivil) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Token d\'authentification manquant')
            }

            const response = await fetch(`${baseUrl}/etat-civil/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(etatCivil),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de l\'ajout de l\'objet de reclamation')
            }

            // Refresh the situations list after successful addition
            await fetchEtatCivils();
            return true
        } catch (err) {
            console.error('Erreur lors de l\'ajout de l\'objet de reclamation:', err)
            return false
        }
    }
    const updateEtatCivil = async (etatCivil: EtatCivil) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Token d\'authentification manquant')
            }

            const response = await fetch(`${baseUrl}/etat-civil/update/${etatCivil.Reference}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(etatCivil),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'objet de reclamation')
            }

            // Refresh the list after successful update
            await fetchEtatCivils();
            return true
        } catch (err) {
            console.error('Erreur lors de la mise à jour de l\'objet de reclamation:', err)
            throw err
        }
    }
    const deleteEtatCivil = async (reference: string) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Token d\'authentification manquant')
            }

            const response = await fetch(`${baseUrl}/etat-civil/delete/${reference}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la suppression de l\'objet de reclamation')
            }

            // Refresh the list after successful deletion
            await fetchEtatCivils();
            return true
        } catch (err) {
            console.error('Erreur lors de la suppression de l\'objet de reclamation:', err)
            throw err
        }
    }

    const getEtatCivilByReference = async (reference: string) => {
        const token = localStorage.getItem('token')
        if (!token) {
            throw new Error('Token d\'authentification manquant')
        }


        const response = await fetch(`${baseUrl}/etat-civil/by-reference/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erreur lors de la récupération de la situation')
        }

        return await response.json()
    }

    return {
            etatCivils,
        isLoading,
        error,
        fetchEtatCivils,
        addEtatCivil,
        updateEtatCivil,
        deleteEtatCivil,
        getEtatCivilByReference
    }
} 