"use client"

import React, { useState } from 'react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { PrimaryButton } from '@/components/ui/themed-button'
import { Plus, Loader2, RefreshCw, Dice6 } from 'lucide-react'
import { toast } from 'sonner'
import { useUsers } from '@/hooks/useAuth'

interface AddSituationDialogProps {
  onSituationAdded: () => void
}

const NONE_VALUE = "NONE_SELECTED"

export function AddSituationDialog({ onSituationAdded }: AddSituationDialogProps) {
  const [open, setOpen] = useState(false)
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

  // Generate unique reference function
  const generateReference = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const time = now.getTime().toString().slice(-4)
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    
    const reference = `SIT-${year}${month}${day}-${time}${random}`
    setValue('Reference', reference)
    toast.success(`📝 Référence générée - ${reference}`)
  }

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

      const response = await fetch('/api/situations', {
        method: 'POST',
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
        toast.success(`✅ Situation ajoutée - ${data.Libelle} a été ajoutée avec succès`)
        reset()
        setSelectedUser(NONE_VALUE)
        setOpen(false)
        onSituationAdded()
      } else {
        const errorData = await response.json()
        toast.error(`❌ Erreur d'ajout - ${errorData.error || 'Impossible d\'ajouter la situation'}`)
      }
    } catch (error) {
      console.error('Erreur ajout situation:', error)
      toast.error('❌ Erreur de connexion - Impossible de contacter le serveur')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
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
      <DialogTrigger asChild>
        <PrimaryButton size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une situation
        </PrimaryButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle situation</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle situation.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Reference */}
            <div>
              <Label htmlFor="Reference">Référence *</Label>
              <div className="flex gap-2">
                <Input
                  id="Reference"
                  {...register('Reference')}
                  placeholder="Référence unique de la situation"
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateReference}
                  disabled={isLoading}
                  className="shrink-0 px-3"
                  title="Générer une référence automatique"
                >
                  <Dice6 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format automatique: SIT-AAMMJJ-XXXX (ex: SIT-241225-1234)
              </p>
              {errors.Reference && (
                <p className="text-sm text-red-600 mt-1">{errors.Reference.message}</p>
              )}
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
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </>
              )}
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 