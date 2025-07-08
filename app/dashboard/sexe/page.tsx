// app/dashboard/sexe/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSexes } from "@/hooks/useSexes";
import { Sexe } from "@/schemas/sexeSchema";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddSexeDialog from "@/components/sexes/AddSexeDialog";
import UpdateSexeDialog from "@/components/sexes/UpdateSexeDialog";
import ViewSexeDialog from "@/components/sexes/ViewSexeDialog";
import { Download } from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { exportGenericData, createNiveauLangueExportConfig } from "@/lib/exportUtils";
import { createNiveauLangueExportConfig as createSexeExportConfig } from "@/lib/exportUtils";

export default function SexePage() {
  const { sexes, fetchSexes, addSexe, updateSexe, deleteSexe } = useSexes();
  const [addOpen, setAddOpen] = useState(false);
  const [updOpen, setUpdOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<Sexe | null>(null);

  useEffect(() => {
    fetchSexes();
  }, []);

  const handleAdd = async (data: Sexe) => {
    if (await addSexe(data)) {
      toast.success("Sexe ajouté");
      setAddOpen(false);
    } else {
      toast.error("Erreur ajout");
    }
  };

  const handleUpdate = async (data: Sexe) => {
    if (await updateSexe(data)) {
      toast.success("Sexe mis à jour");
      setUpdOpen(false);
    } else {
      toast.error("Erreur mise à jour");
    }
  };

  const handleDelete = async (ref: string) => {
    if (await deleteSexe(ref)) {
      toast.success("Sexe supprimé");
    } else {
      toast.error("Erreur suppression");
    }
  };

  const columns = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle",   label: "Libellé"   },
    { key: "Utilisateur", label: "Utilisateur" },
  ];

  return (
    <>
      <GenericDataTable
        data={sexes}
        isLoading={false}
        onRefresh={fetchSexes}
        title="Gestion des sexes"
        description="Ajoutez, modifiez ou supprimez un sexe"
        entityName="sexe"
        entityNamePlural="sexes"
        columns={columns}
        idField="Reference"
        onView={row => { setSelected(row); setViewOpen(true); }}
        onEdit={row => { setSelected(row); setUpdOpen(true); }}
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
                  onClick={() => exportGenericData(createSexeExportConfig(sexes), "PDF")}
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportGenericData(createSexeExportConfig(sexes), "Excel")}
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportGenericData(createSexeExportConfig(sexes), "Word")}
                >
                  Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setAddOpen(true)} className="bg-black text-white">
              Ajouter un sexe
            </Button>
          </div>
        }
      />

      <AddSexeDialog open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />

      {selected && (
        <ViewSexeDialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          reference={selected.Reference}
        />
      )}

      {selected && (
        <UpdateSexeDialog
          open={updOpen}
          onOpenChange={o => !o && setUpdOpen(false)}
          sexe={selected}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
}
