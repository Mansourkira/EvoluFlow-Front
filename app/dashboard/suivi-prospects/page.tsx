"use client";

import { useEffect, useState } from "react";
import { formatCreationDate } from "@/schemas/suiviProspectSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GenericDataTable } from "@/components/ui/data-table/GenericDataTable";
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
  Loader2,
  RefreshCw,
  Columns,
  Plus,
  MoreHorizontal,
  PlusCircle,
  Download,
} from "lucide-react";
import { useSuiviProspects } from "@/hooks/useSuiviProspects";
import { SuiviProspect } from "@/schemas/suiviProspectSchema";
import { AddSuiviProspectDialog } from "@/components/suivi-prospects/AddSuiviProspectDialog";
import { UpdateSuiviProspectDialog } from "@/components/suivi-prospects/UpdateSuiviProspectDialog";
import { ViewSuiviProspectDialog } from "@/components/suivi-prospects/ViewSuiviProspectDialog";
import { DataTableConfig } from '@/components/ui/data-table/DataTableConfig';
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

export default function SuiviProspectsPage() {
  const { suiviProspects, isLoading, fetchSuiviProspects, deleteSuiviProspect } = useSuiviProspects();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('Reference');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [fieldFilters, setFieldFilters] = useState<FieldFilters>({
    Reference: "",
    Libelle: "",
    Heure: "",
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    Reference: true,
    Libelle: true,  
    Heure: true,
  });

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSuiviProspect, setSelectedSuiviProspect] = useState<SuiviProspect | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data only on mount
  useEffect(() => {
    fetchSuiviProspects();
  }, []); // Empty dependency array since refetch is now memoized

  // Filtering and sorting logic
  const filteredAndSortedSuiviProspects = suiviProspects
    .filter(suiviProspect => {
      const matchesSearch = !searchTerm || 
        suiviProspect.Reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (suiviProspect.Libelle && suiviProspect.Libelle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        formatCreationDate(suiviProspect.Heure).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
        (!fieldFilters.Reference || suiviProspect.Reference.toLowerCase().includes(fieldFilters.Reference.toLowerCase())) &&
        (!fieldFilters.Libelle || (suiviProspect.Libelle && suiviProspect.Libelle.toLowerCase().includes(fieldFilters.Libelle.toLowerCase()))) &&
        (!fieldFilters.Heure || formatCreationDate(suiviProspect.Heure).toLowerCase().includes(fieldFilters.Heure.toLowerCase()));

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
  const totalPages = Math.ceil(filteredAndSortedSuiviProspects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSuiviProspects = filteredAndSortedSuiviProspects.slice(startIndex, endIndex);

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
    // This function is no longer needed as GenericDataTable manages its own selection
  };

  const handleSelectTypeFacturation = (reference: string, checked: boolean) => {
    // This function is no longer needed as GenericDataTable manages its own selection
  };

  const clearSelection = () => {
    // This function is no longer needed as GenericDataTable manages its own selection
  };

  const handleViewClick = (suiviProspect: SuiviProspect) => {
    setSelectedSuiviProspect(suiviProspect);
    setViewDialogOpen(true);
  };

  const handleEditClick = (suiviProspect: SuiviProspect) => {
    setSelectedSuiviProspect(suiviProspect);
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = async (reference: string): Promise<void> => {
    setIsDeleting(true);
    try {
      const success = await deleteSuiviProspect(reference);
      if (success) {
        toast.success("Suivi prospect supprimé avec succès");
      }
    } catch (error) {
      console.error("Error deleting suivi prospect:", error);
      toast.error("Erreur lors de la suppression du suivi prospect");
    } finally {
      setIsDeleting(false);
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

  const handleExport = async (format: string, data: SuiviProspect[]) => {
    try {
      const { exportGenericData, createProspectExportConfig } = await import('@/lib/exportUtils')
      const config = createProspectExportConfig(data)
      await exportGenericData(config, format as 'PDF' | 'Excel' | 'Word')
      toast.success(`📄 Export réussi - ${data.length} suivi prospect(s) exporté(s) en ${format}`)
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error(`❌ Erreur d'export - ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  const tableConfig: DataTableConfig<SuiviProspect> = {
    data: suiviProspects,
    isLoading,
    title: "Gestion des Suivi Prospects",
    description: "Gérez vos suivi prospects",
    entityName: "Suivi Prospect",
    entityNamePlural: "Suivi Prospects",
    getItemId: (item: SuiviProspect) => item.Reference,
    onDelete: handleDeleteClick,
    enableRefresh: true,
    enableBulkSelect: true,
    enableExport: true,
    enableSearch: true,
    enableAdvancedFilters: true,
    enableColumnToggle: true,
    refetch: fetchSuiviProspects,
    onExport: handleExport,
    columns: [
      {
        key: 'Reference',
        label: 'Référence',
        sortable: true,
        filterable: true,
        searchable: true,
        render: (item) => (
          <span className="font-mono text-sm font-medium">{item.Reference}</span>
        )
      },
      {
        key: 'Libelle',
        label: 'Libellé',
        sortable: true,
        filterable: true,
        searchable: true
      },
      {
        key: 'Relance',
        label: 'Relance',
        sortable: true,
        render: (item) => (
          <Badge variant={item.Relance ? "default" : "secondary"}>
            {item.Relance ? "Oui" : "Non"}
          </Badge>
        )
      },
      {
        key: 'Heure',
        label: 'Date',
        sortable: true,
        render: (item) => formatCreationDate(item.Heure)
      }
    ],
    actions: [
      {
        key: 'view',
        label: 'Voir',
        icon: Eye,
        onClick: handleViewClick
      },
      {
        key: 'edit',
        label: 'Modifier',
        icon: Edit,
        onClick: handleEditClick
      }
    ],
    exportConfig: {
      formats: ['Excel', 'PDF', 'Word']
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
           

           
          </div>

          <Button onClick={() => setAddDialogOpen(true)} size="sm" variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Suivi Prospect
          </Button>
        </div>

        <GenericDataTable
          config={tableConfig}
        />

        {/* Add Dialog */}
        <AddSuiviProspectDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />

        {/* View Dialog */}
        {selectedSuiviProspect && (
          <ViewSuiviProspectDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            suiviProspect={selectedSuiviProspect}
          />
        )}

        {/* Update Dialog */}
        {selectedSuiviProspect && (
          <UpdateSuiviProspectDialog
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
            suiviProspect={selectedSuiviProspect}
          />
        )}
      </div>
    </div>
  );
}
