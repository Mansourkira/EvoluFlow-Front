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

import { ObjetReclamation } from "@/schemas/objetReclamationSchema";
import { useObjetReclamation } from "@/hooks/useObjetReclamation";
        import { AddObjetReclamationDialog } from "@/components/object-de-reclamation/AddObjetReclamationDialog";
import { UpdateObjetReclamationDialog } from "@/components/object-de-reclamation/UpdateObjetReclamationDialog";
import { ViewObjetReclamationDialog } from "@/components/object-de-reclamation/ViewObjetReclamationDialog";

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

export default function ObjectDeReclamationPage() {
        const { objetReclamations, isLoading, fetchObjetReclamations, deleteObjetReclamation } = useObjetReclamation();
  
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
  const [selectedObjetReclamation, setSelectedObjetReclamation] = useState<ObjetReclamation | null>(null);


  // Fetch data only on mount
  useEffect(() => {
    fetchObjetReclamations();
  }, []); // Empty dependency array since refetch is now memoized

  // Filtering and sorting logic
  const filteredAndSortedObjectDeReclamations = objetReclamations
    .filter((objetReclamation: ObjetReclamation) => {
      const matchesSearch = !searchTerm || 
        objetReclamation.Reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (objetReclamation.Libelle && objetReclamation.Libelle.toLowerCase().includes(searchTerm.toLowerCase())) ||
          formatCreationDate(objetReclamation.Heure).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
        (!fieldFilters.Reference || objetReclamation.Reference.toLowerCase().includes(fieldFilters.Reference.toLowerCase())) &&
        (!fieldFilters.Libelle || (objetReclamation.Libelle && objetReclamation.Libelle.toLowerCase().includes(fieldFilters.Libelle.toLowerCase()))) &&
        (!fieldFilters.Heure || formatCreationDate(objetReclamation.Heure).toLowerCase().includes(fieldFilters.Heure.toLowerCase()));

      return matchesSearch && matchesFilters;
    })
    .sort((a: ObjetReclamation, b: ObjetReclamation) => {
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
    const totalPages = Math.ceil(filteredAndSortedObjectDeReclamations.length / itemsPerPage);
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
        setSelectedSituations(filteredAndSortedObjectDeReclamations.map((s: ObjetReclamation) => s.Reference));
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

  const handleViewClick = (objetReclamation: ObjetReclamation) => {
    setSelectedObjetReclamation(objetReclamation);
    setViewDialogOpen(true);
  };

  const handleEditClick = (objetReclamation: ObjetReclamation) => {
    setSelectedObjetReclamation(objetReclamation);
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = async (reference: string): Promise<void> => {
    try {
      await deleteObjetReclamation(reference);
      toast.success("Objet de réclamation supprimé avec succès");
      clearSelection();
      fetchObjetReclamations();
    } catch (error) {
      console.error('Error deleting objet de reclamation:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression de l'objet de réclamation");
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
          objetReclamations.filter((s: ObjetReclamation) => selectedSituations.includes(s.Reference)) : 
        objetReclamations
      
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
        data={objetReclamations}
        isLoading={isLoading}
        title="Objets de Réclamation"
        entityName="Objet de Réclamation"
        description="Gérez et suivez vos objets de réclamation efficacement"
        entityNamePlural="Objets de Réclamation"
        idField="Reference"
        onView={handleViewClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onExport={handleExport}
        addButton={
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un Objet de Réclamation
          </Button>
        }
        columns={[
          {
            key: 'Reference',
            label: 'Référence',
            sortable: true,
            filterable: true,
            render: (objetReclamation: ObjetReclamation) => (
              <span className="font-mono text-sm font-medium">{objetReclamation.Reference}</span>
            )
          },
          {
            key: 'Libelle',
            label: 'Libellé',
            sortable: true,
            filterable: true,
            render: (objetReclamation: ObjetReclamation) => (
              <span className="font-medium">{objetReclamation.Libelle}</span>
            )
          },
          {   
            key: 'Heure',
            label: 'Date de création',
            sortable: true,
            filterable: true,
            render: (objetReclamation: ObjetReclamation) => (
              <div className="flex items-center gap-2">
                <span>{formatCreationDate(objetReclamation.Heure)}</span>
              </div>
            )
          }
        ]}
      />

      {/* Add Dialog */}
      <AddObjetReclamationDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
                onSuccess={fetchObjetReclamations}
      />

      {/* Update Dialog */}
      {selectedObjetReclamation && (
            <UpdateObjetReclamationDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
            objetReclamation={selectedObjetReclamation}
          onSuccess={() => {
            fetchObjetReclamations();
            setUpdateDialogOpen(false);
            setSelectedObjetReclamation(null);
          }}
        />
      )}

      {/* View Dialog */}
      {selectedObjetReclamation && (
        <ViewObjetReclamationDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          objetReclamation={selectedObjetReclamation}
        />
      )}


    </div>
  );
} 