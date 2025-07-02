"use client";

import { useEffect, useState } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { Document, formatPrice } from "@/schemas/documentShema";
import AddDocumentDialog from "@/components/documents/AddDocumentDialog";
import { UpdateDocumentDialog } from "@/components/documents/UpdateDocumentDialog";
import { ViewDocumentDialog } from "@/components/documents/ViewDocumentDialog";
import { Button } from "@/components/ui/button";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { toast } from "sonner";
import {
  exportToPDF,
  exportToExcel,
  exportToWord,
} from "@/lib/exportUtils";

export default function DocumentsPage() {
  const {
    documents,
    isLoading,
    fetchDocuments,
    deleteDocument,
    addDocument,
  } = useDocuments();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleView = (doc: Document) => {
    setSelectedDocument(doc);
    setViewDialogOpen(true);
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (ref: string) => {
    const success = await deleteDocument(ref);
    if (success) {
      toast.success("Document supprimé avec succès");
      fetchDocuments();
    } else {
      toast.error("Erreur lors de la suppression du document");
    }
  };

  const handleBulkDelete = async (refs: string[]) => {
    let successCount = 0;
    let failCount = 0;
    for (const ref of refs) {
      const result = await deleteDocument(ref);
      result ? successCount++ : failCount++;
    }
    if (successCount > 0) toast.success(`${successCount} document(s) supprimé(s)`);
    if (failCount > 0) toast.error(`${failCount} suppression(s) échouée(s)`);
    fetchDocuments();
  };

  const handleExport = async (format: string) => {
    try {
      const filename = `documents_${new Date().toISOString().slice(0, 10)}`;
      const data = documents;

      switch (format) {
        case "PDF":
          await exportToPDF(data, filename);
          break;
        case "Excel":
          await exportToExcel(data, filename);
          break;
        case "Word":
          await exportToWord(data, filename);
          break;
        default:
          toast.error("Format d'export non supporté");
          return;
      }

      toast.success(`Export réussi en ${format}`);
    } catch (error) {
      toast.error("Erreur lors de l'export");
    }
  };

  const handleAdd = async (data: Document) => {
    const success = await addDocument(data);
    if (success) {
      toast.success("Document ajouté avec succès");
      fetchDocuments();
      setAddDialogOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout du document");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Nom_Document", label: "Nom" },
    { key: "Type", label: "Type" },
    {
      key: "Obligatoire",
      label: "Obligatoire",
      render: (doc: Document) => (doc.Obligatoire ? "Oui" : "Non"),
    },
    {
      key: "Prix_Traitement",
      label: "Prix",
      render: (doc: Document) => formatPrice(doc.Prix_Traitement),
    },
  ];

  return (
    <>
      <GenericDataTable
        data={documents}
        isLoading={isLoading}
        onRefresh={fetchDocuments}
        title="Gestion des Documents"
        description="Gérez les documents administratifs"
        entityName="document"
        entityNamePlural="documents"
        columns={columns}
        idField="Reference"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
        addButton={
          <Button onClick={() => setAddDialogOpen(true)}>
            Ajouter un document
          </Button>
        }
      />

      <AddDocumentDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      {selectedDocument && (
        <ViewDocumentDialog
          document={selectedDocument}
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
        />
      )}

      {selectedDocument && (
        <UpdateDocumentDialog
          document={selectedDocument}
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
        />
      )}
    </>
  );
}
