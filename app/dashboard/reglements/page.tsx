"use client";

import { useEffect, useState } from "react";
import { useObjetsReglement } from "@/hooks/use-reglement";
import { ObjetReglement } from "@/schemas/reglementShema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import AddObjetReglementDialog from "@/components/reglements/AddObjetReglementDialog";
import UpdateObjetReglementDialog from "@/components/reglements/UpdateObjetReglementDialog";
import ViewObjetReglementDialog from "@/components/reglements/ViewObjetReglementDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import {
  exportGenericData,
  createObjetReglementExportConfig,
} from "@/lib/exportUtils";

export default function ReglementPage() {
  const {
    objetsReglement,
    fetchObjetsReglement,
    addObjetReglement,
    updateObjetReglement,
    deleteObjetReglement,
  } = useObjetsReglement();

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedObjet, setSelectedObjet] = useState<ObjetReglement | null>(null);

  useEffect(() => {
    fetchObjetsReglement();
  }, [fetchObjetsReglement]);

  const handleEdit = (objet: ObjetReglement) => {
    setSelectedObjet(objet);
    setUpdateDialogOpen(true);
  };

  const handleView = (objet: ObjetReglement) => {
    setSelectedObjet(objet);
    setViewDialogOpen(true);
  };

  const handleDelete = async (ref: string) => {
    const success = await deleteObjetReglement(ref);
    if (success) {
      toast.success("Objet supprimé avec succès");
      fetchObjetsReglement();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAdd = async (data: ObjetReglement) => {
    const success = await addObjetReglement(data);
    if (success) {
      toast.success("Objet ajouté avec succès");
      fetchObjetsReglement();
      setAddDialogOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout de l'objet");
    }
  };

  const handleUpdate = async (data: ObjetReglement) => {
    const success = await updateObjetReglement(data);
    if (success) {
      toast.success("Objet mis à jour avec succès");
      fetchObjetsReglement();
      setUpdateDialogOpen(false);
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Utilisateur", label: "Utilisateur" },
    { key: "Heure", label: "Heure" },
    { key: "Libelle", label: "Libellé" },
  ];

  return (
    <>
      <GenericDataTable
        data={objetsReglement}
        isLoading={false}
        onRefresh={fetchObjetsReglement}
        title="Gestion des objets de règlement"
        description="Ajoutez, modifiez ou supprimez des objets de règlement"
        entityName="objet"
        entityNamePlural="objets"
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
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createObjetReglementExportConfig(objetsReglement),
                      "PDF"
                    )
                  }
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createObjetReglementExportConfig(objetsReglement),
                      "Excel"
                    )
                  }
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createObjetReglementExportConfig(objetsReglement),
                      "Word"
                    )
                  }
                >
                  Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-black text-white hover:bg-black/80"
            >
              Ajouter un objet
            </Button>
          </div>
        }
      />

      <AddObjetReglementDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      {selectedObjet && (
        <UpdateObjetReglementDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          objet={selectedObjet}
          onSubmit={handleUpdate}
        />
      )}

      {selectedObjet && (
        <ViewObjetReglementDialog
          objet={selectedObjet}
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
        />
      )}
    </>
  );
}
