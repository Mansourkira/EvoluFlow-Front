"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import AddValidationReglementDialog from "@/components/validation_reglement/AddValidationReglementDialog";
import UpdateValidationReglementDialog from "@/components/validation_reglement/UpdateValidationReglementDialog";
import ViewValidationReglementDialog from "@/components/validation_reglement/ViewValidationReglementDialog";
import { ValidationReglement } from "@/schemas/validationReglementSchema";
import { useValidationReglement } from "@/hooks/useValidationReglements";
import { exportGenericData, createValidationReglementExportConfig } from "@/lib/exportUtils";

export default function ValidationReglementPage() {
  const {
    validationReglements,
    fetchValidationReglements,
    addValidationReglement,
    updateValidationReglement,
    deleteValidationReglement,
  } = useValidationReglement();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selected, setSelected] = useState<ValidationReglement | null>(null);

  useEffect(() => {
    fetchValidationReglements();
  }, [fetchValidationReglements]);

  const handleAdd = async (data: ValidationReglement) => {
    const success = await addValidationReglement(data);
    if (success) {
      toast.success("Ajouté avec succès");
      setAddDialogOpen(false);
    } else toast.error("Erreur lors de l'ajout");
  };

  const handleUpdate = async (data: ValidationReglement) => {
    const success = await updateValidationReglement(data);
    if (success) {
      toast.success("Mis à jour avec succès");
      setUpdateDialogOpen(false);
    } else toast.error("Erreur lors de la mise à jour");
  };

  const handleDelete = async (ref: string) => {
    const success = await deleteValidationReglement(ref);
    if (success) toast.success("Supprimé avec succès");
    else toast.error("Erreur lors de la suppression");
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    {
      key: "Valide",
      label: "Validé",
      formatter: (v: number) => (v === 1 ? "Oui" : "Non"),
    },
    { key: "Utilisateur", label: "Utilisateur" },
    { key: "Heure", label: "Heure" },
  ];

  return (
    <>
      <GenericDataTable
        data={validationReglements}
        isLoading={false}
        onRefresh={fetchValidationReglements}
        title="Validation des Règlements"
        description="Ajoutez, modifiez ou supprimez des validations"
        entityName="validation"
        entityNamePlural="validations"
        columns={columns}
        idField="Reference"
        onView={(d) => {
          setSelected(d);
          setViewDialogOpen(true);
        }}
        onEdit={(d) => {
          setSelected(d);
          setUpdateDialogOpen(true);
        }}
        onDelete={(ref) => handleDelete(ref)}
        addButton={
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportGenericData(createValidationReglementExportConfig(validationReglements), "PDF")}>PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportGenericData(createValidationReglementExportConfig(validationReglements), "Excel")}>Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportGenericData(createValidationReglementExportConfig(validationReglements), "Word")}>Word</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setAddDialogOpen(true)} className="bg-black text-white hover:bg-black/80">
              Ajouter une validation
            </Button>
          </div>
        }
      />

      {addDialogOpen && (
        <AddValidationReglementDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSubmit={handleAdd}
        />
      )}

      {selected && updateDialogOpen && (
        <UpdateValidationReglementDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          validation={selected}
          onSubmit={handleUpdate}
        />
      )}

      {selected && viewDialogOpen && (
        <ViewValidationReglementDialog
          reference={selected.Reference}
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
        />
      )}
    </>
  );
}
