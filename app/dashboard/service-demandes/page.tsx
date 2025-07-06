// app/dashboard/service-demandes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useServiceDemandes } from "@/hooks/useServiceDemandes";
import { ServiceDemande } from "@/schemas/serviceDemandeSchema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import AddServiceDemandeDialog from "@/components/service-demandes/AddServiceDemandeDialog";
import ViewServiceDemandeDialog from "@/components/service-demandes/ViewServiceDemandeDialog";
import UpdateServiceDemandeDialog from "@/components/service-demandes/UpdateServiceDemandeDialog";
import {
  exportGenericData,
  createServiceDemandeExportConfig,
} from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

export default function ServiceDemandesPage() {
  const {
    serviceDemandes,
    fetchServiceDemandes,
    addServiceDemande,
    updateServiceDemande,
    deleteServiceDemande,
  } = useServiceDemandes();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState<ServiceDemande | null>(null);

  useEffect(() => {
    fetchServiceDemandes();
  }, [fetchServiceDemandes]);

  const handleView = (demande: ServiceDemande) => {
    setSelectedDemande(demande);
    setViewDialogOpen(true);
  };

  const handleEdit = (demande: ServiceDemande) => {
    setSelectedDemande(demande);
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (ref: string) => {
    const success = await deleteServiceDemande(ref);
    if (success) {
      toast.success("Demande supprimée avec succès");
      fetchServiceDemandes();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAdd = async (data: ServiceDemande) => {
    const success = await addServiceDemande(data);
    if (success) {
      toast.success("Demande ajoutée avec succès");
      fetchServiceDemandes();
      setAddDialogOpen(false);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleUpdate = async (data: ServiceDemande) => {
    const success = await updateServiceDemande(data);
    if (success) {
      toast.success("Demande mise à jour avec succès");
      fetchServiceDemandes();
      setUpdateDialogOpen(false);
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
        data={serviceDemandes}
        isLoading={false}
        onRefresh={fetchServiceDemandes}
        title="Demandes de Service"
        description="Gérez vos demandes de service"
        entityName="demande"
        entityNamePlural="demandes"
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
                      createServiceDemandeExportConfig(serviceDemandes),
                      "PDF"
                    )
                  }
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createServiceDemandeExportConfig(serviceDemandes),
                      "Excel"
                    )
                  }
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createServiceDemandeExportConfig(serviceDemandes),
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
              Ajouter une demande
            </Button>
          </div>
        }
      />

      <AddServiceDemandeDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      {selectedDemande && (
        <ViewServiceDemandeDialog
          reference={selectedDemande.Reference}
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
        />
      )}

      {selectedDemande && (
        <UpdateServiceDemandeDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          demande={selectedDemande}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
}
