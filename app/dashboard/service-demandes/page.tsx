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
  createServiceDemandeExportConfig,
  exportGenericData,
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

  const [addOpen,setAddOpen] = useState(false);
  const [viewOpen,setViewOpen] = useState(false);
  const [editOpen,setEditOpen] = useState(false);
  const [sel,setSel] = useState<ServiceDemande|null>(null);

  useEffect(()=>{ fetchServiceDemandes(); }, []);

  const cols = [
    { key:"Reference", label:"Réf" },
    { key:"Libelle",  label:"Libellé" },
    { key:"Utilisateur", label:"Utilisateur" },
    { key:"Heure", label:"Date création" },
  ];

  return (
    <>
      <GenericDataTable
        data={serviceDemandes}
        isLoading={false}
        onRefresh={fetchServiceDemandes}
        title="Demandes de service"
        description="..."
        entityName="demande"
        entityNamePlural="demandes"
        columns={cols}
        idField="Reference"
        onView={(d)=>{ setSel(d); setViewOpen(true); }}
        onEdit={(d)=>{ setSel(d); setEditOpen(true); }}
        onDelete={async ref=>{
          const ok = await deleteServiceDemande(ref);
          toast[ok?"success":"error"]( ok?"Supprimée":"Erreur" );
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
                {(["PDF","Excel","Word"] as const).map(fmt=>(
                  <DropdownMenuItem key={fmt} onClick={()=>
                    exportGenericData(
                      createServiceDemandeExportConfig(serviceDemandes),
                      fmt
                    )
                  }>{fmt}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={()=>setAddOpen(true)} className="bg-black text-white">
              Nouvelle demande
            </Button>
          </div>
        }
      />

      <AddServiceDemandeDialog
        open={addOpen}
        onClose={()=>setAddOpen(false)}
        onSubmit={async data=>{
          const ok=await addServiceDemande(data);
          toast[ok?"success":"error"]( ok?"Ajouté":"Erreur" );
          if(ok) fetchServiceDemandes();
        }}
      />

      {sel && (
        <ViewServiceDemandeDialog
          open={viewOpen}
          onClose={()=>setViewOpen(false)}
          reference={sel.Reference}       // ← prop attendue
        />
      )}

      {sel && (
        <UpdateServiceDemandeDialog
          open={editOpen}
          onOpenChange={o=>!o&&setEditOpen(false)}
          reference={sel.Reference}       // ← prop attendue
          onSubmit={async data=>{
            const ok=await updateServiceDemande(data);
            toast[ok?"success":"error"]( ok?"Modifié":"Erreur" );
            if(ok) fetchServiceDemandes();
            setEditOpen(false);
          }}
        />
      )}
    </>
  );
}
