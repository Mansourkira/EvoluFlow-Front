// app/dashboard/urgence-tache/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUrgenceTaches } from "@/hooks/useUrgenceTaches";
import { UrgenceTache } from "@/schemas/urgenceTacheSchema";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddUrgenceTacheDialog    from "@/components/urgenceTache/AddUrgenceTacheDialog";
import UpdateUrgenceTacheDialog from "@/components/urgenceTache/UpdateUrgenceTacheDialog";
import ViewUrgenceTacheDialog   from "@/components/urgenceTache/ViewUrgenceTacheDialog";
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { exportGenericData, createUrgenceTacheExportConfig } from "@/lib/exportUtils";

export default function UrgenceTachePage() {
  const {
    urgences, fetchUrgences, addUrgence,
    updateUrgence, deleteUrgence
  } = useUrgenceTaches();

  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [updOpen, setUpdOpen]   = useState(false);
  const [sel, setSel]           = useState<UrgenceTache|null>(null);

  useEffect(() => {
    fetchUrgences();
  }, [fetchUrgences]);

  const cols = [
    { key: "Reference", label: "Référence" },
    { key: "Libelle",    label: "Libellé" },
    { key: "Utilisateur",label: "Utilisateur" },
    {
      key: "Heure",
      label: "Date",
      formatter: (v:string)=> v ? new Date(v).toLocaleDateString("fr-FR") : '-'
    }
  ];

  return (
    <>
      <GenericDataTable
        data={urgences}
        isLoading={false}
        onRefresh={fetchUrgences}
        title="Gestion des Urgences de Tâche"
        description="Créez, modifiez ou supprimez"
        entityName="urgence-tache"
        entityNamePlural="urgences"
        columns={cols}
        idField="Reference"
        onView={(u)=>{ setSel(u); setViewOpen(true); }}
        onEdit={(u)=>{ setSel(u); setUpdOpen(true); }}
        onDelete={async ref=>{
          if (await deleteUrgence(ref)) {
            toast.success("Urgence supprimée");
            fetchUrgences();
          } else {
            toast.error("Erreur suppression");
          }
        }}
        addButton={
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4"/>Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["PDF","Excel","Word"].map(fmt=>(
                  <DropdownMenuItem key={fmt} onClick={()=>exportGenericData(createUrgenceTacheExportConfig(urgences),fmt as any)}>
                    {fmt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-black text-white" onClick={()=>setAddOpen(true)}>
              Ajouter
            </Button>
          </div>
        }
      />

      <AddUrgenceTacheDialog
        open={addOpen}
        onClose={()=>setAddOpen(false)}
        onSubmit={async data=>{
          if (await addUrgence(data)) {
            toast.success("Ajouté");
            fetchUrgences();
            setAddOpen(false);
          } else {
            toast.error("Erreur ajout");
          }
        }}
      />

      {sel && (
        <ViewUrgenceTacheDialog
          reference={sel.Reference}
          open={viewOpen}
          onClose={()=>setViewOpen(false)}
        />
      )}

      {sel && (
        <UpdateUrgenceTacheDialog
          open={updOpen}
          onOpenChange={(o)=>!o&&setUpdOpen(false)}
          urgence={sel}
          onSubmit={async data=>{
            if (await updateUrgence(data)) {
              toast.success("Mis à jour");
              fetchUrgences();
              setUpdOpen(false);
            } else {
              toast.error("Erreur mise à jour");
            }
          }}
        />
      )}
    </>
  );
}
