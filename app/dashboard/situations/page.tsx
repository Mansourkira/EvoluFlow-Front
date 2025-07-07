"use client";

import { useEffect, useState } from "react";
import { useTypeFacturation } from "@/hooks/useTypeFacturation";
import { TypeFacturation, getSousTraitanceLabel, getSousTraitanceColor, formatCreationDate } from "@/schemas/typeFacturationSchema";
import { AddTypeFacturationDialog } from "@/components/type-facturation/AddTypeFacturationDialog";
import { UpdateTypeFacturationDialog } from "@/components/type-facturation/UpdateTypeFacturationDialog";
import { ViewTypeFacturationDialog } from "@/components/type-facturation/ViewTypeFacturationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  CreditCard,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Filter,
  X,
  Loader2,
  RefreshCw,
  Columns,
  Plus,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import { useSituations } from "@/hooks/useSituations";
import { AddSituationDialog } from "@/components/situations/AddSituationDialog";
import { UpdateSituationDialog } from "@/components/situations/UpdateSituationDialog";
import { ViewSituationDialog } from "@/components/situations/ViewSituationDialog";
import { Situation } from "@/schemas/situationSchema";

type SortField = 'Reference' | 'Libelle' | 'Heure';
type SortDirection = 'asc' | 'desc' | null;

interface FieldFilters {
  Reference: string;
  Libelle: string;
  Heure: string;
}

interface ColumnVisibility {
  Reference: boolean;
  Libelle: boolean;
  Heure: boolean;
}

export default function SituationsPage() {
  const { situations, isLoading, refetch, deleteSituation } = useSituations();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSituations, setSelectedSituations] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('Reference');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [fieldFilters, setFieldFilters] = useState<FieldFilters>({
    Reference: "",
    Libelle: "",
    Heure: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    Reference: true,
    Libelle: true,  
    Heure: true,
  });

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [situationToDelete, setSituationToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data only on mount
  useEffect(() => {
    refetch();
  }, []); // Empty dependency array since refetch is now memoized

  // Filtering and sorting logic
  const filteredAndSortedSituations = situations
    .filter(situation => {
      const matchesSearch = !searchTerm || 
        situation.Reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (situation.Libelle && situation.Libelle.toLowerCase().includes(searchTerm.toLowerCase())) ||
          formatCreationDate(situation.Heure).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
        (!fieldFilters.Reference || situation.Reference.toLowerCase().includes(fieldFilters.Reference.toLowerCase())) &&
        (!fieldFilters.Libelle || (situation.Libelle && situation.Libelle.toLowerCase().includes(fieldFilters.Libelle.toLowerCase()))) &&
        (!fieldFilters.Heure || formatCreationDate(situation.Heure).toLowerCase().includes(fieldFilters.Heure.toLowerCase()));

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (!sortDirection) return 0;
      
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'Heure') {
        // Sort by date - convert to Date objects for proper date sorting
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      
      // For date fields (Heure), use numeric comparison
      if (sortField === 'Heure') {
        if (sortDirection === 'asc') {
          return (aValue as number) - (bValue as number);
        } else {
          return (bValue as number) - (aValue as number);
        }
      }
      
      // For text fields, use string comparison
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSituations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSituations = filteredAndSortedSituations.slice(startIndex, endIndex);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    if (sortDirection === 'asc') return <ChevronUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ChevronDown className="h-4 w-4" />;
    return null;
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSituations(paginatedSituations.map(s => s.Reference));
    } else {
      setSelectedSituations([]);
    }
  };

  const handleSelectTypeFacturation = (reference: string, checked: boolean) => {
    if (checked) {
        setSelectedSituations(prev => [...prev, reference]);
    } else {
      setSelectedSituations(prev => prev.filter(ref => ref !== reference));
    }
  };

  const clearSelection = () => {
    setSelectedSituations([]);
  };

  const handleViewClick = (situation: Situation) => {
    setSelectedSituation(situation);
    setViewDialogOpen(true);
  };

  const handleEditClick = (situation: Situation) => {
    setSelectedSituation(situation);
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = async (reference: string): Promise<void> => {
    setSituationToDelete(reference);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!situationToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteSituation(situationToDelete);
      if (success) {
        toast.success("Situation supprimée avec succès");
        clearSelection();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de la situation");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSituationToDelete("");
    }
  };

  const updateFieldFilter = (field: keyof FieldFilters, value: string) => {
    setFieldFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFieldFilters({
      Reference: "",
      Libelle: "",
      Heure: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    const filters = Object.entries(fieldFilters).filter(([key, value]) => {
      return Boolean(value);
    });
    return filters.length + (searchTerm ? 1 : 0);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = async (format: string, selectedOnly = false) => {
    try {
      const { exportGenericData, createSituationExportConfig } = await import('@/lib/exportUtils')
      const dataToExport = selectedOnly ? 
          situations.filter(s => selectedSituations.includes(s.Reference)) : 
        situations
      
      const config = createSituationExportConfig(dataToExport)
      await exportGenericData(config, format as 'PDF' | 'Excel' | 'Word')
      toast.success(`📄 Export réussi - ${dataToExport.length} situation(s) exporté(s) en ${format}`)
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error(`❌ Erreur d'export - ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <GenericDataTable
        data={situations}
        isLoading={isLoading}
        title="Situations"
        entityName="Situation"
        description="Gérez et suivez vos situations efficacement"
        entityNamePlural="Situations"
        idField="Reference"
        onView={handleViewClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onExport={handleExport}
        selectedItems={selectedSituations}
        onSelectedItemsChange={setSelectedSituations}
        addButton={
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter Situation 
          </Button>
        }
        columns={[
          {
            key: 'Reference',
            label: 'Référence',
            sortable: true,
            filterable: true,
            render: (situation: Situation) => (
              <span className="font-mono text-sm font-medium">{situation.Reference}</span>
            )
          },
          {
            key: 'Libelle',
            label: 'Libellé',
            sortable: true,
            filterable: true,
            render: (situation: Situation) => (
              <span className="font-medium">{situation.Libelle}</span>
            )
          },
          {   
            key: 'Heure',
            label: 'Date de création',
            sortable: true,
            filterable: true,
              render: (situation: Situation) => (
              <div className="flex items-center gap-2">
                <span>{formatCreationDate(situation.Heure)}</span>
              </div>
            )
          }
        ]}
      />

      {/* Add Dialog */}
      <AddSituationDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSituationAdded={refetch}
      />

      {/* Update Dialog */}
      {selectedSituation && (
        <UpdateSituationDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          situation={selectedSituation}
          onSuccess={() => {
            refetch();
            setUpdateDialogOpen(false);
            setSelectedSituation(null);
          }}
        />
      )}

      {/* View Dialog */}
      {selectedSituation && (
        <ViewSituationDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          situation={selectedSituation}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera définitivement cette situation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 