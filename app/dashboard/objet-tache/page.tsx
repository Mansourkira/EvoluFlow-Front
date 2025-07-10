// app/dashboard/objet-tache/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useObjetTaches } from "@/hooks/useObjetTaches";
import { ObjetTache } from "@/schemas/objetTacheSchema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import AddObjetTacheDialog    from "@/components/objetTache/AddObjetTacheDialog";
import UpdateObjetTacheDialog from "@/components/objetTache/UpdateObjetTacheDialog";
import ViewObjetTacheDialog   from "@/components/objetTache/ViewObjetTacheDialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { exportGenericData, createObjetTacheExportConfig } from "@/lib/exportUtils";

export default function ObjetTachePage() {
  const {
    objets,
    fetchObjets,
    addObjet,
    updateObjet,
    deleteObjet
  } = useObjetTaches();

  const [addOpen,  setAddOpen]    = useState(false);
  const [viewOpen, setViewOpen]   = useState(false);
  const [updOpen,  setUpdOpen]    = useState(false);
  const [selObjet, setSelObjet]   = useState<ObjetTache | null>(null);

  useEffect(() => {
    fetchObjets();
  }, [fetchObjets]);

  const cols = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle",    label: "Libellé" },
    { key: "Utilisateur",label: "Utilisateur" },
    {
      key: "Heure",
      label: "Date de création",
      formatter: (v: string) => v ? new Date(v).toLocaleDateString("fr-FR") : '-'
    },
  ];

  return (
    <>
      <GenericDataTable
        data={objets}
        isLoading={false}
        onRefresh={fetchObjets}
        title="Gestion des Objets de Tâche"
        description="Ajoutez, modifiez ou supprimez des objets de tâche"
        entityName="objet-tache"
        entityNamePlural="objets de tâche"
        columns={cols}
        idField="Reference"
        onView={(o) => { setSelObjet(o); setViewOpen(true); }}
        onEdit={(o) => { setSelObjet(o); setUpdOpen(true); }}
        onDelete={async (ref) => {
          if (await deleteObjet(ref)) {
            toast.success("Objet de tâche supprimé");
            fetchObjets();
          } else {
            toast.error("Erreur lors de la suppression");
          }
        }}
        addButton={
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4"/> Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["PDF","Excel","Word"].map(fmt => (
                  <DropdownMenuItem key={fmt} onClick={() => exportGenericData(createObjetTacheExportConfig(objets), fmt as any)}>
                    {fmt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-black text-white" onClick={() => setAddOpen(true)}>
              Ajouter un objet
            </Button>
          </div>
        }
      />

      <AddObjetTacheDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={async (data) => {
          if (await addObjet(data)) {
            toast.success("Objet ajouté");
            fetchObjets();
            setAddOpen(false);
          } else {
            toast.error("Erreur lors de l'ajout");
          }
        }}
      />

      {selObjet && (
        <ViewObjetTacheDialog
          reference={selObjet.Reference}
          open={viewOpen}
          onClose={() => setViewOpen(false)}
        />
      )}

      {selObjet && (
        <UpdateObjetTacheDialog
          open={updOpen}
          objet={selObjet}
          onOpenChange={(o) => !o && setUpdOpen(false)}
          onSubmit={async (data) => {
            if (await updateObjet(data)) {
              toast.success("Objet mis à jour");
              fetchObjets();
              setUpdOpen(false);
            } else {
              toast.error("Erreur lors de la mise à jour");
            }
          }}
        />
      )}
    </>
  );
}
