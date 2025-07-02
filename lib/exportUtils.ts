import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document as WordDocument, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun } from 'docx';

export const exportToPDF = (items: any[], filename: string = 'export') => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Export - ${filename}`, 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

    const keys = Object.keys(items[0] || {});
    const tableRows = items.map(item => keys.map(k => item[k] ?? ''));

    autoTable(doc, {
      head: [keys],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [58, 144, 218], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 35 }
    });

    doc.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Erreur export PDF:', error);
    return false;
  }
};

export const exportToExcel = (items: any[], filename: string = 'export') => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Feuille1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Erreur export Excel:', error);
    return false;
  }
};

export const exportToWord = async (items: any[], filename: string = 'export') => {
  try {
    const keys = Object.keys(items[0] || {});

    const headerRow = new TableRow({
      children: keys.map(key =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: key, bold: true, color: 'FFFFFF' })] })],
          shading: { fill: '3A90DA' },
          width: { size: 100 / keys.length, type: WidthType.PERCENTAGE }
        })
      )
    });

    const dataRows = items.map(item =>
      new TableRow({
        children: keys.map(key =>
          new TableCell({
            children: [new Paragraph(String(item[key] ?? ''))],
            width: { size: 100 / keys.length, type: WidthType.PERCENTAGE }
          })
        )
      })
    );

    const doc = new WordDocument({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: `Export - ${filename}`, bold: true, size: 32, color: '3A90DA' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [new TextRun({ text: `Généré le: ${new Date().toLocaleDateString('fr-FR')}`, italics: true, size: 20 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...dataRows] }),
          new Paragraph({
            children: [new TextRun({ text: `Total: ${items.length} ligne(s)`, bold: true })],
            spacing: { before: 400 }
          })
        ]
      }]
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${filename}.docx`);
    return true;
  } catch (error) {
    console.error('Erreur export Word:', error);
    return false;
  }
};
