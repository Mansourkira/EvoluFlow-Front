"use client";

import { useEffect, useState } from "react";
import { useHoraireDemandes } from "@/hooks/use-horaire-demande";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import AddHoraireDemandeDialog from "@/components/horaire-demande/AddHoraireDemandeDialog";
import UpdateHoraireDemandeDialog from "@/components/horaire-demande/UpdateHoraireDemandeDialog";
import ViewHoraireDemandeDialog from "@/components/horaire-demande/ViewHoraireDemandeDialog";
import {
  AddHoraireDemandeFormData,
  HoraireDemande,
} from "@/schemas/horaireDemandeSchema";

import {
  exportGenericData,
  createHoraireDemandeExportConfig,
} from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

export default function HoraireDemandePage() {
  const {
    horaires,
    fetchHoraires,
    addHoraire,
    updateHoraire,
    deleteHoraire,
  } = useHoraireDemandes();

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<HoraireDemande | null>(null);

  useEffect(() => {
    fetchHoraires();
  }, [fetchHoraires]);

  const handleView = (h: HoraireDemande) => {
    setSelected(h);
    setViewOpen(true);
  };
  const handleEdit = (h: HoraireDemande) => {
    setSelected(h);
    setEditOpen(true);
  };
  const handleDelete = async (ref: string) => {
    if (await deleteHoraire(ref)) {
      toast.success("Créneau supprimé");
      fetchHoraires();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };
  const handleAdd = async (data: AddHoraireDemandeFormData) => {
    if (await addHoraire(data)) {
      toast.success("Créneau ajouté");
      fetchHoraires();
      setAddOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
  };
  const handleUpdate = async (data: HoraireDemande) => {
    if (await updateHoraire(data)) {
      toast.success("Créneau mis à jour");
      fetchHoraires();
      setEditOpen(false);
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    { key: "Utilisateur", label: "Utilisateur" },
    { key: "Heure", label: "Date de création" },
  ];

  return (
    <>
      <GenericDataTable
        data={horaires}
        isLoading={false}
        onRefresh={fetchHoraires}
        title="Créneaux horaires"
        description="Gérez vos plages horaires"
        entityName="créneau"
        entityNamePlural="créneaux"
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
                    exportGenericData(
                      createHoraireDemandeExportConfig(horaires),
                      "PDF"
                    )
                  }
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createHoraireDemandeExportConfig(horaires),
                      "Excel"
                    )
                  }
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createHoraireDemandeExportConfig(horaires),
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
              Ajouter un créneau
            </Button>
          </div>
        }
      />

      <AddHoraireDemandeDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      {selected && (
        <ViewHoraireDemandeDialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          reference={selected.Reference}
        />
      )}

      {selected && (
        <UpdateHoraireDemandeDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          horaire={selected}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
}
