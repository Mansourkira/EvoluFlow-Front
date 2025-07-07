import { useState, useEffect, useCallback } from 'react'
import { ObjetReclamation } from '@/schemas/objetReclamationSchema'
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';      


export function useObjetReclamation() {
    const [objetReclamations, setObjetReclamations] = useState<ObjetReclamation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchObjetReclamations = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Token d\'authentification manquant')
            }

            const response = await fetch(`${baseUrl}/object-reclamation/list`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la récupération des objets de reclamation')
            }

            const data = await response.json()
            setObjetReclamations(data)
        } catch (err) {
            console.error('Erreur lors de la récupération des objets de reclamation:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const addObjetReclamation = async (objetReclamation: ObjetReclamation) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Token d\'authentification manquant')
            }

            const response = await fetch(`${baseUrl}/object-reclamation/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objetReclamation),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de l\'ajout de l\'objet de reclamation')
            }

            // Refresh the situations list after successful addition
            await fetchObjetReclamations();
            return true
        } catch (err) {
            console.error('Erreur lors de l\'ajout de l\'objet de reclamation:', err)
            return false
        }
    }
    const updateObjetReclamation = async (objetReclamation: ObjetReclamation) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Token d\'authentification manquant')
            }

            const response = await fetch(`${baseUrl}/object-reclamation/update/${objetReclamation.Reference}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objetReclamation),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'objet de reclamation')
            }

            // Refresh the list after successful update
            await fetchObjetReclamations();
            return true
        } catch (err) {
            console.error('Erreur lors de la mise à jour de l\'objet de reclamation:', err)
            throw err
        }
    }
    const deleteObjetReclamation = async (reference: string) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('Token d\'authentification manquant')
            }

            const response = await fetch(`${baseUrl}/object-reclamation/delete/${reference}`, {
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
            await fetchObjetReclamations();
            return true
        } catch (err) {
            console.error('Erreur lors de la suppression de l\'objet de reclamation:', err)
            throw err
        }
    }

    const getObjetReclamationByReference = async (reference: string) => {
        const token = localStorage.getItem('token')
        if (!token) {
            throw new Error('Token d\'authentification manquant')
        }


        const response = await fetch(`${baseUrl}/object-reclamation/by-reference/${reference}`, {
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
        objetReclamations,
        isLoading,
        error,
         fetchObjetReclamations,
        addObjetReclamation,
        updateObjetReclamation,
        deleteObjetReclamation,
        getObjetReclamationByReference
    }
} 