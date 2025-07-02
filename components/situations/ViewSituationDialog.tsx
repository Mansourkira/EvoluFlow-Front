"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Hash, Type, Calendar } from 'lucide-react'

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
            Informations détaillées sur la situation
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
                      <span className={item.className}>
                        {displayValue}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>


        </div>
      </DialogContent>
    </Dialog>
  )
} 