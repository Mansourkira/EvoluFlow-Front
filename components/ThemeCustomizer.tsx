import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useTheme, type ThemePreset } from '@/hooks/useTheme'
import { 
  Palette, 
  RotateCcw, 
  Check, 
  Sidebar, 
  Table, 
  MousePointer,
  Monitor
} from 'lucide-react'

export function ThemeCustomizer() {
  const { colors, presets, updateColors, applyPreset, resetToDefault } = useTheme()
  const [selectedSection, setSelectedSection] = useState<'presets' | 'sidebar' | 'buttons' | 'tables'>('presets')

  const sections = [
    { id: 'presets', name: 'Thèmes prédéfinis', icon: Palette },
    { id: 'sidebar', name: 'Barre latérale', icon: Sidebar },
    { id: 'buttons', name: 'Boutons', icon: MousePointer },
    { id: 'tables', name: 'Tableaux', icon: Table },
  ] as const

  const handleColorChange = (section: keyof typeof colors, field: string, value: string) => {
    if (typeof colors[section] === 'object' && colors[section] !== null) {
      updateColors({
        [section]: {
          ...colors[section],
          [field]: value
        }
      } as any)
    } else {
      updateColors({
        [section]: value
      } as any)
    }
  }

  const ColorInput = ({ label, value, onChange }: { 
    label: string
    value: string
    onChange: (value: string) => void 
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-3">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 p-1 rounded-md border"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
          placeholder="#000000"
        />
        <div 
          className="w-10 h-10 rounded-md border shadow-sm"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Personnalisation du thème
        </CardTitle>
        <CardDescription>
          Personnalisez les couleurs de l'interface selon vos préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Button
                key={section.id}
                variant={selectedSection === section.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSection(section.id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {section.name}
              </Button>
            )
          })}
        </div>

        <Separator />

        {/* Presets Section */}
        {selectedSection === 'presets' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presets.map((preset, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{preset.name}</h4>
                    {colors.primary === preset.colors.primary && (
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        <Check className="h-3 w-3 mr-1" />
                        Actuel
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.colors.primary || colors.primary }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.colors.primaryLight || colors.primaryLight }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.colors.primaryDark || colors.primaryDark }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={resetToDefault}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser au thème par défaut
              </Button>
            </div>
          </div>
        )}

        {/* Sidebar Colors */}
        {selectedSection === 'sidebar' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput
                label="Arrière-plan principal"
                value={colors.sidebar.background}
                onChange={(value) => handleColorChange('sidebar', 'background', value)}
              />
              <ColorInput
                label="Arrière-plan secondaire"
                value={colors.sidebar.backgroundLight}
                onChange={(value) => handleColorChange('sidebar', 'backgroundLight', value)}
              />
              <ColorInput
                label="Texte principal"
                value={colors.sidebar.text}
                onChange={(value) => handleColorChange('sidebar', 'text', value)}
              />
              <ColorInput
                label="Texte secondaire"
                value={colors.sidebar.textSecondary}
                onChange={(value) => handleColorChange('sidebar', 'textSecondary', value)}
              />
              <ColorInput
                label="Couleur d'accent"
                value={colors.sidebar.accent}
                onChange={(value) => handleColorChange('sidebar', 'accent', value)}
              />
              <ColorInput
                label="Hover"
                value={colors.sidebar.hover}
                onChange={(value) => handleColorChange('sidebar', 'hover', value)}
              />
            </div>
          </div>
        )}

        {/* Button Colors */}
        {selectedSection === 'buttons' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput
                label="Bouton principal"
                value={colors.button.primary}
                onChange={(value) => handleColorChange('button', 'primary', value)}
              />
              <ColorInput
                label="Bouton principal (hover)"
                value={colors.button.primaryHover}
                onChange={(value) => handleColorChange('button', 'primaryHover', value)}
              />
              <ColorInput
                label="Bouton succès"
                value={colors.button.success}
                onChange={(value) => handleColorChange('button', 'success', value)}
              />
              <ColorInput
                label="Bouton succès (hover)"
                value={colors.button.successHover}
                onChange={(value) => handleColorChange('button', 'successHover', value)}
              />
              <ColorInput
                label="Bouton danger"
                value={colors.button.danger}
                onChange={(value) => handleColorChange('button', 'danger', value)}
              />
              <ColorInput
                label="Bouton danger (hover)"
                value={colors.button.dangerHover}
                onChange={(value) => handleColorChange('button', 'dangerHover', value)}
              />
            </div>
            
            {/* Button Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Aperçu des boutons</h4>
              <div className="flex flex-wrap gap-3">
                <Button style={{ backgroundColor: colors.button.primary }}>
                  Principal
                </Button>
                <Button style={{ backgroundColor: colors.button.success }}>
                  Succès
                </Button>
                <Button style={{ backgroundColor: colors.button.danger }}>
                  Danger
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Table Colors */}
        {selectedSection === 'tables' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput
                label="En-tête de tableau"
                value={colors.table.header}
                onChange={(value) => handleColorChange('table', 'header', value)}
              />
              <ColorInput
                label="Texte d'en-tête"
                value={colors.table.headerText}
                onChange={(value) => handleColorChange('table', 'headerText', value)}
              />
              <ColorInput
                label="Ligne de tableau"
                value={colors.table.row}
                onChange={(value) => handleColorChange('table', 'row', value)}
              />
              <ColorInput
                label="Ligne alternée"
                value={colors.table.rowAlt}
                onChange={(value) => handleColorChange('table', 'rowAlt', value)}
              />
              <ColorInput
                label="Ligne au survol"
                value={colors.table.rowHover}
                onChange={(value) => handleColorChange('table', 'rowHover', value)}
              />
              <ColorInput
                label="Bordure de tableau"
                value={colors.table.border}
                onChange={(value) => handleColorChange('table', 'border', value)}
              />
            </div>
            
            {/* Table Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Aperçu du tableau</h4>
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="grid grid-cols-3 p-3 font-medium border-b"
                  style={{ 
                    backgroundColor: colors.table.header,
                    color: colors.table.headerText,
                    borderColor: colors.table.headerBorder
                  }}
                >
                  <div>Nom</div>
                  <div>Email</div>
                  <div>Statut</div>
                </div>
                <div 
                  className="grid grid-cols-3 p-3 border-b"
                  style={{ 
                    backgroundColor: colors.table.row,
                    borderColor: colors.table.border
                  }}
                >
                  <div>John Doe</div>
                  <div>john@exemple.com</div>
                  <div>Actif</div>
                </div>
                <div 
                  className="grid grid-cols-3 p-3"
                  style={{ backgroundColor: colors.table.rowAlt }}
                >
                  <div>Jane Smith</div>
                  <div>jane@exemple.com</div>
                  <div>Inactif</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 