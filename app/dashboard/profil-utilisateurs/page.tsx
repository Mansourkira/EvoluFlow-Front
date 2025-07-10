"use client";

import { useEffect, useState } from "react";
import { useProfilUtilisateurs } from "@/hooks/useProfilUtilisateurs";
import {
  ProfilUtilisateur,
  AddProfilUtilisateurFormData,
} from "@/schemas/profilUtilisateurSchema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import AddProfilUtilisateurDialog from "@/components/profil-utilisateur/AddProfilUtilisateurDialog";
import UpdateProfilUtilisateurDialog from "@/components/profil-utilisateur/UpdateProfilUtilisateurDialog";
import ViewProfilUtilisateurDialog from "@/components/profil-utilisateur/ViewProfilUtilisateurDialog";
import {
  createProfilUtilisateurExportConfig,
  exportGenericData,
} from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

export default function ProfilUtilisateursPage() {
  const {
    profils,
    fetchProfils,
    addProfil,
    updateProfil,
    deleteProfil,
  } = useProfilUtilisateurs();

  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selected, setSelected] = useState<ProfilUtilisateur | null>(null);

  useEffect(() => {
    fetchProfils();
  }, []);

  const handleAdd = async (data: AddProfilUtilisateurFormData) => {
    const ok = await addProfil(data);
    if (ok) {
      toast.success("Profil ajouté");
      fetchProfils();
      setAddOpen(false);
    } else {
      toast.error("Erreur ajout");
    }
  };

  const handleUpdate = async (data: ProfilUtilisateur) => {
    const ok = await updateProfil(data);
    if (ok) {
      toast.success("Profil mis à jour");
      fetchProfils();
      setUpdateOpen(false);
    } else {
      toast.error("Erreur modification");
    }
  };

  const handleDelete = async (ref: string) => {
    const ok = await deleteProfil(ref);
    if (ok) {
      toast.success("Profil supprimé");
      fetchProfils();
    } else {
      toast.error("Erreur suppression");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    { key: "Couleur_Badge", label: "Couleur Badge" },
  ];

  return (
    <>
      <GenericDataTable
        data={profils}
        isLoading={false}
        onRefresh={fetchProfils}
        title="Profils Utilisateurs"
        description="Gérez les profils disponibles"
        entityName="profil-utilisateur"
        entityNamePlural="profils-utilisateurs"
        columns={columns}
        idField="Reference"
        onView={(p) => {
          setSelected(p);
          setViewOpen(true);
        }}
        onEdit={(p) => {
          setSelected(p);
          setUpdateOpen(true);
        }}
        onDelete={handleDelete}
        addButton={
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 w-4 h-4" /> Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createProfilUtilisateurExportConfig(profils),
                      "PDF"
                    )
                  }
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createProfilUtilisateurExportConfig(profils),
                      "Excel"
                    )
                  }
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createProfilUtilisateurExportConfig(profils),
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
              Ajouter un profil
            </Button>
          </div>
        }
      />

      {/* Add */}
      <AddProfilUtilisateurDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        existingRefs={profils.map((p) => p.Reference)}
      />

      {/* View */}
      {selected && (
        <ViewProfilUtilisateurDialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          reference={selected.Reference}
        />
      )}

      {/* Update */}
      {selected && (
        <UpdateProfilUtilisateurDialog
          open={updateOpen}
          onOpenChange={setUpdateOpen}
          profil={selected}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
}
