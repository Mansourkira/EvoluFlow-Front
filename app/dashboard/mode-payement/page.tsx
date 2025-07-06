"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { useModePaiement } from "@/hooks/useModePaiement";
import AddModePaiementDialog from "@/components/mode-payement/AddModePaiementDialog";
import ViewModePaiementDialog from "@/components/mode-payement/ViewModePaiementDialog";
import UpdateModePaiementDialog from "@/components/mode-payement/UpdateModePaimentDialog";
import { ModePaiement } from "@/schemas/modePaiementSchema";
import { createModePaiementExportConfig, exportGenericData } from "@/lib/exportUtils";

export default function ModePaiementPage() {
  const { modes, fetchModes, addMode, updateMode, deleteMode } = useModePaiement();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ModePaiement | null>(null);

  useEffect(() => {
    fetchModes();
  }, []);

  const handleView = (mode: ModePaiement) => {
    setSelectedMode(mode);
    setViewDialogOpen(true);
  };

  const handleEdit = (mode: ModePaiement) => {
    setSelectedMode(mode);
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (ref: string) => {
    const success = await deleteMode(ref);
    if (success) {
      toast.success("Mode de paiement supprimé");
      fetchModes();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAdd = async (data: ModePaiement) => {
    const success = await addMode(data);
    if (success) {
      toast.success("Ajout réussi");
      fetchModes();
      setAddDialogOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    { key: "Nombre_Jour_Echeance", label: "Jours d'échéance" },
    {
      key: "Versement_Banque",
      label: "Versement Banque",
      formatter: (v: number) => (v === 1 ? "Oui" : "Non"),
    },
    { key: "Utilisateur", label: "Utilisateur" },
  ];

  return (
    <>
      <GenericDataTable
        data={modes}
        isLoading={false}
        onRefresh={fetchModes}
        title="Modes de Paiement"
        description="Gérez les modes de paiement disponibles"
        entityName="mode"
        entityNamePlural="modes"
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
                <DropdownMenuItem onClick={() => exportGenericData(createModePaiementExportConfig(modes), "PDF")}>
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportGenericData(createModePaiementExportConfig(modes), "Excel")}>
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportGenericData(createModePaiementExportConfig(modes), "Word")}>
                  Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-black text-white hover:bg-black/80"
            >
              Ajouter un mode
            </Button>
          </div>
        }
      />

      <AddModePaiementDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      {selectedMode && (
        <ViewModePaiementDialog
          mode={selectedMode}
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
        />
      )}

      {selectedMode && (
        <UpdateModePaiementDialog
          mode={selectedMode}
          open={updateDialogOpen}
          onSubmit={async (data) => {
            const success = await updateMode(data);
            if (success) {
              toast.success("Mode de paiement mis à jour");
              fetchModes();
              setUpdateDialogOpen(false);
            } else {
              toast.error("Erreur lors de la mise à jour");
            }
          }}
          onOpenChange={(open: boolean) => !open && setUpdateDialogOpen(false)}
        />
      )}
    </>
  );
}
