import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun } from 'docx'
import { ObjetReglement } from '@/schemas/reglementShema'


// Generic interfaces for export configuration
export interface ExportColumn {
  key: string
  label: string
  width?: number
  formatter?: (value: any) => string
  excelWidth?: number
  pdfWidth?: number
  wordWidth?: number
}

export interface ExportConfig {
  title: string
  filename: string
  columns: ExportColumn[]
  data: any[]
}

// Generic export functions
export const exportToGenericPDF = (config: ExportConfig): boolean => {
  try {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.setTextColor(58, 144, 218)
    doc.text(config.title, 20, 20)
    
    // Add date
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30)
    
    // Prepare table data
    const tableColumns = config.columns.map(col => col.label)
    const tableRows = config.data.map(item => 
      config.columns.map(col => {
        const value = item[col.key]
        return col.formatter ? col.formatter(value) : (value?.toString() || '')
      })
    )
    
    // Create column styles
    const columnStyles: { [key: number]: any } = {}
    config.columns.forEach((col, index) => {
      if (col.pdfWidth) {
        columnStyles[index] = { cellWidth: col.pdfWidth }
      }
    })
    
    // Add table
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [58, 144, 218],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles,
      margin: { left: 10, right: 10 }
    })
    
    // Add footer
    const finalY = (doc as any).lastAutoTable.finalY || 40
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text(`Total: ${config.data.length} enregistrement(s)`, 20, finalY + 20)
    
    // Save the PDF
    doc.save(`${config.filename}.pdf`)
    
    return true
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    return false
  }
}


export const createObjetReclamationExportConfig = (objetReclamations: any[]): ExportConfig => ({
  title: 'Liste des Objets de Réclamation',
  filename: 'objets_reclamation',
  data: objetReclamations,
  columns: [
    { key: 'Reference', label: 'Référence', width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: 'Libelle', label: 'Libellé', width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: 'Relance', label: 'Relance', width: 15, pdfWidth: 20, excelWidth: 15 },
    { 
      key: 'Heure', 
      label: 'Date de création', 
      width: 20,
      pdfWidth: 25,
      excelWidth: 20,
      formatter: (value: string) => value 
        ? new Date(value).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Non spécifiée'
    }
  ]
})

export const exportToGenericExcel = (config: ExportConfig): boolean => {
  try {
    // Prepare data for Excel
    const excelData = config.data.map(item => {
      const row: { [key: string]: any } = {}
      config.columns.forEach(col => {
        const value = item[col.key]
        row[col.label] = col.formatter ? col.formatter(value) : (value?.toString() || '')
      })
      return row
    })
    
    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    
    // Set column widths
    const colWidths = config.columns.map(col => ({
      wch: col.excelWidth || col.width || 20
    }))
    worksheet['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    
    // Save the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, `${config.filename}.xlsx`)
    
    return true
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error)
    return false
  }
}

export const exportToGenericWord = async (config: ExportConfig): Promise<boolean> => {
  try {
    // Create table rows
    const tableRows = config.data.map(item => 
      new TableRow({
        children: config.columns.map(col => {
          const value = item[col.key]
          const displayValue = col.formatter ? col.formatter(value) : (value?.toString() || '')
          return new TableCell({
            children: [new Paragraph(displayValue)],
            width: { 
              size: col.wordWidth || col.width || (100 / config.columns.length), 
              type: WidthType.PERCENTAGE 
            }
          })
        })
      })
    )

    // Create the document
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: config.title,
                bold: true,
                size: 32,
                color: "3A90DA"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Généré le: ${new Date().toLocaleDateString('fr-FR')}`,
                italics: true,
                size: 20
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header row
              new TableRow({
                children: config.columns.map(col => 
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: col.label, bold: true, color: "FFFFFF" })]
                    })],
                    shading: { fill: "3A90DA" },
                    width: { 
                      size: col.wordWidth || col.width || (100 / config.columns.length), 
                      type: WidthType.PERCENTAGE 
                    }
                  })
                )
              }),
              // Data rows
              ...tableRows
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total: ${config.data.length} enregistrement(s)`,
                bold: true
              })
            ],
            spacing: { before: 400 }
          })
        ]
      }]
    })

    // Generate and save the document
    const buffer = await Packer.toBlob(doc)
    saveAs(buffer, `${config.filename}.docx`)
    
    return true
  } catch (error) {
    console.error('Erreur lors de l\'export Word:', error)
    return false
  }
}

// Main generic export function
export const exportGenericData = async (
  config: ExportConfig, 
  format: 'PDF' | 'Excel' | 'Word'
): Promise<boolean> => {
  try {
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `${config.filename}_${timestamp}`
    const exportConfig = { ...config, filename }
    
    switch (format) {
      case 'PDF':
        return exportToGenericPDF(exportConfig)
      case 'Excel':
        return exportToGenericExcel(exportConfig)
      case 'Word':
        return await exportToGenericWord(exportConfig)
      default:
        throw new Error('Format d\'export non supporté')
    }
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    return false
  }
}

// Utility function to create export configurations for common entities
export const createUserExportConfig = (users: any[]): ExportConfig => ({
  title: 'Liste des Utilisateurs',
  filename: 'utilisateurs',
  data: users,
  columns: [
    { key: 'name', label: 'Nom', width: 25, pdfWidth: 25, excelWidth: 25 },
    { key: 'email', label: 'Email', width: 30, pdfWidth: 35, excelWidth: 30 },
    { key: 'telephone', label: 'Téléphone', width: 15, pdfWidth: 20, excelWidth: 15 },
    { key: 'adresse', label: 'Adresse', width: 40, pdfWidth: 40, excelWidth: 40 },
    { key: 'profilLabel', label: 'Rôle', width: 20, pdfWidth: 25, excelWidth: 20 },
    { 
      key: 'joinDate', 
      label: 'Date d\'inscription', 
      width: 20, 
      pdfWidth: 25, 
      excelWidth: 20,
      formatter: (value) => value ? new Date(value).toLocaleDateString('fr-FR') : ''
    }
  ]
})

export const createSituationExportConfig = (situations: any[]): ExportConfig => ({
  title: 'Liste des Situations',
  filename: 'situations',
  data: situations,
  columns: [
    { key: 'Reference', label: 'Référence', width: 15, pdfWidth: 25, excelWidth: 15 },
    { key: 'Libelle', label: 'Libellé', width: 30, pdfWidth: 40, excelWidth: 30 },
    { 
      key: 'Heure', 
      label: 'Date de Création', 
      width: 15, 
      pdfWidth: 25, 
      excelWidth: 15,
      formatter: (value) => value ? new Date(value).toLocaleDateString('fr-FR') : '-'
    }
  ]
})

export const createCourseTypeExportConfig = (courseTypes: any[]): ExportConfig => ({
  title: 'Liste des Types de Cours',
  filename: 'types_cours',
  data: courseTypes,
  columns: [
    { key: 'Reference', label: 'Référence', width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: 'Libelle', label: 'Libellé', width: 40, pdfWidth: 50, excelWidth: 40 },
    { 
      key: 'Priorite', 
      label: 'Priorité', 
      width: 20, 
      pdfWidth: 25, 
      excelWidth: 20,
      formatter: (value) => {
        const priorityLabels: { [key: number]: string } = {
          1: "Faible",
          2: "Moyenne", 
          3: "Élevée",
          4: "Urgente",
        }
        return value ? priorityLabels[value] || "Inconnue" : "Non définie"
      }
    }
  ]
})

export const createFiliereExportConfig = (filieres: any[]): ExportConfig => ({
  title: 'Liste des Filières',
  filename: 'filieres',
  data: filieres,
  columns: [
    { key: 'Reference', label: 'Référence', width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: 'Libelle', label: 'Libellé', width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: 'Description', label: 'Description', width: 60, pdfWidth: 70, excelWidth: 60 }
  ]
})

export const createRegimeTvaExportConfig = (regimesTva: any[]): ExportConfig => ({
  title: 'Liste des Régimes TVA',
  filename: 'regimes_tva',
  data: regimesTva,
  columns: [
    { key: 'Reference', label: 'Référence', width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: 'Libelle', label: 'Libellé', width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: 'Taux', label: 'Taux (%)', width: 15, pdfWidth: 20, excelWidth: 15 }
  ]
})

export const createSiteExportConfig = (sites: any[]): ExportConfig => ({
  title: 'Liste des Sites',
  filename: 'sites',
  data: sites,
  columns: [
    { key: 'Reference', label: 'Référence', width: 15, pdfWidth: 20, excelWidth: 15 },
    { key: 'Raison_Sociale', label: 'Raison Sociale', width: 30, pdfWidth: 35, excelWidth: 30 },
    { key: 'Adresse', label: 'Adresse', width: 25, pdfWidth: 30, excelWidth: 25 },
    { key: 'Ville', label: 'Ville', width: 15, pdfWidth: 20, excelWidth: 15 },
    { key: 'Code_Postal', label: 'Code Postal', width: 12, pdfWidth: 15, excelWidth: 12 },
    { key: 'Pays', label: 'Pays', width: 15, pdfWidth: 20, excelWidth: 15 },
    { key: 'Telephone', label: 'Téléphone', width: 15, pdfWidth: 20, excelWidth: 15 },
    { key: 'E_Mail_Commercial', label: 'Email Commercial', width: 25, pdfWidth: 30, excelWidth: 25 },
    { key: 'Site_Web', label: 'Site Web', width: 25, pdfWidth: 30, excelWidth: 25 },
    { key: 'Activite', label: 'Activité', width: 20, pdfWidth: 25, excelWidth: 20 },
    { key: 'Matricule_Fiscal', label: 'Matricule Fiscal', width: 18, pdfWidth: 22, excelWidth: 18 },
    { key: 'Capital', label: 'Capital', width: 15, pdfWidth: 20, excelWidth: 15 },
    { 
      key: 'Heure', 
      label: 'Date de création', 
      width: 18,
      pdfWidth: 22,
      excelWidth: 18,
      formatter: (value: string) => value 
        ? new Date(value).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Non spécifiée'
    }
  ]
})

export const createTypeFacturationExportConfig = (typesFacturation: any[]): ExportConfig => ({
  title: 'Liste des Types de Facturation',
  filename: 'types_facturation',
  data: typesFacturation,
  columns: [
    { key: 'Reference', label: 'Référence', width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: 'Libelle', label: 'Libellé', width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: 'Description', label: 'Description', width: 60, pdfWidth: 70, excelWidth: 60 }
  ]
})

export const createProspectExportConfig = (prospects: any[]): ExportConfig => ({
  title: 'Suivi des Opérations des Prospects',
  filename: `prospects_${new Date().toISOString().split('T')[0]}`,
  columns: [
    { key: 'Reference', label: 'Référence', width: 15 },
    { key: 'Libelle', label: 'Libellé', width: 30 },
    { 
      key: 'Relance', 
      label: 'Relance', 
      width: 15,
      formatter: (value: boolean) => value ? 'Nécessaire' : 'Pas nécessaire'
    },
    { key: 'Utilisateur', label: 'Utilisateur', width: 20 },
    { 
      key: 'Heure', 
      label: 'Date de création', 
      width: 20,
      formatter: (value: string) => value 
        ? new Date(value).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Non spécifiée'
    }
  ],
  data: prospects
})

export const createEtatCivilExportConfig = (etatCivils: any[]): ExportConfig => ({  
  title: 'Liste des Etat Civil',
  filename: 'etat_civil',
  data: etatCivils,
  columns: [
    { key: 'Reference', label: 'Référence', width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: 'Libelle', label: 'Libellé', width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: 'Utilisateur', label: 'Utilisateur', width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: 'Heure',
      label: 'Date de Création',
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) =>
        value ? new Date(value).toLocaleDateString('fr-FR') : '-',
    },
  ]
})


// Legacy functions for backward compatibility
export const exportToPDF = (users: any[], filename: string = 'utilisateurs') => {
  const config = createUserExportConfig(users)
  config.filename = filename
  return exportToGenericPDF(config)
}

export const exportToExcel = (users: any[], filename: string = 'utilisateurs') => {
  const config = createUserExportConfig(users)
  config.filename = filename
  return exportToGenericExcel(config)
}

export const exportToWord = async (users: any[], filename: string = 'utilisateurs') => {
  const config = createUserExportConfig(users)
  config.filename = filename
  return await exportToGenericWord(config)
}

export const exportAllUsers = async (users: any[], format: 'PDF' | 'Excel' | 'Word') => {
  const config = createUserExportConfig(users)
  return await exportGenericData(config, format)
}

export const exportAllSituations = async (situations: any[], format: 'PDF' | 'Excel' | 'Word') => {
  const config = createSituationExportConfig(situations)
  return await exportGenericData(config, format)
} 

export const createRaisonExportConfig = (raisons: any[]): ExportConfig => ({
  title: 'Liste des Raisons',
  filename: 'raisons',
  data: raisons,
  columns: [
    { key: 'Reference', label: 'Référence', width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: 'Libelle', label: 'Libellé', width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: 'Utilisateur', label: 'Utilisateur', width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: 'Heure',
      label: 'Date de Création',
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) =>
        value ? new Date(value).toLocaleDateString('fr-FR') : '-',
    },
  ],
});
export const createObjetReglementExportConfig = (
  objets: any[]
): ExportConfig => ({
  title: "Liste des Objets de Règlement",
  filename: "objets_reglement",
  data: objets,
  columns: [
    { key: "Reference", label: "Référence", width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: "Intitule", label: "Intitulé", width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: "Utilisateur", label: "Utilisateur", width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: "Heure",
      label: "Date de Création",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) =>
        value ? new Date(value).toLocaleDateString("fr-FR") : "-",
    },
  ],
});
export const createMagasinExportConfig = (magasins: any[]): ExportConfig => ({
  title: 'Liste des Magasins',
  filename: 'magasins',
  data: magasins,
  columns: [
    { key: 'Reference', label: 'Référence', width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: 'Libelle', label: 'Libellé', width: 40, pdfWidth: 50, excelWidth: 40 },
    {
      key: 'Stock_Negatif',
      label: 'Stock Négatif',
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) => (value === 1 ? 'Autorisé' : 'Non autorisé'),
    },
    { key: 'Utilisateur', label: 'Utilisateur', width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: 'Heure',
      label: 'Date de Création',
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) =>
        value ? new Date(value).toLocaleDateString('fr-FR') : '-',
    },
  ],
});
export const createValidationReglementExportConfig = (
  validations: any[]
): ExportConfig => ({
  title: "Liste des Validations de Règlement",
  filename: "validations_reglement",
  data: validations,
  columns: [
    { key: "Reference", label: "Référence", width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: "Libelle", label: "Libellé", width: 40, pdfWidth: 50, excelWidth: 40 },
    {
      key: "Valide",
      label: "Statut",
      width: 15,
      pdfWidth: 20,
      excelWidth: 15,
      formatter: (value) => value === 1 ? "Validé" : "Non Validé",
    },
    { key: "Utilisateur", label: "Utilisateur", width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: "Heure",
      label: "Date de Création",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) =>
        value ? new Date(value).toLocaleDateString("fr-FR") : "-",
    },
  ],
});
export const createTvaExportConfig = (tvas: any[]): ExportConfig => ({
  title: "Liste des Régimes TVA",
  filename: "tva",
  data: tvas,
  columns: [
    { key: "Reference", label: "Référence", width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: "Libelle", label: "Libellé", width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: "Taux", label: "Taux (%)", width: 20, pdfWidth: 25, excelWidth: 20 },
    {
      key: "Actif",
      label: "État",
      width: 15,
      pdfWidth: 20,
      excelWidth: 15,
      formatter: (value) => (value === 1 ? "Actif" : "Inactif"),
    },
    { key: "Utilisateur", label: "Utilisateur", width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: "Heure",
      label: "Date de Création",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) =>
        value ? new Date(value).toLocaleDateString("fr-FR") : "-",
    },
  ],
});
export const createModePaiementExportConfig = (modes: any[]): ExportConfig => ({
  title: "Liste des Modes de Paiement",
  filename: "modes_paiement",
  data: modes,
  columns: [
    { key: "Reference", label: "Référence", width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: "Libelle", label: "Libellé", width: 40, pdfWidth: 50, excelWidth: 40 },
    {
      key: "Nombre_Jour_Echeance",
      label: "Jours Échéance",
      width: 20,
      pdfWidth: 25,
      excelWidth: 20,
    },
    {
      key: "Versement_Banque",
      label: "Versement Banque",
      width: 20,
      pdfWidth: 25,
      excelWidth: 20,
      formatter: (value) => (value === 1 ? "Oui" : "Non"),
    },
    { key: "Utilisateur", label: "Utilisateur", width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: "Heure",
      label: "Date de Création",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) =>
        value ? new Date(value).toLocaleDateString("fr-FR") : "-",
    },
  ],
});
export const createNiveauCourExportConfig = (niveaux: any[]): ExportConfig => ({
  title: "Liste des Niveaux de Cours",
  filename: "niveaux_cours",
  data: niveaux,
  columns: [
    { key: "Reference", label: "Référence", width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: "Libelle", label: "Libellé", width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: "Nombre_Heure", label: "Heures", width: 15, pdfWidth: 20, excelWidth: 15 },
    { key: "Utilisateur", label: "Utilisateur", width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: "Heure",
      label: "Date de Création",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (v) => (v ? new Date(v).toLocaleDateString("fr-FR") : "-"),
    },
  ],
});
export const createSourceContactExportConfig = (sources: any[]): ExportConfig => ({
  title: "Liste des Sources de Contact",
  filename: "source_contact",
  data: sources,
  columns: [
    { key: "Reference", label: "Référence", width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: "Libelle", label: "Libellé", width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: "Utilisateur", label: "Utilisateur", width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: "Heure",
      label: "Date Création",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (v) => (v ? new Date(v).toLocaleDateString("fr-FR") : "-"),
    },
  ],
});
export const createServiceDemandeExportConfig = (
  serviceDemandes: any[]
): ExportConfig => ({
  title: "Liste des Demandes de Service",
  filename: "service_demandes",
  data: serviceDemandes,
  columns: [
    {
      key: "Reference",
      label: "Référence",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
    },
    {
      key: "Libelle",
      label: "Libellé",
      width: 40,
      pdfWidth: 50,
      excelWidth: 40,
    },
    {
      key: "Utilisateur",
      label: "Utilisateur",
      width: 30,
      pdfWidth: 40,
      excelWidth: 30,
    },
    {
      key: "Heure",
      label: "Date de Création",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value: string) =>
        value ? new Date(value).toLocaleDateString("fr-FR") : "-",
    },
  ],
});
/**
 * Config d’export pour les créneaux horaires (HoraireDemande)
 */
export const createHoraireDemandeExportConfig = (
  horaires: any[]
): ExportConfig => ({
  title: "Liste des Créneaux Horaires",
  filename: "horaires",
  data: horaires,
  columns: [
    { key: "Reference", label: "Référence", width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: "Libelle", label: "Libellé", width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: "Utilisateur", label: "Utilisateur", width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: "Heure",
      label: "Date de création",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) =>
        value ? new Date(value).toLocaleDateString("fr-FR") : "-",
    },
  ],
});
export const createNiveauLangueExportConfig = (niveaux: any[]): ExportConfig => ({
  title: "Liste des Niveaux de Langue",
  filename: "niveaux_langue",
  data: niveaux,
  columns: [
    { key: "Reference", label: "Référence", width: 20, pdfWidth: 30, excelWidth: 20 },
    { key: "Libelle", label: "Libellé", width: 40, pdfWidth: 50, excelWidth: 40 },
    { key: "Utilisateur", label: "Utilisateur", width: 30, pdfWidth: 40, excelWidth: 30 },
    {
      key: "Heure",
      label: "Date de Création",
      width: 20,
      pdfWidth: 30,
      excelWidth: 20,
      formatter: (value) => (value ? new Date(value).toLocaleDateString("fr-FR") : "-"),
    },
  ],
});