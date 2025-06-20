import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun } from 'docx'

export interface User {
  name: string
  email: string
  telephone?: string
  adresse?: string
  profilLabel?: string
  joinDate?: string
}

export const exportToPDF = (users: User[], filename: string = 'utilisateurs') => {
  try {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(16)
    doc.text('Liste des Utilisateurs', 14, 22)
    
    // Add date
    doc.setFontSize(10)
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30)
    
    // Prepare table data
    const tableColumns = ['Nom', 'Email', 'Téléphone', 'Adresse', 'Rôle', 'Date d\'inscription']
    const tableRows = users.map(user => [
      user.name || '',
      user.email || '',
      user.telephone || '',
      user.adresse || '',
      user.profilLabel || '',
      user.joinDate ? new Date(user.joinDate).toLocaleDateString('fr-FR') : ''
    ])
    
    // Add table
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [58, 144, 218], // Blue color matching the theme
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Light gray
      },
      margin: { top: 35 }
    })
    
    // Save the PDF
    doc.save(`${filename}.pdf`)
    
    return true
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    return false
  }
}

export const exportToExcel = (users: User[], filename: string = 'utilisateurs') => {
  try {
    // Prepare data for Excel
    const excelData = users.map(user => ({
      'Nom': user.name || '',
      'Email': user.email || '',
      'Téléphone': user.telephone || '',
      'Adresse': user.adresse || '',
      'Rôle': user.profilLabel || '',
      'Date d\'inscription': user.joinDate ? new Date(user.joinDate).toLocaleDateString('fr-FR') : ''
    }))
    
    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    
    // Set column widths
    const colWidths = [
      { wch: 25 }, // Nom
      { wch: 30 }, // Email
      { wch: 15 }, // Téléphone
      { wch: 40 }, // Adresse
      { wch: 20 }, // Rôle
      { wch: 20 }  // Date d'inscription
    ]
    worksheet['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs')
    
    // Save the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, `${filename}.xlsx`)
    
    return true
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error)
    return false
  }
}

export const exportToWord = async (users: User[], filename: string = 'utilisateurs') => {
  try {
    // Create table rows for users
    const tableRows = users.map(user => 
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(user.name || '')],
            width: { size: 20, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph(user.email || '')],
            width: { size: 25, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph(user.telephone || '')],
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph(user.adresse || '')],
            width: { size: 25, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph(user.profilLabel || '')],
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph(user.joinDate ? new Date(user.joinDate).toLocaleDateString('fr-FR') : '')],
            width: { size: 20, type: WidthType.PERCENTAGE }
          })
        ]
      })
    )

    // Create the document
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Liste des Utilisateurs",
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
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Nom", bold: true, color: "FFFFFF" })]
                    })],
                    shading: { fill: "3A90DA" },
                    width: { size: 20, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Email", bold: true, color: "FFFFFF" })]
                    })],
                    shading: { fill: "3A90DA" },
                    width: { size: 25, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Téléphone", bold: true, color: "FFFFFF" })]
                    })],
                    shading: { fill: "3A90DA" },
                    width: { size: 15, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Adresse", bold: true, color: "FFFFFF" })]
                    })],
                    shading: { fill: "3A90DA" },
                    width: { size: 25, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Rôle", bold: true, color: "FFFFFF" })]
                    })],
                    shading: { fill: "3A90DA" },
                    width: { size: 15, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: "Date d'inscription", bold: true, color: "FFFFFF" })]
                    })],
                    shading: { fill: "3A90DA" },
                    width: { size: 20, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              // Data rows
              ...tableRows
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total: ${users.length} utilisateur(s)`,
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
    saveAs(buffer, `${filename}.docx`)
    
    return true
  } catch (error) {
    console.error('Erreur lors de l\'export Word:', error)
    return false
  }
}

export const exportBulkUsers = async (users: User[], selectedEmails: string[], format: 'PDF' | 'Excel' | 'Word') => {
  // Filter users based on selected emails
  const selectedUsers = users.filter(user => selectedEmails.includes(user.email))
  
  if (selectedUsers.length === 0) {
    throw new Error('Aucun utilisateur sélectionné pour l\'export')
  }
  
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `utilisateurs_selection_${timestamp}`
  
  switch (format) {
    case 'PDF':
      return exportToPDF(selectedUsers, filename)
    case 'Excel':
      return exportToExcel(selectedUsers, filename)
    case 'Word':
      return await exportToWord(selectedUsers, filename)
    default:
      throw new Error('Format d\'export non supporté')
  }
}

export const exportAllUsers = async (users: User[], format: 'PDF' | 'Excel' | 'Word') => {
  if (users.length === 0) {
    throw new Error('Aucun utilisateur à exporter')
  }
  
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `tous_utilisateurs_${timestamp}`
  
  switch (format) {
    case 'PDF':
      return exportToPDF(users, filename)
    case 'Excel':
      return exportToExcel(users, filename)
    case 'Word':
      return await exportToWord(users, filename)
    default:
      throw new Error('Format d\'export non supporté')
  }
} 