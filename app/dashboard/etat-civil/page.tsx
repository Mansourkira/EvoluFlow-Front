"use client";

import { useEffect, useState } from "react";
import { formatCreationDate } from "@/schemas/etatCivilSchema";
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

  RefreshCw,
  Columns,
  Plus,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";

import { useEtatCivil } from "@/hooks/use-etat-civil";
import { EtatCivil } from "@/schemas/etatCivilSchema";
import { AddEtatCivilDialog } from "@/components/etat-civil/AddEtatCivilDialog";
import { UpdateEtatCivilDialog } from "@/components/etat-civil/UpdateEtatCivilDialog";
import { ViewEtatCivilDialog } from "@/components/etat-civil/ViewEtatCivilDialog";

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

export default function EtatCivilPage () {
        const { etatCivils, isLoading, fetchEtatCivils, deleteEtatCivil } = useEtatCivil();
  
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
    const [selectedEtatCivil, setSelectedEtatCivil] = useState<EtatCivil | null>(null);


  // Fetch data only on mount
  useEffect(() => {
    fetchEtatCivils();
  }, []); // Empty dependency array since refetch is now memoized

  // Filtering and sorting logic
  const filteredAndSortedEtatCivils = etatCivils
    .filter((etatCivil: EtatCivil) => {
      const matchesSearch = !searchTerm || 
        etatCivil.Reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (etatCivil.Libelle && etatCivil.Libelle.toLowerCase().includes(searchTerm.toLowerCase())) ||
          formatCreationDate(etatCivil.Heure).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
            (!fieldFilters.Reference || etatCivil.Reference.toLowerCase().includes(fieldFilters.Reference.toLowerCase())) &&
        (!fieldFilters.Libelle || (etatCivil.Libelle && etatCivil.Libelle.toLowerCase().includes(fieldFilters.Libelle.toLowerCase()))) &&
        (!fieldFilters.Heure || formatCreationDate(etatCivil.Heure).toLowerCase().includes(fieldFilters.Heure.toLowerCase()));

      return matchesSearch && matchesFilters;
    })
    .sort((a: EtatCivil, b: EtatCivil) => {
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
    const totalPages = Math.ceil(filteredAndSortedEtatCivils.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

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
        setSelectedSituations(filteredAndSortedEtatCivils.map((s: EtatCivil) => s.Reference));
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

  const handleViewClick = (etatCivil: EtatCivil) => {
    setSelectedEtatCivil(etatCivil);
    setViewDialogOpen(true);
  };

  const handleEditClick = (etatCivil: EtatCivil) => {
    setSelectedEtatCivil(etatCivil);
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = async (reference: string): Promise<void> => {
    try {
      await deleteEtatCivil(reference);
      toast.success("Etat civil supprimé avec succès");
      clearSelection();
      fetchEtatCivils();
    } catch (error) {
        console.error('Error deleting etat civil:', error);
        toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression de l'état civil");
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
      const { exportGenericData, createEtatCivilExportConfig } = await import('@/lib/exportUtils')
      const dataToExport = selectedOnly ? 
          etatCivils.filter((s: EtatCivil) => selectedSituations.includes(s.Reference)) : 
        etatCivils
      
        const config = createEtatCivilExportConfig(dataToExport)
      await exportGenericData(config, format as 'PDF' | 'Excel' | 'Word')
      toast.success(`📄 Export réussi - ${dataToExport.length} état civil(s) exporté(s) en ${format}`)
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error(`❌ Erreur d'export - ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <GenericDataTable
        data={etatCivils}
        isLoading={isLoading}
        title="Etat Civil"
        entityName="Etat Civil"
        description="Gérez et suivez vos état civils efficacement"
        entityNamePlural="Etat Civil"
        idField="Reference"
        onView={handleViewClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onExport={handleExport}
        addButton={
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un Etat Civil
          </Button>
        }
        columns={[
          {
            key: 'Reference',
            label: 'Référence',
            sortable: true,
            filterable: true,
            render: (etatCivil: EtatCivil) => (
              <span className="font-mono text-sm font-medium">{etatCivil.Reference}</span>
            )
          },
          {
            key: 'Libelle',
            label: 'Libellé',
            sortable: true,
            filterable: true,
            render: (etatCivil: EtatCivil) => (
              <span className="font-medium">{etatCivil.Libelle}</span>
            )
          },
          {   
            key: 'Heure',
            label: 'Date de création',
            sortable: true,
            filterable: true,
              render: (etatCivil: EtatCivil) => (
                <span>{formatCreationDate(etatCivil.Heure)}</span>
            )
          }
        ]}
      />

      {/* Add Dialog */}
      <AddEtatCivilDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
                onSuccess={fetchEtatCivils}
      />

      {/* Update Dialog */}
      {selectedEtatCivil && (
            <UpdateEtatCivilDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
              etatCivil={selectedEtatCivil}
          onSuccess={() => {
            fetchEtatCivils();
            setUpdateDialogOpen(false);
            setSelectedEtatCivil(null);
          }}
        />
      )}

      {/* View Dialog */}
      {selectedEtatCivil && (
        <ViewEtatCivilDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
            etatCivil={selectedEtatCivil}
        />
      )}


    </div>
  );
} 