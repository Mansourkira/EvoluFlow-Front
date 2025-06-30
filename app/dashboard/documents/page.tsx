// Fichier : app/dashboard/documents/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { Document, formatPrice } from "@/schemas/documentShema";
import AddDocumentDialog from "@/components/documents/AddDocumentDialog";
import UpdateDocumentDialog from "@/components/documents/UpdateDocumentDialog";
import { ViewDocumentDialog } from "@/components/documents/ViewDocumentDialog";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Edit,
  Trash2,
  FileText,
  MoreHorizontal,
  Loader2,
} from "lucide-react";

export default function DocumentsPage() {
  const { documents, isLoading, fetchDocuments, deleteDocument, addDocument } = useDocuments();
  const { toast } = useToast();

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleView = (document: Document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (reference: string) => {
    setDocumentToDelete(reference);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const success = await deleteDocument(documentToDelete);
    if (success) {
      toast({ title: "✅ Succès", description: "Document supprimé avec succès" });
      fetchDocuments();
    } else {
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setIsDeleting(false);
  };

  const handleAddDocument = async (data: Document) => {
    await addDocument(data);
    fetchDocuments();
    setAddDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="text-blue-500" /> Documents
        </h1>
        <Button onClick={() => setAddDialogOpen(true)}>Ajouter un document</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Obligatoire</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.Reference}>
                  <TableCell>{doc.Reference}</TableCell>
                  <TableCell>{doc.Nom_Document || '-'}</TableCell>
                  <TableCell>{doc.Type || '-'}</TableCell>
                  <TableCell>{doc.Obligatoire ? 'Oui' : 'Non'}</TableCell>
                  <TableCell>{formatPrice(doc.Prix_Traitement)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(doc)}>
                          <Eye className="w-4 h-4 mr-2" /> Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(doc)}>
                          <Edit className="w-4 h-4 mr-2" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(doc.Reference)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
      <AddDocumentDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddDocument}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
