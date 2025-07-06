"use client";

import { useEffect, useState } from "react";
import { useRaisons } from "@/hooks/use-raison";
import { Raison } from "@/schemas/raisonShema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import UpdateRaisonDialog from "@/components/raisons/UpdateRaisonDialog";
import AddRaisonDialog from "@/components/raisons/AddRaisonDialog";
import ViewRaisonDialog from "@/components/raisons/ViewRaisonDialog";
import {
  exportGenericData,
  createRaisonExportConfig,
} from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";


export default function RaisonsPage() {
  const { raisons, fetchRaisons, deleteRaison, addRaison, updateRaison } = useRaisons();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRaison, setSelectedRaison] = useState<Raison | null>(null);

  useEffect(() => {
    fetchRaisons();
  }, []);

  const handleView = (raison: Raison) => {
    setSelectedRaison(raison);
    setViewDialogOpen(true);
  };

  const handleEdit = (raison: Raison) => {
    setSelectedRaison(raison);
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (ref: string) => {
    const success = await deleteRaison(ref);
    if (success) {
      toast.success("Raison supprimée avec succès");
      fetchRaisons();
    } else {
      toast.error("Erreur lors de la suppression de la raison");
    }
  };

  const handleAdd = async (data: Raison) => {
    const success = await addRaison(data);
    if (success) {
      toast.success("Raison ajoutée avec succès");
      fetchRaisons();
      setAddDialogOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout de la raison");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    { key: "Utilisateur", label: "Utilisateur" },
  ];

  return (

    <>

      <GenericDataTable
        data={raisons}
        isLoading={false}
        onRefresh={fetchRaisons}
        title="Gestion des Raisons"
        description="Gérez les raisons dans le système"
        entityName="raison"
        entityNamePlural="raisons"
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
        <DropdownMenuItem onClick={() => exportGenericData(createRaisonExportConfig(raisons), "PDF")}>
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportGenericData(createRaisonExportConfig(raisons), "Excel")}>
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportGenericData(createRaisonExportConfig(raisons), "Word")}>
          Word
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Button onClick={() => setAddDialogOpen(true)} className="bg-black text-white hover:bg-black/80">
      Ajouter une raison
    </Button>
  </div>
}

      />

      <AddRaisonDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      {selectedRaison && (
        <ViewRaisonDialog
          raison={selectedRaison}
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
        />
      )}

      {selectedRaison && (
        <UpdateRaisonDialog
          raison={selectedRaison}
          open={updateDialogOpen}
          onSubmit={async (data) => {
            const success = await updateRaison(data);
            if (success) {
              toast.success("Raison modifiée avec succès");
              fetchRaisons();
              setUpdateDialogOpen(false);
            } else {
              toast.error("Erreur lors de la modification de la raison");
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
