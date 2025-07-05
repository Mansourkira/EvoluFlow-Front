"use client";

import { useEffect, useState } from "react";
import { useMagasins } from "@/hooks/use-magasin";
import { Magasin } from "@/schemas/magasinShema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import AddMagasinDialog from "@/components/magasins/AddMagasinDialog";
import UpdateMagasinDialog from "@/components/magasins/UpdateMagasinDialog";
import ViewMagasinDialog from "@/components/magasins/ViewMagasinDailog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import {
  exportGenericData,
  createMagasinExportConfig,
} from "@/lib/exportUtils";

export default function MagasinPage() {
  const {
    magasins,
    fetchMagasins,
    addMagasin,
    updateMagasin,
    deleteMagasin,
  } = useMagasins();

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMagasin, setSelectedMagasin] = useState<Magasin | null>(null);

  useEffect(() => {
    fetchMagasins();
  }, [fetchMagasins]);

  const handleEdit = (magasin: Magasin) => {
    setSelectedMagasin(magasin);
    setUpdateDialogOpen(true);
  };

  const handleView = (magasin: Magasin) => {
    setSelectedMagasin(magasin);
    setViewDialogOpen(true);
  };

  const handleDelete = async (ref: string) => {
    const success = await deleteMagasin(ref);
    if (success) {
      toast.success("Magasin supprimé avec succès");
      fetchMagasins();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAdd = async (data: Magasin) => {
    const success = await addMagasin(data);
    if (success) {
      toast.success("Magasin ajouté avec succès");
      fetchMagasins();
      setAddDialogOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout du magasin");
    }
  };

  const handleUpdate = async (data: Magasin) => {
    const fullData: Magasin = {
      ...data,
      Stock_Negatif: data.Stock_Negatif ?? 0, // ✅ garantir présence du champ requis
    };
    const success = await updateMagasin(fullData);
    if (success) {
      toast.success("Magasin mis à jour avec succès");
      fetchMagasins();
      setUpdateDialogOpen(false);
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    {
      key: "Stock_Negatif",
      label: "Stock Négatif",
      formatter: (value: number) => (value === 1 ? "Autorisé" : "Non autorisé"),
    },
    { key: "Utilisateur", label: "Utilisateur" },
    { key: "Heure", label: "Date de Création" },
  ];

  return (
    <>
      <GenericDataTable
        data={magasins}
        isLoading={false}
        onRefresh={fetchMagasins}
        title="Gestion des magasins"
        description="Ajoutez, modifiez ou supprimez des magasins"
        entityName="magasin"
        entityNamePlural="magasins"
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
                      createMagasinExportConfig(magasins),
                      "PDF"
                    )
                  }
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createMagasinExportConfig(magasins),
                      "Excel"
                    )
                  }
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createMagasinExportConfig(magasins),
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
              Ajouter un magasin
            </Button>
          </div>
        }
      />

      {addDialogOpen && (
        <AddMagasinDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSubmit={handleAdd}
        />
      )}

      {selectedMagasin && updateDialogOpen && (
        <UpdateMagasinDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          magasin={selectedMagasin}
          onSubmit={handleUpdate}
        />
      )}

      {selectedMagasin && viewDialogOpen && (
       <ViewMagasinDialog
  magasin={selectedMagasin} // ✅ Corrigé
  open={viewDialogOpen}
  onClose={() => setViewDialogOpen(false)}
/>

      )}
    </>
  );
}
