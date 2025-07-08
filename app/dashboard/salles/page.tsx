"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { GenericDataTable } from "@/components/ui/GenericDataTable";

import { useSalles } from "@/hooks/useSalles";

import AddSalleDialog from "@/components/salles/AddSalleDialog";
import UpdateSalleDialog from "@/components/salles/UpdateSalleDialog";
import ViewSalleDialog from "@/components/salles/ViewSalleDialog";
import { AddSalleFormData } from "@/schemas/salleSchema";

import {
  exportGenericData,
  createSalleExportConfig,
} from "@/lib/exportUtils";
import { Salle } from "@/schemas/salleSchema";

export default function SallesPage() {
  const {
    salles,
    fetchSalles,
    addSalle,
    updateSalle,
    deleteSalle,
  } = useSalles();

  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Salle | null>(null);

  useEffect(() => {
    fetchSalles();
  }, [fetchSalles]);

  const handleView = (s: Salle) => {
    setSelected(s);
    setViewOpen(true);
  };
  const handleEdit = (s: Salle) => {
    setSelected(s);
    setEditOpen(true);
  };
  const handleDelete = async (ref: string) => {
    const ok = await deleteSalle(ref);
    if (ok) {
      toast.success("Salle supprimée");
      fetchSalles();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };
  const handleAdd = async (data: AddSalleFormData) => {
    const ok = await addSalle(data);
    if (ok) {
      toast.success("Salle ajoutée");
      fetchSalles();
      setAddOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
  };
  const handleUpdate = async (data: Salle) => {
    const ok = await updateSalle(data);
    if (ok) {
      toast.success("Salle mise à jour");
      fetchSalles();
      setEditOpen(false);
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    { key: "Reference_Site", label: "Ref. Site" },
    {
      key: "Nombre_Candidat_Max",
      label: "Capacité max",
      formatter: (v: number) => v.toString(),
    },
    { key: "Utilisateur", label: "Utilisateur" },
    { key: "Heure", label: "Créé le" },
  ];

  return (
    <>
      <GenericDataTable
        data={salles}
        isLoading={false}
        onRefresh={fetchSalles}
        title="Gestion des Salles"
        description="Ajoutez, modifiez ou supprimez des salles"
        entityName="salle"
        entityNamePlural="salles"
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
                  <Download className="mr-2 h-4 w-4" /> Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(createSalleExportConfig(salles), "PDF")
                  }
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(createSalleExportConfig(salles), "Excel")
                  }
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(createSalleExportConfig(salles), "Word")
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
              Ajouter une salle
            </Button>
          </div>
        }
      />

      <AddSalleDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      {selected && (
        <ViewSalleDialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          reference={selected.Reference}
        />
      )}

      {selected && (
        <UpdateSalleDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          salle={selected}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
}
