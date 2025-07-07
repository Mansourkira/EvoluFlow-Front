"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateSituationSchema, Situation } from '@/schemas/situationSchema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
  import { Loader2, Save } from 'lucide-react'  
import { useSituations } from '@/hooks/useSituations'
import { toast } from '@/hooks/use-toast'
  
interface UpdateSituationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  situation: Situation;
  onSuccess?: () => void;
}

export function UpdateSituationDialog({ 
  open, 
  onOpenChange, 
  situation,
  onSuccess 
}: UpdateSituationDialogProps) {
  const { updateSituation, isLoading } = useSituations();

  const form = useForm<Situation>({
    resolver: zodResolver(updateSituationSchema),
    defaultValues: {
      Reference: situation.Reference,
      Libelle: situation.Libelle,
    }
  })

  useEffect(() => {
    if (situation) {
      form.setValue('Reference', situation.Reference)
      form.setValue('Libelle', situation.Libelle)
    }
  }, [situation, form])

  const onSubmit = async (data: Situation) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "🔒 Erreur d'authentification",
          description: "Vous devez être connecté",
          variant: "destructive",
        })
        return
      }

      const response = await updateSituation(data as Situation)

      if (response) {
        toast({
          title: "✅ Situation modifiée",
          description: `${data.Libelle} a été modifiée avec succès`,
        })
        onOpenChange(false)
        onSuccess?.()
      } else {      
          toast({
            title: "❌ Erreur de connexion",
            description: "Impossible de contacter le serveur",
            variant: "destructive",
          })
      }
    } catch (error) {
      console.error('Erreur modification situation:', error)
      toast({
        title: "❌ Erreur de connexion",
        description: "Impossible de contacter le serveur",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la situation</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la situation.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Reference */}
            <div>
              <Label htmlFor="Reference">Référence *</Label>
              <Input
                id="Reference"
                {...form.register('Reference')}
                placeholder="Référence unique de la situation"
                disabled={true}
                className="bg-gray-50"
              />
              {form.formState.errors.Reference && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.Reference.message}</p>
              )}
            </div>

            {/* Libelle */}
            <div>
              <Label htmlFor="Libelle">Libellé *</Label>
              <Textarea
                id="Libelle"
                {...form.register('Libelle')}
                placeholder="Description de la situation"
                rows={3}
              />
              {form.formState.errors.Libelle && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.Libelle.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
           
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 