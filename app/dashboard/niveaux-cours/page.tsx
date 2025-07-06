// app/dashboard/niveaux-cours/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useNiveauxCour } from "@/hooks/useNiveauxCour";
import { NiveauCour, AddNiveauCourFormData } from "@/schemas/niveauCourSchema";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddNiveauCourDialog from "@/components/niveaux-cours/AddNiveauCourDialog";
import UpdateNiveauCourDialog from "@/components/niveaux-cours/UpdateNiveauCourDialog";
import ViewNiveauCourDialog from "@/components/niveaux-cours/ViewNiveauCourDialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import {
  exportGenericData,
  createNiveauCourExportConfig,
} from "@/lib/exportUtils";

export default function NiveauxCourPage() {
  const {
    niveaux,
    fetchNiveaux,
    addNiveau,
    updateNiveau,
    deleteNiveau,
  } = useNiveauxCour();

  const [viewOpen, setViewOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selected, setSelected] = useState<NiveauCour | null>(null);

  useEffect(() => {
    fetchNiveaux();
  }, [fetchNiveaux]);

  const handleView = (niveau: NiveauCour) => {
    setSelected(niveau);
    setViewOpen(true);
  };

  const handleEdit = (niveau: NiveauCour) => {
    setSelected(niveau);
    setUpdateOpen(true);
  };

  const handleDelete = async (ref: string) => {
    const success = await deleteNiveau(ref);
    if (success) {
      toast.success("Niveau supprimé avec succès");
      fetchNiveaux();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAdd = async (data: AddNiveauCourFormData) => {
    const success = await addNiveau(data);
    if (success) {
      toast.success("Niveau ajouté avec succès");
      fetchNiveaux();
      setAddOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    { key: "Nombre_Heure", label: "Heures" },
    { key: "Utilisateur", label: "Utilisateur" },
    {
      key: "Heure",
      label: "Date de création",
      formatter: (v: string) => (v ? new Date(v).toLocaleString() : "-"),
    },
  ];

  return (
    <>
      <GenericDataTable
        data={niveaux}
        isLoading={false}
        onRefresh={fetchNiveaux}
        title="Gestion des Niveaux de Cours"
        description="Ajoutez, modifiez ou supprimez des niveaux de cours"
        entityName="niveau"
        entityNamePlural="niveaux"
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
                      createNiveauCourExportConfig(niveaux),
                      "PDF"
                    )
                  }
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createNiveauCourExportConfig(niveaux),
                      "Excel"
                    )
                  }
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createNiveauCourExportConfig(niveaux),
                      "Word"
                    )
                  }
                >
                  Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setAddOpen(true)}
              className="bg-black text-white hover:bg-black/80"
            >
              Ajouter un niveau
            </Button>
          </div>
        }
      />

      {addOpen && (
        <AddNiveauCourDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={handleAdd}
        />
      )}

      {selected && viewOpen && (
        <ViewNiveauCourDialog
          reference={selected.Reference}
          open={viewOpen}
          onClose={() => setViewOpen(false)}
        />
      )}

      {selected && updateOpen && (
        <UpdateNiveauCourDialog
          niveau={selected}
          open={updateOpen}
          onOpenChange={setUpdateOpen}
          onSubmit={async (data) => {
            const success = await updateNiveau(data);
            if (success) {
              toast.success("Niveau mis à jour avec succès");
              fetchNiveaux();
              setUpdateOpen(false);
            } else {
              toast.error("Erreur lors de la mise à jour");
            }
          }}
        />
      )}
    </>
  );
}
