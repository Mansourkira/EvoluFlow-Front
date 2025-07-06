'use client';

import { useEffect, useState } from 'react';
import { useNiveauxCour } from '@/hooks/useNiveauxCour';
import { NiveauCour } from '@/schemas/niveauCourSchema';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GenericDataTable } from '@/components/ui/GenericDataTable';
import AddNiveauCourDialog from '@/components/niveaux-cours/AddNiveauCourDialog';
import UpdateNiveauCourDialog from '@/components/niveaux-cours/UpdateNiveauCourDialog';
import ViewNiveauCourDialog from '@/components/niveaux-cours/ViewNiveauCourDialog';
import { createNiveauCourExportConfig, exportGenericData } from '@/lib/exportUtils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import UpdateNiveauEtudeDialog from '@/components/niveauxEtude/UpdateNiveauEtudeDialog';

export default function NiveauxCourPage() {
  const { niveaux, fetchNiveaux, addNiveau, updateNiveau, deleteNiveau } = useNiveauxCour();

  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<NiveauCour | null>(null);

  useEffect(() => {
    fetchNiveaux();
  }, []);

  const handleView = (niv: NiveauCour) => {
    setSelected(niv);
    setViewOpen(true);
  };

  const handleEdit = (niv: NiveauCour) => {
    setSelected(niv);
    setEditOpen(true);
  };

  const handleDelete = async (ref: string) => {
    const ok = await deleteNiveau(ref);
    if (ok) {
      toast.success('Niveau supprimé');
      fetchNiveaux();
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAdd = async (data: NiveauCour) => {
    const ok = await addNiveau(data);
    if (ok) {
      toast.success('Niveau ajouté');
      fetchNiveaux();
      setAddOpen(false);
    } else {
      toast.error('Erreur lors de l’ajout');
    }
  };

  const handleUpdate = async (data: NiveauCour) => {
    const ok = await updateNiveau(data);
    if (ok) {
      toast.success('Niveau mis à jour');
      fetchNiveaux();
      setEditOpen(false);
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const columns = [
    { key: 'Reference', label: 'Référence' },
    { key: 'Libelle', label: 'Libellé' },
    { key: 'Nombre_Heure', label: 'Nombre d’heures' },
    { key: 'Utilisateur', label: 'Utilisateur' },
  ];

  return (
    <>
      <GenericDataTable
        data={niveaux}
        isLoading={false}
        onRefresh={fetchNiveaux}
        title="Gestion des niveaux de cours"
        description="Ajoutez, modifiez ou supprimez des niveaux de cours"
        entityName="niveau de cours"
        entityNamePlural="niveaux de cours"
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
                      createNiveauCourExportConfig(niveaux),
                      'PDF'
                    )
                  }
                >
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createNiveauCourExportConfig(niveaux),
                      'Excel'
                    )
                  }
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    exportGenericData(
                      createNiveauCourExportConfig(niveaux),
                      'Word'
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
              Ajouter un niveau
            </Button>
          </div>
        }
      />

      <AddNiveauCourDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      {selected && viewOpen && (
        <ViewNiveauCourDialog
          reference={selected.Reference}
          open={viewOpen}
          onClose={() => setViewOpen(false)}
        />
      )}

      {selected && editOpen && (
  <UpdateNiveauEtudeDialog
    niveau={selected}                  // ✅ passe l'objet complet
    open={editOpen}
    onOpenChange={setEditOpen}
    onSubmit={handleUpdate}
  />
)}

    </>
  );
}
