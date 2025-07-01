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
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  
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
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTypeFacturation, setSelectedTypeFacturation] = useState<TypeFacturation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeFacturationToDelete, setTypeFacturationToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (reference: string) => {
    setTypeFacturationToDelete(reference);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!typeFacturationToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteTypeFacturation(typeFacturationToDelete);
      if (success) {
        toast({
          title: "Succès",
          description: "Type de facturation supprimé avec succès",
        });
        clearSelection();
      }
    } catch (error) {
      toast({
        title: "Erreur", 
        description: "Erreur lors de la suppression du type de facturation",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setTypeFacturationToDelete("");
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

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="h-8 w-8" />
              Types de Facturation
            </h1>
            <p className="text-muted-foreground">
              Gérez les types de facturation du système
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AddTypeFacturationDialog onSuccess={fetchTypeFacturations} />
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTypeFacturations}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par référence, libellé ou sous-traitance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres avancés
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Columns className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {Object.entries(columnVisibility).map(([column, visible]) => (
                    <DropdownMenuItem
                      key={column}
                      onClick={() => toggleColumnVisibility(column as keyof ColumnVisibility)}
                    >
                      <Checkbox
                        checked={visible}
                        className="mr-2"
                        disabled
                      />
                      {column === 'Reference' ? 'Référence' : 
                       column === 'Libelle' ? 'Libellé' : 
                       column === 'Sous_Traitance' ? 'Sous-traitance' :
                       'Date de création'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Référence</label>
                  <Input
                    placeholder="Filtrer par référence"
                    value={fieldFilters.Reference}
                    onChange={(e) => updateFieldFilter('Reference', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Libellé</label>
                  <Input
                    placeholder="Filtrer par libellé"
                    value={fieldFilters.Libelle}
                    onChange={(e) => updateFieldFilter('Libelle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sous-traitance</label>
                  <Select
                    value={fieldFilters.Sous_Traitance}
                    onValueChange={(value) => updateFieldFilter('Sous_Traitance', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous</SelectItem>
                      <SelectItem value="oui">Oui</SelectItem>
                      <SelectItem value="non">Non</SelectItem>
                      <SelectItem value="non défini">Non défini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date de création</label>
                  <Input
                    placeholder="Filtrer par date"
                    value={fieldFilters.Heure}
                    onChange={(e) => updateFieldFilter('Heure', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Effacer les filtres
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Selection Info */}
        {selectedTypeFacturations.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              {selectedTypeFacturations.length} élément(s) sélectionné(s)
            </span>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Désélectionner tout
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      paginatedTypeFacturations.length > 0 &&
                      selectedTypeFacturations.length === paginatedTypeFacturations.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columnVisibility.Reference && (
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('Reference')}
                  >
                    <div className="flex items-center gap-2">
                      Référence
                      {renderSortIcon('Reference')}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.Libelle && (
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('Libelle')}
                  >
                    <div className="flex items-center gap-2">
                      Libellé
                      {renderSortIcon('Libelle')}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.Sous_Traitance && (
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('Sous_Traitance')}
                  >
                    <div className="flex items-center gap-2">
                      Sous-traitance
                      {renderSortIcon('Sous_Traitance')}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.Heure && (
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('Heure')}
                  >
                    <div className="flex items-center gap-2">
                      Date de création
                      {renderSortIcon('Heure')}
                    </div>
                  </TableHead>
                )}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">Chargement...</p>
                  </TableCell>
                </TableRow>
              ) : paginatedTypeFacturations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">Aucun type de facturation trouvé</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTypeFacturations.map((typeFacturation) => (
                  <TableRow key={typeFacturation.Reference}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTypeFacturations.includes(typeFacturation.Reference)}
                        onCheckedChange={(checked) =>
                          handleSelectTypeFacturation(typeFacturation.Reference, checked as boolean)
                        }
                      />
                    </TableCell>
                    {columnVisibility.Reference && (
                      <TableCell className="font-medium">
                        {typeFacturation.Reference}
                      </TableCell>
                    )}
                    {columnVisibility.Libelle && (
                      <TableCell>{typeFacturation.Libelle || "Non défini"}</TableCell>
                    )}
                    {columnVisibility.Sous_Traitance && (
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={getSousTraitanceColor(typeFacturation.Sous_Traitance)}
                        >
                          {getSousTraitanceLabel(typeFacturation.Sous_Traitance)}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.Heure && (
                      <TableCell className="text-sm text-muted-foreground">
                        {formatCreationDate(typeFacturation.Heure)}
                      </TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewClick(typeFacturation)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(typeFacturation)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(typeFacturation.Reference)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredAndSortedTypeFacturations.length)} sur {filteredAndSortedTypeFacturations.length} entrées
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Lignes par page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <UpdateTypeFacturationDialog
        typeFacturation={selectedTypeFacturation}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        onSuccess={fetchTypeFacturations}
      />

      <ViewTypeFacturationDialog
        typeFacturation={selectedTypeFacturation}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de facturation ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 