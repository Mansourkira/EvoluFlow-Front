"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Hash, Type, User, Mail, UserCheck, MapPin, Calendar } from 'lucide-react'

interface ViewSituationDialogProps {
  situation: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewSituationDialog({ situation, open, onOpenChange }: ViewSituationDialogProps) {
  if (!situation) return null

  const infoItems = [
    {
      icon: Hash,
      label: 'Référence',
      value: situation.Reference,
      className: 'font-mono text-sm bg-gray-100 px-2 py-1 rounded'
    },
    {
      icon: Type,
      label: 'Libellé',
      value: situation.Libelle,
      className: 'font-medium'
    },
    {
      icon: User,
      label: 'Référence Utilisateur',
      value: situation.Utilisateur,
      className: 'font-mono text-sm'
    },
    {
      icon: UserCheck,
      label: 'Nom Utilisateur',
      value: situation.Nom_Prenom,
      className: 'font-medium'
    },
    {
      icon: Mail,
      label: 'Email Utilisateur',
      value: situation.E_mail,
      className: 'text-blue-600'
    },
    {
      icon: UserCheck,
      label: 'Profil',
      value: situation.Profil,
      render: (value: string) => value ? (
        <Badge variant="outline" className="font-medium">
          {value}
        </Badge>
      ) : null
    },
    {
      icon: UserCheck,
      label: 'Type Utilisateur',
      value: situation.Type_Utilisateur,
      render: (value: string) => value ? (
        <Badge
          variant={
            value === "Administratif" 
              ? "default" 
              : value === "Consultant" 
              ? "secondary" 
              : "outline"
          }
          className="font-medium"
        >
          {value}
        </Badge>
      ) : null
    },
    {
      icon: MapPin,
      label: 'Site par Défaut',
      value: situation.Site_Defaut,
      className: 'text-gray-600'
    },
    {
      icon: Calendar,
      label: 'Date de Création',
      value: situation.Heure,
      className: 'text-gray-600'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-blue-600" />
            Détails de la Situation
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur la situation et son assignation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {infoItems.map((item, index) => {
              const Icon = item.icon
              const displayValue = item.value || 'N/A'
              const isEmptyValue = !item.value || item.value === 'N/A'
              
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {item.label}
                    </div>
                    <div className={`text-sm ${isEmptyValue ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                      {item.render ? (
                        item.render(item.value)
                      ) : (
                        <span className={item.className}>
                          {displayValue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Separator className="my-4" />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Statut d'Assignation
              </span>
            </div>
            <div className="text-sm text-blue-800">
              {situation.Nom_Prenom ? (
                <>
                  Cette situation est assignée à <strong>{situation.Nom_Prenom}</strong>
                  {situation.E_mail && (
                    <span> ({situation.E_mail})</span>
                  )}
                </>
              ) : (
                <span className="italic">Cette situation n'est assignée à aucun utilisateur</span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 