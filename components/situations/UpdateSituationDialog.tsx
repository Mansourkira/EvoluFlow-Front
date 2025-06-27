"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { situationSchema, SituationFormData } from '@/schemas/situationSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PrimaryButton } from '@/components/ui/themed-button'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUsers } from '@/hooks/useAuth'

interface UpdateSituationDialogProps {
  situation: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSituationUpdated: () => void
}

const NONE_VALUE = "NONE_SELECTED"

export function UpdateSituationDialog({ 
  situation, 
  open, 
  onOpenChange, 
  onSituationUpdated 
}: UpdateSituationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { users } = useUsers()
  const [selectedUser, setSelectedUser] = useState<string>(NONE_VALUE)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<SituationFormData>({
    resolver: zodResolver(situationSchema),
    defaultValues: {
      Reference: '',
      Libelle: '',
      Utilisateur: ''
    }
  })

  // Reset form when situation changes
  useEffect(() => {
    if (situation) {
      reset({
        Reference: situation.Reference || '',
        Libelle: situation.Libelle || '',
        Utilisateur: situation.Utilisateur || ''
      })
      setValue('Reference', situation.Reference || '')
      setValue('Libelle', situation.Libelle || '')
      setValue('Utilisateur', situation.Utilisateur || '')
      
      // Set the selected user state
      const userValue = situation.Utilisateur && situation.Utilisateur.trim() !== '' 
        ? situation.Utilisateur 
        : NONE_VALUE
      setSelectedUser(userValue)
    }
  }, [situation, reset, setValue])

  const onSubmit = async (data: SituationFormData) => {
    try {
      setIsLoading(true)
      
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('🔒 Erreur d\'authentification - Vous devez être connecté')
        return
      }

      // Convert NONE_VALUE back to null for API
      const userValue = selectedUser === NONE_VALUE ? null : selectedUser

      const response = await fetch('/api/situations/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          Reference: data.Reference,
          Libelle: data.Libelle,
          Utilisateur: userValue
        }),
      })

      if (response.ok) {
        toast.success(`✅ Situation mise à jour - ${data.Libelle} a été mise à jour avec succès`)
        onSituationUpdated()
        onOpenChange(false)
      } else {
        const errorData = await response.json()
        toast.error(`❌ Erreur de mise à jour - ${errorData.error || 'Impossible de mettre à jour la situation'}`)
      }
    } catch (error) {
      console.error('Erreur mise à jour situation:', error)
      toast.error('❌ Erreur de connexion - Impossible de contacter le serveur')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      reset()
      setSelectedUser(NONE_VALUE)
    }
  }

  const handleUserChange = (value: string) => {
    setSelectedUser(value)
    // Set the form value to empty string if NONE is selected, otherwise set the actual value
    setValue('Utilisateur', value === NONE_VALUE ? '' : value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la situation</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la situation sélectionnée.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Reference (Read-only) */}
            <div>
              <Label htmlFor="Reference">Référence</Label>
              <Input
                id="Reference"
                {...register('Reference')}
                disabled={true}
                className="bg-gray-100 cursor-not-allowed text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                La référence ne peut pas être modifiée
              </p>
            </div>

            {/* Libelle */}
            <div>
              <Label htmlFor="Libelle">Libellé *</Label>
              <Textarea
                id="Libelle"
                {...register('Libelle')}
                placeholder="Description de la situation"
                disabled={isLoading}
                rows={3}
              />
              {errors.Libelle && (
                <p className="text-sm text-red-600 mt-1">{errors.Libelle.message}</p>
              )}
            </div>

            {/* Utilisateur */}
            <div>
              <Label htmlFor="Utilisateur">Utilisateur assigné (optionnel)</Label>
              <Select 
                value={selectedUser}
                onValueChange={handleUserChange}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>Aucun utilisateur</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.email} value={user.email}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.Utilisateur && (
                <p className="text-sm text-red-600 mt-1">{errors.Utilisateur.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 