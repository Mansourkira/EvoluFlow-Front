"use client";

import { useEffect, useState } from "react";
import { useTvas } from "@/hooks/use-tva";
import { Tva } from "@/schemas/tvaSchema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import UpdateTvaDialog from "@/components/tva/UpdateTvaDialog";
import AddTvaDialog from "@/components/tva/AddTvaDialog";
import ViewTvaDialog from "@/components/tva/ViewTvaDialog";
import {
  exportGenericData,
  createTvaExportConfig,
} from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

export default function TvaPage() {
  const { tvas, fetchTvas, deleteTva, addTva, updateTva } = useTvas();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTva, setSelectedTva] = useState<Tva | null>(null);

  useEffect(() => {
    fetchTvas();
  }, []);

  const handleView = (tva: Tva) => {
    setSelectedTva(tva);
    setViewDialogOpen(true);
  };

  const handleEdit = (tva: Tva) => {
    setSelectedTva(tva);
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (ref: string) => {
    const success = await deleteTva(ref);
    if (success) {
      toast.success("TVA supprimée avec succès");
      fetchTvas();
    } else {
      toast.error("Erreur lors de la suppression de la TVA");
    }
  };

  const handleAdd = async (data: Tva) => {
    const success = await addTva(data);
    if (success) {
      toast.success("TVA ajoutée avec succès");
      fetchTvas();
      setAddDialogOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout de la TVA");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    { key: "Taux", label: "Taux" },
    {
      key: "Actif",
      label: "Actif",
      formatter: (value: number) => (value === 1 ? "Oui" : "Non"),
    },
    { key: "Utilisateur", label: "Utilisateur" },
  ];

  return (
    <>
      <GenericDataTable
        data={tvas}
        isLoading={false}
        onRefresh={fetchTvas}
        title="Gestion des TVA"
        description="Gérez les taux de TVA dans le système"
        entityName="TVA"
        entityNamePlural="TVA"
        columns={columns}
        idField="Reference"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
                <DropdownMenuItem onClick={() => exportGenericData(createTvaExportConfig(tvas), "PDF")}>
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportGenericData(createTvaExportConfig(tvas), "Excel")}>
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportGenericData(createTvaExportConfig(tvas), "Word")}>
                  Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-black text-white hover:bg-black/80"
            >
              Ajouter une TVA
            </Button>
          </div>
        }
      />

      <AddTvaDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      {selectedTva && (
        <ViewTvaDialog
          tva={selectedTva}
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
        />
      )}

      {selectedTva && (
        <UpdateTvaDialog
          tva={selectedTva}
          open={updateDialogOpen}
          onSubmit={async (data) => {
            const success = await updateTva(data);
            if (success) {
              toast.success("TVA modifiée avec succès");
              fetchTvas();
              setUpdateDialogOpen(false);
            } else {
              toast.error("Erreur lors de la modification de la TVA");
            }
          }}
          onOpenChange={(open: boolean) => {
            if (!open) setUpdateDialogOpen(false);
          }}
        />
      )}
    </>
  );
}
