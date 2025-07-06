"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

import { useSourceContacts } from "@/hooks/useSourceContacts";
import { SourceContact } from "@/schemas/sourceContactSchema";
import {
  exportGenericData,
  createSourceContactExportConfig,
} from "@/lib/exportUtils";

import AddSourceContactDialog from "@/components/source-contact/AddSourceContactDialog";
import UpdateSourceContactDialog from "@/components/source-contact/UpdateSourceContactDialog";
import ViewSourceContactDialog from "@/components/source-contact/ViewSourceContactDialog";

export default function SourceContactPage() {
  const {
    sources,
    fetchSources,
    addSource,
    updateSource,
    deleteSource,
  } = useSourceContacts();

  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<SourceContact | null>(null);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleAdd = async (data: SourceContact) => {
    const ok = await addSource(data);
    if (ok) {
      toast.success("Source ajoutée");
      fetchSources();
      setAddOpen(false);
    } else {
      toast.error("Erreur à l'ajout");
    }
  };

  const handleUpdate = async (data: SourceContact) => {
    const ok = await updateSource(data);
    if (ok) {
      toast.success("Source mise à jour");
      fetchSources();
      setUpdateOpen(false);
    } else {
      toast.error("Erreur à la mise à jour");
    }
  };

  const handleDelete = async (ref: string) => {
    const ok = await deleteSource(ref);
    if (ok) {
      toast.success("Source supprimée");
      fetchSources();
    } else {
      toast.error("Erreur à la suppression");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    { key: "Utilisateur", label: "Utilisateur" },
    { key: "Heure", label: "Date Création" },
  ];

  return (
    <>
      <GenericDataTable
        data={sources}
        isLoading={false}
        onRefresh={fetchSources}
        title="Sources de contact"
        description="Gérez vos sources de contact"
        entityName="source"
        entityNamePlural="sources"
        columns={columns}
        idField="Reference"
        onView={(item) => {
          setSelected(item);
          setViewOpen(true);
        }}
        onEdit={(item) => {
          setSelected(item);
          setUpdateOpen(true);
        }}
        onDelete={(ref) => handleDelete(ref)}
        addButton={
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createSourceContactExportConfig(sources),
                      "PDF"
                    )
                  }
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createSourceContactExportConfig(sources),
                      "Excel"
                    )
                  }
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createSourceContactExportConfig(sources),
                      "Word"
                    )
                  }
                >
                  Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="bg-black text-white hover:bg-black/80"
              onClick={() => setAddOpen(true)}
            >
              Ajouter une source
            </Button>
          </div>
        }
      />

      {/* Add */}
      <AddSourceContactDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      {/* View */}
      {selected && (
        <ViewSourceContactDialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          reference={selected.Reference}
        />
      )}

      {/* Update */}
      {selected && (
        <UpdateSourceContactDialog
          open={updateOpen}
          onOpenChange={setUpdateOpen}
          source={selected}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
}
