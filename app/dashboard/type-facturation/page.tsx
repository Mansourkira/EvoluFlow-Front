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

type SortField = 'Reference' | 'Libelle' | 'Sous_Traitance' | 'Heure';
type SortDirection = 'asc' | 'desc' | null;

interface FieldFilters {
  Reference: string;
  Libelle: string;
  Sous_Traitance: string;
  Heure: string;
}

interface ColumnVisibility {
  Reference: boolean;
  Libelle: boolean;
  Sous_Traitance: boolean;
  Heure: boolean;
}

export default function TypeFacturationPage() {
  const { typeFacturations, isLoading, fetchTypeFacturations, deleteTypeFacturation } = useTypeFacturation();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFacturations, setSelectedTypeFacturations] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('Reference');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [fieldFilters, setFieldFilters] = useState<FieldFilters>({
    Reference: "",
    Libelle: "",
    Sous_Traitance: "tous",
    Heure: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    Reference: true,
    Libelle: true,
    Sous_Traitance: true,
    Heure: true,
  });

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTypeFacturation, setSelectedTypeFacturation] = useState<TypeFacturation | null>(null);


  useEffect(() => {
    fetchTypeFacturations();
  }, [fetchTypeFacturations]);

  // Filtering and sorting logic
  const filteredAndSortedTypeFacturations = typeFacturations
    .filter(typeFacturation => {
      const matchesSearch = !searchTerm || 
        typeFacturation.Reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeFacturation.Libelle && typeFacturation.Libelle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        getSousTraitanceLabel(typeFacturation.Sous_Traitance).toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatCreationDate(typeFacturation.Heure).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
        (!fieldFilters.Reference || typeFacturation.Reference.toLowerCase().includes(fieldFilters.Reference.toLowerCase())) &&
        (!fieldFilters.Libelle || (typeFacturation.Libelle && typeFacturation.Libelle.toLowerCase().includes(fieldFilters.Libelle.toLowerCase()))) &&
        (fieldFilters.Sous_Traitance === "tous" || getSousTraitanceLabel(typeFacturation.Sous_Traitance).toLowerCase().includes(fieldFilters.Sous_Traitance.toLowerCase())) &&
        (!fieldFilters.Heure || formatCreationDate(typeFacturation.Heure).toLowerCase().includes(fieldFilters.Heure.toLowerCase()));

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (!sortDirection) return 0;
      
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'Sous_Traitance') {
        aValue = getSousTraitanceLabel(aValue);
        bValue = getSousTraitanceLabel(bValue);
      } else if (sortField === 'Heure') {
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
  const totalPages = Math.ceil(filteredAndSortedTypeFacturations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTypeFacturations = filteredAndSortedTypeFacturations.slice(startIndex, endIndex);

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
      setSelectedTypeFacturations(paginatedTypeFacturations.map(tf => tf.Reference));
    } else {
      setSelectedTypeFacturations([]);
    }
  };

  const handleSelectTypeFacturation = (reference: string, checked: boolean) => {
    if (checked) {
      setSelectedTypeFacturations(prev => [...prev, reference]);
    } else {
      setSelectedTypeFacturations(prev => prev.filter(ref => ref !== reference));
    }
  };

  const clearSelection = () => {
    setSelectedTypeFacturations([]);
  };

  const handleViewClick = (typeFacturation: TypeFacturation) => {
    setSelectedTypeFacturation(typeFacturation);
    setViewDialogOpen(true);
  };

  const handleEditClick = (typeFacturation: TypeFacturation) => {
    setSelectedTypeFacturation(typeFacturation);
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = async (reference: string): Promise<void> => {
    try {
      const success = await deleteTypeFacturation(reference);
      if (success) {
        toast.success("Type de facturation supprimé avec succès");
        clearSelection();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du type de facturation");
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
      Sous_Traitance: "tous",
      Heure: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    const filters = Object.entries(fieldFilters).filter(([key, value]) => {
      if (key === 'Sous_Traitance') return value !== 'tous' && value !== '';
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
      const { exportGenericData, createTypeFacturationExportConfig } = await import('@/lib/exportUtils')
      const dataToExport = selectedOnly ? 
        typeFacturations.filter(type => selectedTypeFacturations.includes(type.Reference)) : 
        typeFacturations
      
      const config = createTypeFacturationExportConfig(dataToExport)
      await exportGenericData(config, format as 'PDF' | 'Excel' | 'Word')
      toast.success(`📄 Export réussi - ${dataToExport.length} type(s) de facturation exporté(s) en ${format}`)
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error(`❌ Erreur d'export - ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <GenericDataTable
        data={typeFacturations}
        isLoading={isLoading}
        title="Types de Facturation"
        description="Gérez les types de facturation"
        entityName="Type de Facturation"
        entityNamePlural="Types de Facturation"
        idField="Reference"
        onView={handleViewClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onExport={handleExport}
        addButton={
          <Button onClick={() => setAddDialogOpen(true)} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter Type de Facturation 
          </Button>
        }
        columns={[
          {
            key: 'Reference',
            label: 'Référence',
            sortable: true,
            filterable: true,
            render: (typeFacturation: TypeFacturation) => (
              <span className="font-mono text-sm font-medium">{typeFacturation.Reference}</span>
            )
          },
          {
            key: 'Libelle',
            label: 'Libellé',
            sortable: true,
            filterable: true,
            render: (typeFacturation: TypeFacturation) => (
              <span className="font-medium">{typeFacturation.Libelle}</span>
            )
          },
          {
            key: 'Sous_Traitance',
            label: 'Sous-traitance',
            sortable: true,
            filterable: true,
            render: (typeFacturation: TypeFacturation) => (
              <Badge variant="outline" className={getSousTraitanceColor(typeFacturation.Sous_Traitance)}>
                {getSousTraitanceLabel(typeFacturation.Sous_Traitance)}
              </Badge>
            )
          },
          {
            key: 'Heure',
            label: 'Date de création',
            sortable: true,
            filterable: true,
            render: (typeFacturation: TypeFacturation) => (
              <div className="flex items-center gap-2">
                <span>{formatCreationDate(typeFacturation.Heure)}</span>
              </div>
            )
          }
        ]}
      />

      {/* Add Dialog */}
      <AddTypeFacturationDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={() => {
          fetchTypeFacturations();
          setAddDialogOpen(false);
        }}
      />

      {/* Update Dialog */}
      {selectedTypeFacturation && (
        <UpdateTypeFacturationDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          typeFacturation={selectedTypeFacturation}
          onSuccess={() => {
            fetchTypeFacturations();
            setUpdateDialogOpen(false);
            setSelectedTypeFacturation(null);
          }}
        />
      )}

      {/* View Dialog */}
      {selectedTypeFacturation && (
        <ViewTypeFacturationDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          typeFacturation={selectedTypeFacturation}
        />
      )}


    </div>
  );
} 