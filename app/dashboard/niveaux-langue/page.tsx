// app/dashboard/niveaux-langue/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useNiveauxLangue } from "@/hooks/useNiveauxLangue";
import { NiveauLangue } from "@/schemas/niveauLangueSchema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import AddNiveauLangueDialog from "@/components/niveaux-langue/AddNiveauLangueDialog";
import UpdateNiveauLangueDialog from "@/components/niveaux-langue/UpdateNiveauLangueDialog";
import ViewNiveauLangueDialog from "@/components/niveaux-langue/ViewNiveauLangueDialog";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { exportGenericData, createNiveauLangueExportConfig } from "@/lib/exportUtils";

export default function NiveauxLanguePage() {
  const {
    niveaux,
    fetchNiveaux,
    addNiveau,
    updateNiveau,
    deleteNiveau,
  } = useNiveauxLangue();

  const [addOpen, setAddOpen] = useState(false);
  const [updOpen, setUpdOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [sel, setSel] = useState<NiveauLangue | null>(null);

  useEffect(() => {
    fetchNiveaux();
  }, []);

  const handleAdd = async (data: NiveauLangue) => {
    const ok = await addNiveau(data);
    if (ok) {
      toast.success("Niveau ajouté");
      setAddOpen(false);
    } else {
      toast.error("Erreur ajout");
    }
  };

  const handleUpdate = async (data: NiveauLangue) => {
    const ok = await updateNiveau(data);
    if (ok) {
      toast.success("Niveau mis à jour");
      setUpdOpen(false);
    } else {
      toast.error("Erreur mise à jour");
    }
  };

  const handleDelete = async (ref: string) => {
    const ok = await deleteNiveau(ref);
    if (ok) {
      toast.success("Niveau supprimé");
    } else {
      toast.error("Erreur suppression");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle", label: "Libellé" },
    { key: "Utilisateur", label: "Utilisateur" },
    {
      key: "Heure",
      label: "Créé le",
      formatter: (v: string) => (v ? new Date(v).toLocaleDateString("fr-FR") : "-"),
    },
  ];

  return (
    <>
      <GenericDataTable
        data={niveaux}
        isLoading={false}
        onRefresh={fetchNiveaux}
        title="Gestion des niveaux de langue"
        description="Ajoutez, modifiez ou supprimez"
        entityName="niveau-langue"
        entityNamePlural="niveaux-langue"
        columns={columns}
        idField="Reference"
        onView={(row) => { setSel(row); setViewOpen(true); }}
        onEdit={(row) => { setSel(row); setUpdOpen(true); }}
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
                <DropdownMenuItem onClick={() => exportGenericData(createNiveauLangueExportConfig(niveaux), "PDF")}>
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportGenericData(createNiveauLangueExportConfig(niveaux), "Excel")}>
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportGenericData(createNiveauLangueExportConfig(niveaux), "Word")}>
                  Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setAddOpen(true)} className="bg-black text-white">Ajouter</Button>
          </div>
        }
      />

      <AddNiveauLangueDialog open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />

      {sel && (
        <ViewNiveauLangueDialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          reference={sel.Reference}
        />
      )}

      {sel && (
        <UpdateNiveauLangueDialog
          open={updOpen}
          onOpenChange={(o) => !o && setUpdOpen(false)}
          niveau={sel}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
}
